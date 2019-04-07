import React from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from './../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from './../../actions/channelActions';

class Channels extends React.Component {
  state = {
    user: this.props.currentUser,
    activeChannel: '',
    currentChannel: null,
    channels: [],
    channelName: "",
    chanelDescription: "",
    open: false,
    channelRef: firebase.database().ref("channels"),
    firstLoad: true
  }
  componentDidMount = () => {
    this.addListener();
  }
  componentWillUnmount = () => {
    this.removeListener();
  }
  addListener = () => {
    const loaddedChannels = [];
    this.state.channelRef.on("child_added", snap => {
      console.log("snap", snap.val());
      loaddedChannels.push(snap.val());
      this.setState({channels: loaddedChannels}, () => this.setFirstChannel());
    })
  }
  removeListener = () => {
    this.state.channelRef.off();
  }
  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
    }

    this.setState({firstLoad: false});
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

  handleChannelChange = channel => {
    this.props.setCurrentChannel(channel);
    this.setState({ 
      currentChannel: channel,
      activeChannel: channel.id
    })
  }
  displayChannels = channels => (
    channels.length > 0 && channels.map(channel => (
      <Menu.Item 
        key={channel.id} 
        style={{opacity: 0.7}}
        onClick={() => this.handleChannelChange(channel)}
        active={this.state.activeChannel === channel.id}
        >
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
export default connect(null, { setCurrentChannel })(Channels);