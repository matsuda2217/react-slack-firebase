import React from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from './../firebase';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Msg from './Msg';

class Message extends React.Component {

  state={
    messageRef: firebase.database().ref("messages"),
    messages: [],
    channel: this.props.currentChannel,
    user: this.props.currentUser,
  }
  componentWillReceiveProps = nextProps => {
    this.setState({channel: nextProps.currentChannel})
  }

  componentDidMount = () => {
    const { user, channel } = this.state;
    // const {currentChannel: channel} = this.props;
    console.log("currentChannel", channel);
    if(channel && user) {
      this.addListener(channel.id);
    }
  }
  // componentDidUpdate = () => {
  //   const { channel, user } = this.state;
  //   if(channel && user) {
  //     this.addListener(channel.id);
  //   }
  // }

  addListener = channelID => {
    this.addMessageListener(channelID)
  }

  addMessageListener = channelID => {
    const loadedMessages = [];
    const { messageRef } = this.state;
    messageRef.child(channelID).on("child_added", snap => {
      console.log("messagesssss", snap.val());
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messageLoading: false
      })
    })
  }
  displayMessages = messages => (
    messages.length > 0 && messages.map(msg => (
      <Msg
        msg={msg}
      />
    ))
  )
  render() {
    const { messageRef, messages } = this.state;
    const { currentUser, currentChannel } = this.props;
    return (
      <React.Fragment>
        <MessagesHeader/>
          <Segment>
            <Comment.Group className="messages">
              {/* messages */}
              {this.displayMessages(messages)}
            </Comment.Group>
          </Segment>
        <MessagesForm
          messageRef={messageRef}
          currentUser={currentUser}
          currentChannel={currentChannel}
        />
      </React.Fragment>
    )
  }
}
export default Message;