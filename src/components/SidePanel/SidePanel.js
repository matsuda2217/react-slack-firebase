import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';

class SidePanel extends React.Component {
  render() {
    const {currentUser, currentChannel, secondaryColor} = this.props;
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{background: secondaryColor, fontSize: '1.2rem', left: '60px'}}
      >
        <UserPanel
          secondaryColor={secondaryColor}
          currentUser={currentUser}/>
        <Starred
          channel={currentChannel}
          user={currentUser}
        />
        <Channels currentUser={currentUser}/>
        <DirectMessages user={currentUser}/>
      </Menu>
    )
  }
}
export default SidePanel;