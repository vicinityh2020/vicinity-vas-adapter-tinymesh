import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Grid, Row} from "react-bootstrap";
import Overview from "./components/overview";
import RoomHistory from './components/roomHistory';
import Header from "./components/header";
import Login from "./components/login";
import './index.css';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false
        }
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Header/>
                </Row>
                <BrowserRouter basename={'/'}>
                    <Switch>
                        <Route exact path={'/'} component={Login}/>
                        <Route path={'/overview'} exact={true} component={Overview}/>
                        <Route path={'/overview/:roomNumber'} exact={true} component={RoomHistory}/>
                    </Switch>
                </BrowserRouter>
            </Grid>
        );
    }
}

export default App;
