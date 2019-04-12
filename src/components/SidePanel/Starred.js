import React from 'react';
import firebase from './../firebase';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';

import { setCurrentChannel, setPrivateChannel } from './../../actions/channelActions'

class Starred extends React.Component {
  state = {
    activeChannel: '',
    starredChannels: [],
    userRef: firebase.database().ref("users"),
  }

  componentDidMount = () => {
    const { user } = this.props;
      this.addStarredListener(user.uid);
  }


  addStarredListener = userId => {
    const { userRef } = this.state;
    userRef
    .child(userId)
    .child("starred")
    .on("child_added", snap => {
      const starredChannel = {id: snap.key, ...snap.val()}
      this.setState({starredChannels: [...this.state.starredChannels, starredChannel]});
    })

    userRef
    .child(userId)
    .child("starred")
    .on("child_removed", snap => {
      const starredRemove = {id: snap.key, ...snap.val()};
      const filterStarredChannels = this.state.starredChannels.filter( chan => {
        return chan.id !== starredRemove.id;
      });
      this.setState({starredChannels: filterStarredChannels});
    })
  }
  setActiveChannel = channel => {
    this.setState({activeChannel: channel.id})
    this.handleChannelChange(channel);
  }

  handleChannelChange = channel => {
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  }
  dislayStarredChannels = channels => (
    // if (channels.length > 0 ) {
      channels.map(channel => 
        <Menu.Item
          key={channel.id} 
          style={{opacity: 0.7}}
          onClick={() => this.setActiveChannel(channel)}
        >
        # {channel.name}
        </Menu.Item>
      )
    // }
  )

  render () {
    const {starredChannels} = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="star"/>STARRED
          </span> {" "}
          ({starredChannels.length})
        </Menu.Item>
        {this.dislayStarredChannels(starredChannels)}
      </Menu.Menu>
    )
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);