import React from 'react';
import { Grid } from 'semantic-ui-react';
import {connect} from 'react-redux';
import './App.css';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Message from './Message/Message';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({currentUser, currentChannel, isPrivateChannel}) => (
  <Grid columns="equal" className="app" style={{background: '#eee'}}>
    <ColorPanel/>
    <SidePanel 
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
        isPrivateChannel={isPrivateChannel}  
      />
    </Grid.Column>
  </Grid>
)

const mapStateToProps = ({user, channel}) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
  isPrivateChannel: channel.isPrivateChannel
})
export default connect(mapStateToProps)(App);
