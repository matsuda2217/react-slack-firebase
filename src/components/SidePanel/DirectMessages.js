import React from 'react';
import firebase from './../firebase';
import { Menu, Icon } from 'semantic-ui-react';

class DirectMessages extends React.Component {
  state = {
    users: [],
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
  }

  componentDidMount = () => {
    if(this.props.user) {
      this.addListener(this.props.user.uid);
    }
  }
  componentWillUnmount = () => {
    const {usersRef, connectedRef, presenceRef} = this.state;
    usersRef.off();
    connectedRef.off();
    presenceRef.off();
  }

  addListener = currentUid => {
    let loadedUsers = [];
    this.state.usersRef.on("child_added", snap => {
      if(currentUid !== snap.key) {
        let user = snap.val();
        user['uid'] = snap.key;
        user['statue'] = 'offline';
        loadedUsers.push(user);
        this.setState({ users: loadedUsers });
      }
    })

    this.state.connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.log(err);
            
          }
        })
      }
    })
    this.state.presenceRef.on("child_added", snap => {
      if (currentUid !== snap.key) {
        // add status to user
        this.addStatus(snap.key);
      }
    })
    this.state.presenceRef.on("child_removed", snap => {
      if (currentUid !== snap.key) {
        // add status to user
        this.addStatus(snap.key, false);
      }
    })
  }
  addStatus = (userId, connected = true) => {
    const updateUsers = this.state.users.reduce((acc, user) => {
      if (userId === user.uid) {
        user['status'] = connected ? 'online' : 'offline';
      }
      return acc.concat(user);
    }, [])
    this.setState({ users: updateUsers });
  }

  displayUsers = users => users.map(user => 
    <Menu.Item 
      key={user.uid}
      onClick={() => console.log(user)}
      style={{opacity: 0.7, fontStyle: 'italic'}}
    >
      @ {user.displayName}
      <Icon name="circle" color={this.isUserOnline(user) ? "green": "red"}/>
    </Menu.Item>
  )

  isUserOnline = user => user.status === "online"

  render() {
    const {users} = this.state;
    console.log("users", users);
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail"/> DIRECT MESSAGES
          </span>{' '}
          ({users.length})
        </Menu.Item>
        {/* User to send direct message */}
        {this.displayUsers(users)}
      </Menu.Menu>
    )
  }
}
export default DirectMessages;