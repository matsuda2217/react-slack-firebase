import React from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Button, Input } from 'semantic-ui-react';
import firebase from './../firebase';

class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser,
    modal: false

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
        text: <span onClick={this.openModal}>Change avatar</span>,
        key: 'avatar'
      },
      {  
        text: <span onClick={this.handleSignout}>Sign out</span>,
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
  handleChangeAvatar = () => {

  }

  closeModal = () => {this.setState({modal: false})};

  openModal = () => {this.setState({modal: true})};

  render() {
    const { user, modal } = this.state;
    const { secondaryColor } = this.props;
    return (
      <Grid style={{background: secondaryColor}}>
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
        <Modal 
          basic
          open={modal}
          onClose={this.closeModal}
          size="fullscreen"
        >
          <Modal.Content>
            <Input
              fluid
              inverted
              label="File type png, jpg"
              type="file"
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              inverted
              color="green"
            >
              <Icon name="checkmark"/>
              Save Image
            </Button>
            <Button
              inverted
              color="green"
            >
              <Icon name="image"/>
              Preview
            </Button>
            <Button
              onClick={this.closeModal}
              inverted
              color="grey"
            >
              <Icon name="remove"/>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid>
    )
  }
}

export default UserPanel;