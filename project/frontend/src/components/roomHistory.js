import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col, ListGroup, ListGroupItem, PageHeader, Row} from 'react-bootstrap';
import InfoPane from './panel'
import moment from 'moment';
import {handleHTTPError} from "../util/ErrorHandle";
import {checkAuthTokenAndRedirect} from "../util/ErrorHandle";

class RoomHistory extends Component {
    static propTypes = {
        match: PropTypes.any.isRequired
    };


    constructor(props) {
        super(props);
        this.state = {
            history: null,
            name: ""
        }
    }

    async fetchHistory() {
        await fetch(`/adapter/clean-room/${this.props.match.params.roomNumber}`, {
            method: 'GET',
            headers: {
                "Authorization": `Token ${localStorage.getItem('token')}`
            }
        }).then(response => {
            handleHTTPError(response);
            return response.json()
        }).then(json => {
            this.setState({name: json.name});
            json.data.sort((a, b) => {
                // + sign before date forces to get unix timestamp
                if (+(new Date(a.datetime) > +(new Date(b.datetime)))) {
                    return -1
                } else if (+(new Date(a.datetime) === +(new Date(b.datetime)))) {
                    return 0
                } else {
                    return 1
                }
            });
            this.setState({history: json})
        }).catch(err => {
            if (err.message === "401"){
                this.props.history.push( '/')
            }else {
                console.log(err)
            }
        })
    }

    infoHeading(cleaningEvent) {
        return cleaningEvent.cleanedBy + " at " + moment(cleaningEvent.datetime).toString()
    }

    renderHistory() {
        let keyIndex = 0;
        let history = this.state.history;
        return history.data.map(value => {
            let dt = moment(value.datetime).format("ddd D MMM, hh:mm A");
            return (
                <Col xs={12} key={keyIndex++}>
                    <InfoPane
                        heading={dt}>
                        <ListGroup>
                            <ListGroupItem header={'Date'}>
                                {dt}
                            </ListGroupItem>
                            <ListGroupItem header={'Number of visits before cleaning'}>
                                {value.visits}
                            </ListGroupItem>
                            <ListGroupItem header={'Cleaning done by'}>
                                {value.cleanedBy}
                            </ListGroupItem>
                            <ListGroupItem header={'Threshold'}>
                                {value.threshold}
                            </ListGroupItem>
                            <ListGroupItem header={'Comment'}>
                                {value.comment ? value.comment : "No comment"}
                            </ListGroupItem>
                        </ListGroup>
                    </InfoPane>
                </Col>
            )
        });
    }

    loading() {
        return (
            <Row>
                <Col xs={12}>
                    <h3>Loading...</h3>
                </Col>
            </Row>
        )
    }

    loaded() {
        return (
            <Row>
                <Col xs={12}>
                    <PageHeader>
                        History for: {this.state.name ? this.state.name : "loading..."}
                    </PageHeader>
                </Col>
                {this.state.history.data.length !== 0 ? this.renderHistory() : this.noEvents()}
            </Row>
        )
    }

    componentDidMount() {
        (async () => await this.fetchHistory())()
    }

    noEvents() {
        return <Col xs={12}><h3>No cleanings recorded for this room.</h3></Col>
    }

    render() {
        return (
            <div>{this.state.history ? this.loaded() : this.loading()}</div>
        )
    }
}

export default RoomHistory;