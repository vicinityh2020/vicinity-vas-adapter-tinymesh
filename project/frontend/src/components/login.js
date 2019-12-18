import React, {Component} from 'react';
import {Button, Col, ControlLabel, Form, FormControl, FormGroup, Row} from "react-bootstrap";
import {AlertDismissible} from "./alertDismissible";

class Login extends Component {
    constructor(props) {
        super(props);
        // noinspection RedundantConditionalExpressionJS
        this.state = {
            username: "",
            password: "",
            loggedIn: localStorage.getItem('token') ? true : false,
            success: false,
            authErr: false,
            authErrMsg: "",
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
                    {this.state.authErr ? <AlertDismissible type={"danger"} message={this.state.authErrMsg}/> : ""}
                    {!this.state.success ?
                        <Form horizontal>
                            <FormGroup controlId="formHorizontalText">
                                <Col componentClass={ControlLabel} xs={2} lg={3}>
                                    Brukernavn
                                </Col>
                                <Col xs={12} lg={6}>
                                    <FormControl type="email" onChange={this.changeLogin} placeholder="Username"/>
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalPassword">
                                <Col componentClass={ControlLabel} xs={2} lg={3}>
                                    Passord
                                </Col>
                                <Col xs={12} lg={6}>
                                    <FormControl type="password" onChange={this.changePass} placeholder="Password"/>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col xs={3} lg={1} lgOffset={3}>
                                    <Button type="button" onClick={this.handleSubmit}>Log in</Button>
                                </Col>
                            </FormGroup>
                        </Form>
                        : <a href="/overview">Logget inn, click her for å forsette</a>}
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
        }).then(response => {
            console.log(response);
            // handleHTTPError(response);
            return response.json();
        }).then(json => {
            console.log(json);
            if (json.error) {
                console.log(json.error);
                this.setState({
                    authErr: true,
                    authErrMsg: json.error
                })
            } else {
                if (json.token) {
                    localStorage.setItem("token", json.token);
                    this.setState({success: true})
                } else {
                    this.setState({
                        authErr: true,
                        authErrMsg: "Auth feil."
                    })
                }
            }
        }).catch(reason => {

        })
    }
}

export default Login;
