import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Grid, Row} from "react-bootstrap";
import Overview from "./components/overview";
import RoomHistory from './components/roomHistory';
import Header from "./components/header";
import Login from "./components/login";
import './index.css';


class App extends Component {
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
