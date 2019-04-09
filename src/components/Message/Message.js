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

  componentDidMount = () => {
    const { currentUser:user, currentChannel: channel } = this.props;
    if(channel && user) {
      this.addListener(channel.id);
    }
  }
  componentWillMount = () => {
    this.state.messageRef.off();
  }
  componentWillReceiveProps = nextProps => {
    const {currentChannel: channel} = nextProps;
    if (channel) {
      this.setState({ channel}, () => {
        this.addListener(channel.id);
      })
    }
  }

  addListener = channelID => {
    this.addMessageListener(channelID)
  }

  addMessageListener = channelID => {
    const loadedMessages = [];
    const { messageRef } = this.state;
    this.setState({messages: []});
    messageRef.child(channelID).on("child_added", snap => {
      // console.log("messagesssss", snap.val());
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
        key={msg.timestamp}
        msg={msg}
        user={this.props.currentUser}
      />
    ))
  )
  displayChannelName = channel => (channel ? `#${channel.name}`: "");
  caculateTotalUsers = messages => {
    let ids = messages.reduce((acc, msg) => {
      const { user: { id } } = msg;
      if(!acc.includes(id)) {
        acc.push(id)
      }
      return acc;
    }, [])
    return ids;
  }
  render() {
    const { messageRef, messages } = this.state;
    const { currentUser, currentChannel } = this.props;
    return (
      <React.Fragment>
        <MessagesHeader 
          userAmount={this.caculateTotalUsers(messages)}
          channelName={this.displayChannelName(currentChannel)}
        />
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