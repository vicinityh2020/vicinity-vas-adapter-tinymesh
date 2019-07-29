import React, {Component} from 'react';
import {Button, Col, Glyphicon, Row, Table} from 'react-bootstrap';
import RoomInfo from "./overviewRow";
import update from 'immutability-helper';
import moment from 'moment';
import getAuthHeader from "../util/auth";
import {handleHTTPError} from "../util/ErrorHandle";
import {checkAuthTokenAndRedirect} from "../util/ErrorHandle";
import CleanAllRoomsWidget from "./cleanAllRoomsWidget";

import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import ModalInfo from "./ModalInfo";
import Link from "react-router-dom/es/Link";


class Overview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false,
            showInfo: false,
            rooms: null,
            weather: null,
            user: "",
        };

        this.cleanRoom = this.cleanRoom.bind(this);
        this.updateRoomInfo = this.updateRoomInfo.bind(this);
        this.toggleInfo = this.toggleInfo.bind(this);

        if (this.state.loggedIn === false) {
            // eslint-disable-next-line react/prop-types
            this.props.history.push('/')
        }
    }

    cleanRoom(roomNumber) {
        this.state.rooms.map((room, index) => {
            if (room.number === roomNumber) {
                let updateObj = {};
                updateObj[index] = {
                    needsCleaning: {$set: false},
                    visits: {$set: 0}
                };
                this.setState({rooms: update(this.state.rooms, updateObj)});
            }
        });
    }

    updateRoomInfo() {
        fetch('/adapter/room-overview', {
            credentials: "include",
            headers: {
                "Authorization": getAuthHeader(),
            }
        }).then(response => {
            handleHTTPError(response);
            return response.json();
        }).then(json => {
            let roomOverview = json;
            for (let room of roomOverview) {
                if (room['lastCleaned'] !== 'Never') {
                    room['lastCleaned'] = moment(room['lastCleaned']).fromNow();
                }
            }
            for (let room of roomOverview) {
                room['showInfo'] = false
            }
            this.setState({rooms: roomOverview})
        }).catch(err => {
            checkAuthTokenAndRedirect.call(this, err);

        })
    }

    fetchWeather() {
        fetch('/adapter/weather', {
            credentials: "include",
            headers: {
                "Authorization": getAuthHeader(),
            }
        }).then(response => {
            handleHTTPError(response);
            return response.json();
        }).then(json => {
            console.log(json);
            this.setState({weather: json})
        }).catch(err => {
            checkAuthTokenAndRedirect.call(this, err);
        })
    }

    componentDidMount() {
        this.updateRoomInfo();
        this.fetchWeather();
    }

    getWeather() {
        let weatherString = "";
        if (this.state.weather !== null) {
            weatherString = `${this.state.weather.temp}° og ${this.state.weather.percp} mm. nedbør`
        } else {
            weatherString = "Weather not available";
        }
        return weatherString;
    }

    toggleInfo() {
        this.setState(
            {showInfo: !this.state.showInfo}
        );
    }

    render() {
        const columns = [{
            dataField: 'name',
            text: 'Rom',
            sort: true,
            formatter: (cell, row) => (<Link to={`/overview/${row.id}`}>{cell}</Link>)
        }, {
            dataField: 'visits',
            sort: true,
            text: 'Besøk'
        }, {
            dataField: 'lastCleaned',
            sort: true,
            text: 'Sist Vask'
        }, {
            dataField: 'needsCleaning',
            sort: true,
            text: 'Ren?',
            formatter: (cell, row) => (
                row.needsCleaning ?
                    (<Glyphicon glyph="remove" className={"red"}/>) :
                    <Glyphicon glyph="ok" className={"green"}/>
            )
        }, {
            dataField: '',
            text: 'Info',
            formatter: (cell, row) => (
                <RoomInfo room={row}
                          setRoomState={this.cleanRoom}
                          updateRooms={this.updateRoomInfo}/>
            )
        }];

        return (
            <Row>
                <Row>
                    <Col xs={12} lg={4}>
                        <h4>Vær for i dag i Moss:</h4><h5>{this.getWeather()}</h5>
                    </Col>
                    <Col xs={12} lg={2} lgOffset={10}>
                        {this.state.rooms ? <CleanAllRoomsWidget rooms={this.state.rooms}/> : <span> </span>}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={12}>
                        {this.state.rooms ?
                            <BootstrapTable keyField='id'
                                            data={this.state.rooms}
                                            columns={columns}
                                            bordered={false}
                                            striped={true}
                                            wrapperClasses={"auto_width_table"}
                                            defaultSorted={[{dataField: "name", order: "asc"}]}/> :
                            <p>Ingenting å vise eller server feil</p>}
                    </Col>
                </Row>
            </Row>

        )
    }
}

export default Overview;
