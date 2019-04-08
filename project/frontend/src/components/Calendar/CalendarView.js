import React, {Component} from 'react';
import moment from 'moment';
import {Bar} from "react-chartjs";
import {handleHTTPError} from "../../util/ErrorHandle";
import {PageHeader, Row} from "react-bootstrap";
import Col from "react-bootstrap/es/Col";
import RoomHistory from "../roomHistory";


class CalendarView extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            history: null,
            labels: null,
            data: null,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
    }

    fetchHistory() {
        fetch(`/adapter/clean-room/${this.props.match.params.roomNumber}`, {
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
            let labels = [];
            let data = [];

            this.setState({history: json});

            for (let cleaning of this.state.history.data) {
                // moment(cleaning.datetime).format("ddd D MMM, hh:mm A");
                labels.push(moment(cleaning.datetime).format("ddd D MMM"));
                data.push(cleaning.visits);
            }
            this.setState({labels: labels});
            this.setState({data: data});
        }).catch(err => {
            if (err.message === "401") {
                this.props.history.push('/')
            } else {
                console.log(err)
            }
        })
    }

    componentWillMount() {
        this.fetchHistory();

    }

    render() {
        return (
            <Row>
                <Row>
                    <Col lg={12} xs={12} md={12} sm={12}>
                        <PageHeader>{this.state.history ? this.state.history.name : "Loading..."}</PageHeader>
                    </Col>
                </Row>
                {this.state.data && this.state.labels ? <Col lg={6} smHidden={true} xsHidden={true}>
                    <Bar data={
                        {
                            labels: this.state.labels,
                            datasets: [{
                                label: '# of visits before cleaning',
                                data: this.state.data,
                            }]
                        }
                    } options={this.state.options} width={560} height={250}/>
                </Col> : <Col lg={6} lgOffset={3}>Loading...</Col>}
                {this.state.history ?
                    <Col lg={6}><RoomHistory history={this.state.history}/></Col> :
                    <Col lg={6} lgOffset={3}>Loading...</Col>}
            </Row>
        );
    }
}

export default CalendarView;