import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col, ListGroup, ListGroupItem, PageHeader, Row} from 'react-bootstrap';
import InfoPane from './panel'
import moment from 'moment';

class RoomHistory extends Component {
    static propTypes = {
        match: PropTypes.any.isRequired
    };


    constructor(props) {
        super(props);
        this.state = {
            history: null,
        }
    }

    async fetchHistory() {
        await fetch(`/adapter/clean-room/${this.props.match.params.roomNumber}`, {
            method: 'GET'
        }).then(value => {
            return value.json()
        }).then(json => {
            json.sort((a, b) => {
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
        })
    }

    infoHeading(cleaningEvent) {
        return cleaningEvent.cleanedBy + " at " + moment(cleaningEvent.datetime).toString()
    }

    renderHistory() {
        let keyIndex = 0;
        let history = this.state.history;
        return history.map(value => {
            return (
                <Col xs={12} key={keyIndex++}>
                    <InfoPane
                        heading={this.infoHeading(value)}>
                        <ListGroup>
                            <ListGroupItem header={'Date'}>
                                {moment(value.datetime).toString()}
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
                        History for Room {this.props.match.params.roomNumber}
                    </PageHeader>
                </Col>
                {this.state.history ? this.renderHistory() : this.noEvents()}
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