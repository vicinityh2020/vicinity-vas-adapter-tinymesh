import React, {Component} from 'react';
import {Button, Col, FormControl, Row, Table} from "react-bootstrap";
import getAuthHeader from "../util/auth";
import {AlertDismissible} from "./alertDismissible";
import {handleHTTPError} from "../util/ErrorHandle";

class RoomSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: null,
            error: false,
            message: "",
            messageOK: "",
            alertOK: false
        };
        this.dismissError = this.dismissError.bind(this);
        this.showError = this.showError.bind(this);

        this.showOK = this.showOK.bind(this);
        this.dismissOK = this.dismissOK.bind(this);
    }

    fetchRoomData() {
        fetch('/adapter/room-overview', {
            credentials: "include",
            headers: {
                "Authorization": getAuthHeader(),
            }
        }).then(response => {
            handleHTTPError(response);
            return response.json();
        }).then(json => {
            this.setState({rooms: json})
        }).catch(err => {
            if (err.message === "401") {
                this.props.history.push('/')
            } else {
                console.log(err)
            }
        })
    }

    componentDidMount() {
        this.fetchRoomData();
    }

    showError(msg) {
        this.setState({message: msg});
        this.setState({
            error: true,
            alertOK: false
        })
    }

    dismissError() {
        this.setState({error: false})
    }

    showOK(msg) {
        this.setState({messageOK: msg});
        this.setState({
            alertOK: true,
            error: false
        })
    }

    dismissOK() {
        this.setState({alertOK: false})
    }

    render() {
        return (
            <Row>
                {this.state.error ? (
                    <Col xs={12}>
                        {<AlertDismissible dismiss={this.dismissError}
                                           message={this.state.message}
                                           type={"danger"}/>}
                    </Col>
                ) : ""}
                {this.state.alertOK ? (
                    <Col xs={12}>
                        {<AlertDismissible dismiss={this.dismissOK}
                                           message={this.state.messageOK}
                                           type={"success"}/>}
                    </Col>
                ) : ""}
                <Col xs={12}>
                    {this.state.rooms ? (
                        <Table striped={true} condensed={true}>
                            <thead>
                            <tr>

                                <th>Room Name</th>
                                <th>Current Threshold</th>
                                <th>Notification Number</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.rooms.map(room => {
                                return (<RoomSettingRow room={room} showError={this.showError} showOK={this.showOK}/>)
                            })}
                            </tbody>
                        </Table>
                    ) : "Nothing to show"}
                </Col>
            </Row>
        )
    }
}

class RoomSettingRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            threshold: this.props.room.threshold,
            phone: this.props.room.phone,
        };
        this.updateThreshold = this.updateThreshold.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
        this.updatePhone = this.updatePhone.bind(this);
    }

    updateThreshold(event) {
        this.setState({threshold: event.target.value})
    }

    updatePhone(event) {
        this.setState({phone: event.target.value})
    }

    updateSettings() {
        let threshold = parseInt(this.state.threshold, 10);
        if (!threshold || threshold <= 0) {
            this.props.showError("Error: invalid value");
        } else {
            console.log(`${threshold} is of type ${typeof threshold}`);
            fetch("/adapter/update_room_settings", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": getAuthHeader()
                },
                body: JSON.stringify({
                    id: this.props.room.id,
                    newThreshold: threshold,
                    phone: this.state.phone
                })
            }).then(resp => {
                handleHTTPError(resp);
                return resp.json()
            }).then(json => {
                console.log(json);
                if (json.OK) {
                    this.props.showOK("Saved Successfully!");
                    console.log("Update ok")
                } else {
                    if (json.msg) {
                        this.props.showError("Server Error: " + json.msg);
                    } else {
                        this.props.showError("Error: Server error");
                    }
                }
            }).catch(reason => {
                if (reason.message === "401") {
                    this.props.history.push('/')
                } else {
                    console.log(reason);
                    this.props.showError("Error: Problems sending data to server");
                }
            })
        }

    }

    render() {
        return (<tr>
            <td>{this.props.room.name}</td>
            <td>
                <FormControl
                    id="formControlsText"
                    type="number"
                    label="Threshold"
                    value={this.state.threshold}
                    onChange={this.updateThreshold}
                />
            </td>
            <td>
                <FormControl
                    id="formControlsText"
                    type="string"
                    label="Phone"
                    value={this.state.phone}
                    onChange={this.updatePhone}
                />
            </td>
            <td>
                <Button bsStyle={"primary"} onClick={this.updateSettings}>
                    Save
                </Button>
            </td>
        </tr>)
    }
}

export default RoomSettings;
