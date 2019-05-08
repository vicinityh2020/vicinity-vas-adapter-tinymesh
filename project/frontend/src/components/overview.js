import React, {Component} from 'react';
import {Button, Col, Glyphicon, Row, Table} from 'react-bootstrap';
import RoomInfo from "./overviewRow";
import update from 'immutability-helper';
import moment from 'moment';
import getAuthHeader from "../util/auth";
import {handleHTTPError} from "../util/ErrorHandle";
import {checkAuthTokenAndRedirect} from "../util/ErrorHandle";
import CleanAllRoomsWidget from "./cleanAllRoomsWidget";


class Overview extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false,
            showInfo: false,
            rooms: null,
            weather: null,
            user: ""
        };
        this.cleanRoom = this.cleanRoom.bind(this);
        this.updateRoomInfo = this.updateRoomInfo.bind(this);
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

    render() {
        return (
            <Row>
                <Col xs={12}>
                    <h4>Vær for i dag i Moss:</h4><h5>{this.getWeather()}</h5>
                </Col>
                {this.state.rooms ? <CleanAllRoomsWidget rooms={this.state.rooms}/> : <span></span>}
                <Col xs={12}>
                    {this.state.rooms ? (
                        <Table striped={true} condensed={true}>
                            <thead>
                            <tr>
                                <th className={"center"}>Rom</th>
                                <th className={"center"}>Besøk</th>
                                <th className={"center"}>Sist Vask</th>
                                <th className={"center"}>Ren?</th>
                                <th className={"center"}>Info</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.rooms.map((room) => {
                                return (<RoomInfo key={room.number} room={room} setRoomState={this.cleanRoom}
                                                  updateRooms={this.updateRoomInfo}/>)
                            })}
                            </tbody>
                        </Table>) : (<p>Ingenting å vise eller server feil</p>)}
                </Col>
            </Row>
        );
    }
}

export default Overview;
