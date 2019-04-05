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
class Login extends React.Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
  }
  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  }
  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid() ) {
      this.setState({loading: true, errors: []});
      firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(success => {
        this.setState({loading: false});
        console.log("Success", success);
      })
      .catch(err => {
        this.setState({loading: false, errors: this.state.errors.concat(err)})
        console.log("err ", err);
      })
    }
  }
  isFormValid() {
    let errors = [];
    let error;
    if( this.isFormEmpty(this.state) ) {
      error = { message: "Fill in all form fields" };
      this.setState({ errors: errors.concat(error)});
      return false;
    } else {
      return true;
    }
  }
  isFormEmpty = ({ email, password }) => {
    return !email && !password;
  }
  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleInputError =(errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? "error" : "" 
  }
  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="sheqel" color="violet" />
            Login for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email"
                onChange={this.handleChange}
                type="text"
                value={email}
                className={this.handleInputError(errors, 'email')}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
                value={password}
                className={this.handleInputError(errors, 'password')}
              />
              <Button className={loading ? "loading" : ""} color="orange" fluid size="large">Submit</Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          
          <Message>Dont have an account? <Link to="/register">Register</Link> </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
export default Login;
