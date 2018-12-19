import React, {Component} from 'react';
import {Panel} from 'react-bootstrap';
import PropTypes from 'prop-types';


class InfoPane extends Component {
    static propTypes = {
        heading: PropTypes.string.isRequired,
        children: PropTypes.any.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Panel>
                <Panel.Heading>
                    <Panel.Title toggle>
                        {this.props.heading}
                    </Panel.Title>
                </Panel.Heading>
                <Panel.Collapse>
                    <Panel.Body>
                        {this.props.children}
                    </Panel.Body>
                </Panel.Collapse>
            </Panel>
        );
    }
}

export default InfoPane;