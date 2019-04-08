import React from 'react';
import { Grid } from 'semantic-ui-react';
import {connect} from 'react-redux';
import './App.css';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Message from './Message/Message';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({currentUser, currentChannel}) => (
  <Grid columns="equal" className="app" style={{background: '#eee'}}>
    <ColorPanel/>
    <SidePanel currentUser={currentUser}/>
    <Grid.Column style={{marginLeft: 320}}>
      <Message
        currentUser={currentUser}
        currentChannel={currentChannel}
      />
    </Grid.Column>
    <Grid.Column width={4}>
      <MetaPanel/>
    </Grid.Column>
  </Grid>
)

const mapStateToProps = ({user, channel}) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
})
export default connect(mapStateToProps)(App);
