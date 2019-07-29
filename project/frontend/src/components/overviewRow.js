import React, {Component} from 'react';
import {Button, Glyphicon} from 'react-bootstrap';
import PropTypes from 'prop-types';
import ModalInfo from "./ModalInfo";

class RoomInfo extends Component {
    static propTypes = {
        room: PropTypes.object,
        setRoomState: PropTypes.func,
        updateRooms: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            showInfo: false
        };

        this.toggleInfo = this.toggleInfo.bind(this)
    }

    toggleInfo() {
        this.setState(
            {showInfo: !this.state.showInfo}
        );
    }

    render() {
        const room = this.props.room;
        return (
            <span>
                <Button bsStyle={"primary"} onClick={this.toggleInfo}>
                        <Glyphicon glyph="info-sign"/>
                </Button>
                <ModalInfo room={room}
                           toggleInfo={this.toggleInfo}
                           show={this.state.showInfo}
                           setRoomState={this.props.setRoomState}
                           updateRoom={this.props.updateRooms}/>
            </span>
        )
    }
}

export default RoomInfo;