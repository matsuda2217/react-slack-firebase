import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension'

import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import Spinner from './Spinner';
import registerServiceWorker from './registerServiceWorker';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './components/firebase';
import rootReducer from './reducers/index';
import { setUser, clearUser } from './actions/index';

const store = createStore(rootReducer, composeWithDevTools());
class Root extends React.Component{
  componentDidMount() {
    firebase
    .auth()
    .onAuthStateChanged(user => {
      if (user) {
        alert(`${process.env.REACT_APP_SECRET_CODE}::::${process.env.NODE_ENV}:::${process.env.PUBLIC_URL}` );
        console.log("isLoading", this.props.isLoading);
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        console.log("else isLoading", this.props.isLoading);
        this.props.history.push("/login");
        this.props.clearUser();
      }
    })
  }
  render() {
    return this.props.isLoading ? <Spinner/> : (
      <Switch>
        <Route exact path="/" component={App}/>
        <Route  path="/login" component={Login}/>
        <Route  path="/register" component={Register}/>
      </Switch>
    )
  }
} 
const mapStateToProps = state => {
  return {
    isLoading: state.user.isLoading
  }
}
const RootWithRouter = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithRouter />
    </Router>
  </Provider>
  , document.getElementById('root'));

registerServiceWorker();
