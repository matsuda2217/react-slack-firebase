import React from "react";
import {
  Grid,
  Button,
  Segment,
  Header,
  Icon,
  Message,
  Form
} from "semantic-ui-react";
import { Link } from 'react-router-dom';
import firebase from '../firebase';
class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: []
  }
  handleChange = event => {
    console.log("event", event.target.name, event.target.value);
    this.setState({[event.target.name]: event.target.value});
  }
  handleSubmit = event => {
    if (this.ifFormValid() ) {
      event.preventDefault();
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(userCreated => {
        console.log("userCreated", userCreated)
      })
      .catch(err => console.log("Error happen: ", err));
    }
  }
  isFormValid() {
    if( this.isFormEmpty(this.state) ) {
      return false;
    } else if ( !this.isPasswordValid()) {
      return false;
    } else {
      return true;
    }
  }
  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length
  }
  isPasswordValid = ({password, passwordConfirmation}) => {
    if (password.length < 6 || passwordConfirmation.length < 6 || ( password !== passwordConfirmation)) {
      return flase;
    } else {
      return true;
    }
  }
  render() {
    const { username, email, password, passwordConfirmation } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="UserName"
                onChange={this.handleChange}
                type="text"
                value={this.state.username}
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                type="text"
                value={this.state.email}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
                value={this.state.password}
              />
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                type="password"
                value={this.state.passwordConfirmation}
              />
              <Button color="orange" fluid size="large">Submit</Button>
            </Segment>
          </Form>
          <Message>Already a User ? <Link to="/login">Login</Link> </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
export default Register;
