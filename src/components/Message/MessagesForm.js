import React from 'react';
import { Segment, Input, Button } from 'semantic-ui-react';
import firebase from './../firebase';

class MessagesForm extends React.Component{
  state = {
    user: this.props.currentUser,
    channel: this.props.currentChannel,
    messageRef: this.props.messageRef,
    message: '',
    loading: false,
    errors: [],
  }

  componentWillReceiveProps = nextProps => {
    this.setState({channel: nextProps.currentChannel});
  }
  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  }

  sendMessage = event => {
    event.preventDefault();
    const {message, channel, messageRef} = this.state;
    this.setState({loading: true});
    if (message) {
      messageRef
      .child(channel.id)
      .push()
      .set(this.setMessage())
      .then(() => {
        this.setState({loading: false, errors: [], message: ''});
        console.log("Message created");
      })
      .catch(err => {
        console.log("err", err);
        this.setState({loading: false, errors: this.state.errors.concat(err)})
      })
    } else {
      this.setState({loading: false, errors: this.state.errors.concat({message: "Fill in message"})});
    }
  }
  setMessage = () => {
    const { message, user } = this.state;
    const messageObj = {
      content: message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        avatar: user.photoURL,
        name: user.displayName
      }
    }
    return messageObj;
  }
  render() {
    const {message, errors, loading} = this.state;
    return(
      <Segment className="message__form">
        <Input
          onChange={this.handleChange}
          fluid
          name="message"
          style={{marginBottom: '.7em'}}
          label={<Button icon="add"/>}
          labelPosition="left"
          placeholder="Write your message"
          value={message}
          className={errors.some(err => err.message.includes("message")) ? "error" : ""}
        />
        <Button.Group>
          <Button
            disabled={loading}
            onClick={this.sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    )
  }
}

export default MessagesForm;