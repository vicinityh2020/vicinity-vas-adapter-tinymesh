import React from "react";
import {Alert} from "react-bootstrap";

export class AlertDismissible extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Alert bsStyle={this.props.type} onDismiss={this.props.dismiss}>
                <p>
                    {this.props.message}
                </p>
            </Alert>
        );
    }
}