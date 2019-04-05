import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension'

import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './components/firebase';
import rootReducer from './reducers/index';
import { setUser } from './actions/index';

const store = createStore(rootReducer, composeWithDevTools());
class Root extends React.Component{
  componentDidMount() {
    firebase
    .auth()
    .onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
      }
    })
  }
  render() {
    return (
      <Switch>
        <Route exact path="/" component={App}/>
        <Route  path="/login" component={Login}/>
        <Route  path="/register" component={Register}/>
      </Switch>
    )
  }
} 
const RootWithRouter = withRouter(connect(null, { setUser })(Root));
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithRouter />
    </Router>
  </Provider>
  , document.getElementById('root'));

registerServiceWorker();
