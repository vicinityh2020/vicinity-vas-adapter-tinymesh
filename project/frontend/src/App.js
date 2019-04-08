import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Grid, Row} from "react-bootstrap";
import Overview from "./components/overview";
import RoomHistory from './components/roomHistory';
import Header from "./components/header";
import Login from "./components/login";
import './index.css';
import RoomSettings from "./components/roomSettings";
import CalendarView from "./components/Calendar/CalendarView";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false
        }
    }

    render() {
        return (
            <BrowserRouter basename={'/'}>
                <Grid>
                    <Row>
                        <Header/>
                    </Row>
                    <Switch>
                        <Route exact path={'/'} component={Login}/>
                        {/*<Route exact path={'/calendar'} component={CalendarView}/>*/}
                        <Route path={'/overview'} exact={true} component={Overview}/>
                        <Route path={'/overview/:roomNumber'} exact={true} component={CalendarView}/>
                        <Route path={'/settings'} exact={true} component={RoomSettings}/>
                    </Switch>
                </Grid>
            </BrowserRouter>

        );
    }
}

export default App;
