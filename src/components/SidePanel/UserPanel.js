import React from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from './../firebase';

class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser
  }
  trigger = user => (
    <span>
      <Image avatar floated="left" src={user.photoURL} /> {user.displayName}
    </span>
  );
  userOptions = () => (
    [
      {  
        text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
        disabled: true,
        key: 'user' 
      },
      {  
        text: <span>Change avater</span>,
        key: 'avatar'
      },
      {  
        text: <span onClick={this.handleSignout} >Sign out</span>,
        key: 'signout'
      },
    ]
  );

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed out");
      })
      .catch(err => {
        console.log("err", err);
      })
  }
  render() {
    const { user } = this.state;
    return (
      <Grid style={{background: '#4c3c4c'}}>
        <Grid.Column>
          <Grid.Row style={{padding: '1.2em', margin: 0}}>
            {/* App header */}
            <Header inverted floated="left" as="h2">
              <Icon name='code'/>
              <Header.Content >Devchat</Header.Content>
            </Header>
          </Grid.Row>

          {/* User Dropdown */}
          <Header style={{padding: '0.25em'}} as="h4">
            <Dropdown trigger={this.trigger(user)} options={this.userOptions()} >

            </Dropdown>
          </Header>
        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel;