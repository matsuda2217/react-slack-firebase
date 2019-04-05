import React from "react";
import md5 from 'md5';
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
    errors: [],
    loading: false,
    userRef: firebase.database().ref("users")
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
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(createdUser => {
        console.log("userCreated", createdUser);
        createdUser.user.updateProfile({
          displayName: this.state.username,
          photoURL: `https://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
        })
        .then(success => {
          console.log("success", success);
          this.saveUser(createdUser)
          .then((res) => {
            console.log("res", res);
            this.setState({loading: false});

          })
          .catch((err) => {
            console.log("err", err);
            this.setState({loading: false, errors: this.state.errors.concat(err)});
          })
        })
        .catch(error => {
          console.log("error", error);
          this.setState({loading: false, errors: this.state.errors.concat(error)});
        })
      })
      .catch(err => {
        console.log("Error happen: ", err);
        this.setState({loading: false, errors: this.state.errors.concat(err)});
      });
    }
  }
  isFormValid() {
    let errors = [];
    let error;
    if( this.isFormEmpty(this.state) ) {
      error = { message: "Fill in all form fields" };
      this.setState({ errors: errors.concat(error)});
      return false;
    } else if ( !this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error)});
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
      return false;
    } else {
      return true;
    }
  }
  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleInputError =(errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? "error" : "" 
  }
  
  saveUser = createdUser => {
    return this.state.userRef.child(createdUser.user.uid).set({
      displayName: createdUser.user.displayName,
      photoURL: createdUser.user.photoURL
    })
  }
  render() {
    const { username, email, password, passwordConfirmation, errors, loading } = this.state;
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
                value={this.state.password}
                className={this.handleInputError(errors, 'password')}
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
          
          <Message>Already a User ? <Link to="/login">Login</Link> </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
export default Register;
