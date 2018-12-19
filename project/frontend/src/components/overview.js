import React, {Component} from 'react';
import {Col, Row, Table} from 'react-bootstrap';
import RoomInfo from "./overviewRow";
import update from 'immutability-helper';
import moment from 'moment';

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
        if (this.state.loggedIn === false){
            // eslint-disable-next-line react/prop-types
            this.props.history.push( '/')
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
            headers: {}
        }).then(value => {
            return value.json();
        }).then(json => {
            let roomOverview = json;
            for (let room of roomOverview) {
                if(room['lastCleaned'] !== 'Never'){
                    room['lastCleaned'] = moment(room['lastCleaned']).fromNow();
                }
            }
            this.setState({rooms: roomOverview})
        })
    }

    fetchWeather() {
        fetch('/adapter/weather', {
            credentials: "include",
            headers: {}
        }).then(value => {
            return value.json();
        }).then(json => {
            this.setState({weather: json})
        }).catch(reason => {
            console.log(reason)
        })
    }

    componentDidMount() {
        this.updateRoomInfo();
        this.fetchWeather();
    }

    getWeather(){
        let weatherString = "";
        if(this.state.weather !== null){
            weatherString = `${this.state.weather.temp}° og ${this.state.weather.percp} mm. nedbør`
        }else{
            weatherString = "Weather not available";
        }
        return weatherString;
    }

    render() {
        return (
            <Row>
                <Col xs={12}>
                    <h4>Weather for today in Moss:</h4><h5>{this.getWeather()}</h5>
                </Col>
                <Col xs={12}>
                    {this.state.rooms ? (
                        <Table striped={true} condensed={true}>
                            <thead>
                            <tr>
                                <th className={"center"}>Room</th>
                                <th className={"center"}>Visits</th>
                                <th className={"center"}>Cleaned</th>
                                <th className={"center"}>Clean?</th>
                                <th className={"center"}>Info</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.rooms.map((room) => {
                                return (<RoomInfo key={room.number} room={room} setRoomState={this.cleanRoom}
                                                  updateRooms={this.updateRoomInfo}/>)
                            })}
                            </tbody>
                        </Table>) : (<p>Nothing to show</p>)}
                </Col>
            </Row>
        );
    }
}

export default Overview;
