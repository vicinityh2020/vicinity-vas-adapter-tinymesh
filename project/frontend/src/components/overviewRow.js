import React, {Component} from 'react';
import {Button, Glyphicon} from 'react-bootstrap';
import PropTypes from 'prop-types';
import ModalInfo from "./ModalInfo";
import {Link} from "react-router-dom";

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
            <tr key={this.props.room.number}>
                <td className={"center"}><Link to={`/overview/${room.id}`}>{room.name}</Link></td>
                <td className={"center"}>{room.visits}</td>
                <td className={"center"}>{room.lastCleaned.toString()}</td>
                <td className={"center"}>{room.needsCleaning ?
                    (<Glyphicon glyph="remove" className={"red"}/>) :
                    <Glyphicon glyph="ok" className={"green"}/>}</td>
                <td className={"center"}>
                    <Button bsStyle={"primary"} onClick={this.toggleInfo}>
                        <Glyphicon glyph="info-sign"/>
                    </Button>
                </td>

                <ModalInfo room={room}
                           toggleInfo={this.toggleInfo}
                           show={this.state.showInfo}
                           setRoomState={this.props.setRoomState}
                           updateRoom={this.props.updateRooms}/>
            </tr>
        );
    }
}

export default RoomInfo;