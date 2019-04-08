import React, {Component} from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {checkAuthTokenAndRedirect, handleHTTPError} from "../util/ErrorHandle";


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            loggedIn: false
        };
        let loggedIn_status = localStorage.getItem('token') ? true : false
        if (loggedIn_status) {
            fetch('/adapter/user', {
                credentials: "include",
                headers: {
                    "Authorization": `Token ${localStorage.getItem('token')}`
                }
            }).then(resp => {
                // handleHTTPError(resp);
                return resp.json()
            }).then(json => {
                this.setState({
                    user: json.username,
                    loggedIn: loggedIn_status
                })
            }).catch(reason => {
                // checkAuthTokenAndRedirect.call(this, reason);
                console.log(reason)
            })
        }


    }

    componentWillMount() {
        let loggedIn_status = localStorage.getItem('token') ? true : false;
        this.setState({loggedIn: loggedIn_status});
        if (loggedIn_status) {
            fetch('/adapter/user', {
                credentials: "include",
                headers: {
                    "Authorization": `Token ${localStorage.getItem('token')}`
                }
            }).then(resp => {
                // handleHTTPError(resp);
                return resp.json();
            }).then(json => {
                this.setState({user: json.username})
            }).catch(reason => {
                console.log(reason)
            })
        }
    }

    render() {
        let logInStatus = this.state.loggedIn;

        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">Predictive Operations</a>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                {logInStatus ? <Navbar.Text>
                    Bruker: {this.state.user}
                </Navbar.Text> : <Navbar.Text>
                    <a to={"/"}>Logg inn</a>
                </Navbar.Text>}
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavItem eventKey={1} href="/overview">
                            Oversikt
                        </NavItem>
                        <NavItem eventKey={2} href="/settings">
                            Innstilinger
                        </NavItem>
                        {this.state.user === 'admin' ? <NavItem eventKey={3} href={'/adapter/admin'}>
                            Admin
                        </NavItem> : <span></span>}

                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Header;