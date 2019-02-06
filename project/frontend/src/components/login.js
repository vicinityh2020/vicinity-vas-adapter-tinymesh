import React, {Component} from 'react';
import {Button, Col, ControlLabel, Form, FormControl, FormGroup, Row} from "react-bootstrap";

class Login extends Component {
    constructor(props) {
        super(props);
        // noinspection RedundantConditionalExpressionJS
        this.state = {
            username: "",
            password: "",
            loggedIn: localStorage.getItem('token') ? true : false,
            success: false
        };

        this.changePass = this.changePass.bind(this);
        this.changeLogin = this.changeLogin.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        if (this.state.loggedIn === true) {
            this.props.history.push('/overview')
        }
    }

    render() {
        return (
            <Row>
                <Col xs={12} lg={12}>
                    {!this.state.success ?
                    <Form horizontal>
                        <FormGroup controlId="formHorizontalEmail">
                            <Col componentClass={ControlLabel} xs={2} lg={3}>
                                Email
                            </Col>
                            <Col xs={12} lg={6}>
                                <FormControl type="email" onChange={this.changeLogin} placeholder="Email"/>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="formHorizontalPassword">
                            <Col componentClass={ControlLabel} xs={2} lg={3}>
                                Password
                            </Col>
                            <Col xs={12} lg={6}>
                                <FormControl type="password" onChange={this.changePass} placeholder="Password"/>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col xs={3} lg={1} lgOffset={3}>
                                <Button type="submit" onClick={this.handleSubmit}>Sign in</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                        : <a href="/overview">Successfully logged in, go to overview</a>}
                </Col>
            </Row>
        );
    }

    changePass(event) {
        this.setState({password: event.target.value});
    }

    changeLogin(event) {
        this.setState({username: event.target.value});
    }

    handleSubmit() {
        fetch("/adapter/login", {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "password": this.state.password,
                "username": this.state.username
            })
        }).then(value => {
            console.log(value);
            // console.log(value.text());
            return value.json();
        }).then(json => {
            localStorage.setItem("token", json.token);
            // this.props.history.push('/overview');
            this.setState({success: true})
        }).catch(reason => console.log(reason))
    }
}

export default Login;
