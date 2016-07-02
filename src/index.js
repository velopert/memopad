import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router';
import { App, Login, Register, Home } from 'containers';

import { push, routerMiddleware, syncHistoryWithStore } from 'react-router-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from 'reducers';



const middleware = routerMiddleware(browserHistory);
const store = createStore(reducers, applyMiddleware(middleware));
const history = syncHistoryWithStore(browserHistory, store);


const rootElement = document.getElementById('root');
ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="home" component={Home}/>
            <Route path="login" component={Login}/>
            <Route path="register" component={Register}/>
        </Route>
    </Router>, rootElement);
