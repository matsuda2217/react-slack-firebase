import React from 'react';
import { connect } from 'react-redux';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from './../firebase';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Msg from './Msg';
import { setUserPosts } from './../../actions/channelActions';
import Typing from './Typing';
import Skeleton from './Skeleton';

class Message extends React.Component {

  state = {
    messageRef: firebase.database().ref("messages"),
    privateRef: firebase.database().ref("private"),
    userRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    typingRef: firebase.database().ref("typing"),
    isPrivateChannel: this.props.isPrivateChannel,
    messages: [],
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    searchTerm: '',
    searchLoading: false,
    searchResult: [],
    isStarredChannel: false,
    starredChannels: [],
    usersTyping: [],
    messageLoading: true,
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

  componentDidUpdate = (prevProps, prevState) => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth"});
    }
  }

  addListener = channelID => {
    this.addMessageListener(channelID);
    this.addStarredListener(channelID);
    this.addTypingListener(channelID);
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
  addTypingListener = channelID => {
    const { typingRef} = this.state;
    const { currentUser: user } = this.props;
    let usersTyping = [];
    typingRef
      .child(channelID)
      .on("child_added", snap => {
        if( snap.key !== user.uid ) {
          usersTyping =  usersTyping.concat({
            id: snap.key, 
            name: snap.val()
          });
        } 
        this.setState({usersTyping})
      })
    typingRef
      .child(channelID)
      .on("child_removed", snap => {
        const index = usersTyping.findIndex( user => {
          return user.id == snap.key;
        })
        if (index != -1) {
          usersTyping = usersTyping.filter(user => {
            return user.id !== snap.key
          })
        } 
        this.setState({usersTyping});
      })

    this.state.connectedRef.on("value", snap => {
      if (snap.val()===true) {
        this.state.typingRef
          .child(channelID)
          .child(this.state.user.uid)
          .onDisconnect()
          .remove(err => {
            if(err !=null) {
              console.log(err);
            }
          })
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
  displayUsersTyping = users => (
    users.length > 0 && users.map( user => (
      <div style={{display: 'flex', alignItems: "center"}}>
        <span className="user__typing">{user.name} is typing</span><Typing/>
      </div>
    ))
  )
  displayMessageSkeleton = messageLoading => (
    messageLoading ? (
      <React.Fragment>
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i}/>
        ))}
      </React.Fragment>
    ) : null
  )
  render() {
    const { messages, searchResult, searchLoading, searchTerm, isStarredChannel, usersTyping, messageLoading } = this.state;
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
              {this.displayMessageSkeleton(messageLoading)}
              {/* messages */}
              { searchTerm ? this.displayMessages(searchResult) : this.displayMessages(messages)}
              {this.displayUsersTyping(usersTyping)}
              <div ref={node => (this.messagesEnd = node)}></div>
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