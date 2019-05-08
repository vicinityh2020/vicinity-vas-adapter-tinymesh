import React, {Component} from 'react';
import {Button, Col} from "react-bootstrap";
import getAuthHeader from "../util/auth";
import {handleHTTPError} from "../util/ErrorHandle";

class CleanAllRoomsWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rooms: this.props.rooms ? this.props.rooms : null
        };

        this.cleanAllRooms = this.cleanAllRooms.bind(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({rooms: nextProps.rooms});
    }

    cleanAllRooms() {
        if (this.state.rooms === null) {
            return;
        }

        this.state.rooms.map(room => {
            fetch(`/adapter/clean-room/${room.id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Authorization": getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(room)
            }).then(response => {
                handleHTTPError(response);
                window.location.reload();
            }).catch(err => {
                if (err.message === "401") {
                    this.props.history.push('/')
                } else {
                    console.log(err)
                }
            });
        })
    }

    render() {
        return (
            <Col xs={12}>
                <Button bsStyle={"primary"} style={{float: "right"}} onClick={this.cleanAllRooms}>
                    Vask Alle Rom
                </Button>
            </Col>
        );
    }
}

export default CleanAllRoomsWidget;