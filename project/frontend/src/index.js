import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<App/>,
    // eslint-disable-next-line no-undef
    document.getElementById('root'));
registerServiceWorker();
