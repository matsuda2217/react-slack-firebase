import React from 'react';
import { Grid } from 'semantic-ui-react';
import {connect} from 'react-redux';
import './App.css';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Message from './Message/Message';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({currentUser, currentChannel, isPrivateChannel, userPosts, primaryColor, secondaryColor}) => (
  <Grid columns="equal" className="app" style={{background: primaryColor ? primaryColor : '#eee'}}>
    <ColorPanel
      user={currentUser}
    />
    <SidePanel 
      secondaryColor={secondaryColor}
      currentChannel={currentChannel}
      currentUser={currentUser}/>
    <Grid.Column style={{marginLeft: 320}}>
      <Message
        currentUser={currentUser}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
      />
    </Grid.Column>
    <Grid.Column width={4}>
      <MetaPanel
        channel={currentChannel}
        isPrivateChannel={isPrivateChannel}  
        userPosts={userPosts}
      />
    </Grid.Column>
  </Grid>
)

const mapStateToProps = ({user, channel, color}) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
  isPrivateChannel: channel.isPrivateChannel,
  userPosts: channel.userPosts,
  primaryColor: color.primaryColor,
  secondaryColor: color.secondaryColor
})
export default connect(mapStateToProps)(App);
