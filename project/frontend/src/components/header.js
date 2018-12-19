import React, {Component} from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import Link from "react-router-dom/es/Link";

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false,
            user: ''
        }
    }

    componentWillMount() {
        if (this.state.loggedIn) {
            fetch('/adapter/user', {
                credentials: "include",
                headers: {
                    "Authorization": `Token ${localStorage.getItem('token')}`
                }
            }).then(resp => resp.json())
              .then(json => this.setState({user: json.username}))
              .catch(reason => console.log(reason))
        }
    }

    render() {
        let logInStatusText;

        if (this.state.loggedIn) {
            logInStatusText = (
                <Navbar.Text>
                    Logged in as: {this.state.user}
                </Navbar.Text>);
        }else{
            logInStatusText = (
                <Navbar.Text>
                    <Link to={"/"}>Please log in</Link>
                </Navbar.Text>);
        }
        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">Predictive Operations</a>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                {logInStatusText}
                <Navbar.Collapse >
                    <Nav pullRight>
                        <NavItem eventKey={1} href="/overview">
                            Overview
                        </NavItem>
                        <NavItem eventKey={2} href={'/adapter/admin'}>
                            Admin
                        </NavItem>

                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Header;