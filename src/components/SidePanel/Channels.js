import React from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from './../firebase';

class Channels extends React.Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    channelName: "",
    chanelDescription: "",
    open: false,
    channelRef: firebase.database().ref("channels"),
  }
  componentDidMount = () => {
    this.onAddListener();
  }
  onAddListener = () => {
    const loaddedChannels = [];
    this.state.channelRef.on("child_added", snap => {
      console.log("snap", snap.val());
      loaddedChannels.push(snap.val());
      this.setState({channels: loaddedChannels});
    })
  }
  closeModal = () => {
    this.setState({open: false});
  }
  openModal = () => {
    this.setState({open: true});
  }
  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  }
  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      const { channelRef, channelName, chanelDescription, user } = this.state;
      const id = channelRef.push().key;
      const channelData = {
        name: channelName,
        about: chanelDescription,
        createdBy: {
          name: user.displayName,
          avatar: user.photoURL
        },
        id
      }
      channelRef
        .child(id)
        .update(channelData)
        .then(() => {
          console.log("channel added");
          this.setState({channelName: "", chanelDescription: ""});
          this.closeModal();
        })
        .catch(err => {
          console.log("Error happen: ", err);
        })
    }
  }
  isFormValid = ({channelName, chanelDescription}) => (channelName && chanelDescription);

  displayChannels = channels => (
    channels.length > 0 && channels.map(channel => (
      <Menu.Item key={channel.id} style={{opacity: 0.7}} onClick={() => console.log(channel)}>
        # {channel.name}
      </Menu.Item>
    ))
  )
  render() {
    const { channels, open } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu style={{paddingBottom: '2em'}}>
          <Menu.Item>
            <span>
              <Icon name="exchange" />
              CHANNELS
            </span>{" "}
            ({channels.length})<Icon name="add" onClick={this.openModal} />
          </Menu.Item>
        {/*Channels*/}
        {this.displayChannels(channels)}    
        </Menu.Menu>

        {/* Add a channel */}
        <Modal 
          basic
          size="fullscreen"
          open={open}
          onClose={this.closeModal}
        >
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About channel"
                  name="chanelDescription"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleSubmit} inverted color="green">
              <Icon name="checkmark"/>Add
            </Button>
            <Button onClick={this.closeModal} inverted color="red">
              <Icon name="remove"/>Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}
export default Channels;