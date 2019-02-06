import React, {Component} from 'react';
import {Button, FormControl, Glyphicon, ListGroup, ListGroupItem, Modal} from 'react-bootstrap';
import PropTypes from "prop-types";
import {Cookies} from 'react-cookie';
import getAuthHeader from "../util/auth";
import handleHTTPError from "../util/ErrorHandle";

const GlyphOK = () => {
    return (<Glyphicon glyph="ok" className={"green"}/>);
};

const GlyphNotOk = () => {
    return (<Glyphicon glyph="remove" className={"red"}/>);
};

class ModalInfo extends Component {
    static propTypes = {
        room: PropTypes.object,
        show: PropTypes.bool,
        toggleInfo: PropTypes.func,
        setRoomState: PropTypes.func,
        updateRoom: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.updateRoom = this.updateRoom.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.props.room.comment = this.props.room.comment ? this.props.room.comment : "No comment";
        this.state = this.props.room;
        this.setState({comment: "No comment"})
    }

    updateComment(event){
        this.setState({comment: event.target.value})
    }

    updateRoom() {
        (async () => {
            let cookie = new Cookies();
            let csrf = cookie.get('csrftoken');
            fetch(`/adapter/clean-room/${this.props.room.id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Authorization": getAuthHeader(),
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf,
                },
                body: JSON.stringify(this.state)
            }).then(response => {
                handleHTTPError(response);
                return;
            }).catch(err => {
                if (err.message === "401") {
                    this.props.history.push('/')
                } else {
                    console.log(err)
                }
            });
            this.props.toggleInfo();
            this.props.updateRoom();
        })();
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.toggleInfo}>
                <Modal.Header closeButton>
                    <Modal.Title>Room: {this.props.room.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        <ListGroupItem header="Status" bsStyle={this.props.room.needsCleaning ? 'danger' : 'success'}>
                            {this.props.room.needsCleaning ?
                                (<span><GlyphNotOk/> Needs cleaning</span>) :
                                (<span><GlyphOK/> Clean</span>)}
                        </ListGroupItem>
                        <ListGroupItem header="Number of room visits">{this.props.room.visits}</ListGroupItem>
                        <ListGroupItem header="Last Cleaned">{this.props.room.lastCleaned.toString()}</ListGroupItem>
                        <ListGroupItem header="Comment">
                            <FormControl componentClass="textarea" placeholder="Please enter your comment here" onChange={this.updateComment}/>
                            {/*{}*/}
                        </ListGroupItem>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle={"primary"}
                            onClick={this.updateRoom}>Clean</Button>
                    <Button onClick={this.props.toggleInfo}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ModalInfo;
