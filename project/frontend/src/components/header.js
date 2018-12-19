import React, {Component} from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';

class Header extends Component {
    render() {
        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">Predictive Operations</a>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
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