import React from 'react';
import { connect } from 'react-redux';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from './../firebase';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Msg from './Msg';
import { setUserPosts } from './../../actions/channelActions';

class Message extends React.Component {

  state = {
    messageRef: firebase.database().ref("messages"),
    privateRef: firebase.database().ref("private"),
    userRef: firebase.database().ref("users"),
    isPrivateChannel: this.props.isPrivateChannel,
    messages: [],
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    searchTerm: '',
    searchLoading: false,
    searchResult: [],
    isStarredChannel: false,
    starredChannels: [],
  }

  componentDidMount = () => {
    const { currentUser: user, currentChannel: channel } = this.props;
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
      this.setState({ channel }, () => {
        this.addListener(channel.id);
      })
    }
  }

  addListener = channelID => {
    this.addMessageListener(channelID);
    this.addStarredListener(channelID);
  }

  addMessageListener = channelID => {
    const loadedMessages = [];
    const { messageRef } = this.state;
    this.setState({messages: []});
    this.getMessageRef().child(channelID).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messageLoading: false
      })
      this.caculateTotalUsers(loadedMessages);
      this.countUserPosts(loadedMessages);
    })
  }

  addStarredListener = channelID => {
    const { userRef, user } = this.state;
    userRef
    .child(user.uid)
    .child("starred")
    .once("value")
    .then(data => {
      if(data.val() !== null) {
        const channelIds = Object.keys(data.val());
        const prevStarred = channelIds.includes(channelID);
        this.setState({isStarredChannel: prevStarred});
      }
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
  displayChannelName = (channel, isPrivateChannel) => {
    return channel ? isPrivateChannel ? `@${channel.name}`  : `#${channel.name}` : "";
  }
  
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

  countUserPosts = messages => {
    let userPosts = messages.reduce((acc, msg) => {
      if (msg.user.name in acc) {
        acc[msg.user.name].count +=1;
      } else {
        acc[msg.user.name] = {
          avatar: msg.user.avatar,
          count: 1
        }
      }
      return acc;
    }, {})
    this.props.setUserPosts(userPosts);
  }
  handleSearchMessage = event => {
    let searchTerm = event.target.value;
    this.setState({
      searchLoading: true,
      searchTerm
    });
    let searchRegex = new RegExp(searchTerm, "gi");
    let searchResult = [];
    searchResult = this.state.messages.reduce((acc, msg) => {
      if (msg.content && msg.content.match(searchRegex) || msg.user.name.match(searchRegex)) {
        acc.push(msg);
      }
      return acc;
    }, []);
    this.setState({
      searchResult,
    }, () => setTimeout( () => this.setState({searchLoading: false}) , 1000))
  }

  getMessageRef = () => {
    const { messageRef, privateRef } = this.state;
    const { isPrivateChannel } = this.props;
    return isPrivateChannel ? privateRef : messageRef;
  }

  starredChannel = () => {
    this.setState(prevState => ({
      isStarredChannel: !prevState.isStarredChannel
    }), () => {
      this.handleStarredChannel();
    })
  }
  handleStarredChannel = () => {
    const { userRef, channel, user, isStarredChannel } = this.state;
    const starredRef = userRef.child(user.uid).child('starred');
    if (isStarredChannel) {
      console.log("star");
      starredRef
      .update({
        [channel.id] : {
          aboult: channel.about,
          createdBy: channel.createdBy,
          name: channel.name
        }
      })
      .then(() => {
        console.log("Starred success");
        
      })
      .catch(err => {
        console.log("Starred err: ", err);
      })
    } else {
      console.log("un-star");
      starredRef.child(channel.id)
      .remove( err => {
        console.log("remove starred error:", err);
      })
    }
  }
  render() {
    const { messages, searchResult, searchLoading, searchTerm, isStarredChannel } = this.state;
    const { currentUser, currentChannel, isPrivateChannel } = this.props;
    return (
      <React.Fragment>
        <MessagesHeader
          searchLoading={searchLoading}
          handleSearchMessage={this.handleSearchMessage}
          userAmount={this.caculateTotalUsers(messages)}
          channelName={this.displayChannelName(currentChannel, isPrivateChannel)}
          isPrivateChannel={isPrivateChannel}
          isStarredChannel={isStarredChannel}
          starredChannel={this.starredChannel}
        />
          <Segment>
            <Comment.Group className="messages">
              {/* messages */}
              { searchTerm ? this.displayMessages(searchResult) : this.displayMessages(messages)}
            </Comment.Group>
          </Segment>
        <MessagesForm
          messageRef={this.getMessageRef}
          currentUser={currentUser}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
        />
      </React.Fragment>
    )
  }
}
export default connect(null, { setUserPosts })(Message);