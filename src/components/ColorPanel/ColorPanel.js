import React from 'react';
import {connect} from 'react-redux';
import { Sidebar, Divider, Button, Menu, Modal, Header, Icon, Label, Segment } from 'semantic-ui-react';
import firebase from './../firebase';
import { setColors } from './../../actions/colorActions';
import { SliderPicker } from 'react-color'

class ColorPanel extends React.Component {
  state = {
    modal: false,
    primary: "#40BF67",
    secondary: "4200FF",
    userRef: firebase.database().ref("users"),
    userColors: []
  }

  componentDidMount = () => {
    if(this.props.user) {
      console.log("ColorPanel", !!this.props.user);
      this.addListener(this.props.user.uid);
    }
  }

  addListener = userId => {
    let userColors = [];
    this.state.userRef
      .child(userId)
      .child("colors")
      .on("child_added", snap => {
        userColors.unshift(snap.val());
        console.log(snap.val());
        this.setState({userColors});
      })
  }

  openModal = () => {this.setState({ modal: true })};
  
  closeModal = () => {this.setState({ modal: false })};

  handleChangePirmary = color => {this.setState({primary: color.hex})};

  handleChangeSecondary = color => {this.setState({secondary: color.hex})};

  handleSaveColor = () => {
    const { primary, secondary } = this.state;
    if( primary && secondary) {
      this.saveColors(this.state.primary, this.state.secondary);
    }
  }

  saveColors = (primary, secondary) => {
    const {user} = this.props;
    this.state.userRef
      .child(user.uid)
      .child("colors")
      .push()
      .update({
        primary,
        secondary
      })
      .then( () => {
        console.log("Colors saved");
        this.closeModal();
      })
      .catch(err => {
        console.log("Save color error: ", err);
      })
    
  }

  displayUserColors = colors => (
    colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider/>
        <div className="color__container">
          <div 
            className="color__square" 
            style={{background: `${color.primary}`}} 
            onClick={() => this.props.setColors(color.primary, color.secondary)}>
            <div className="color__overlay" style={{background: `${color.secondary}`}}>
            </div>
          </div>
        </div>
      </React.Fragment>
    ))
  )
  render() {
    const {modal, primary, secondary, userColors} = this.state;
    return (
      <Sidebar
      as={Menu}
      animation='overlay'
      icon='labeled'
      vertical
      inverted
      visible={true}
      width='very thin'
    >
      <Divider/>
      <Button icon="add" color="blue" size="small" onClick={this.openModal}/>
      <Modal 
        open={modal}
        onClose={this.closeModal} 
        basic 
        size="fullscreen"
        >
        <Header as="h3">
          Choose your appereance
        </Header>
        <Modal.Content>
          <Segment inverted>
            <Label content="Primary color"/>
            <SliderPicker color={primary} onChange={this.handleChangePirmary}/>
          </Segment>
          <Segment inverted>
            <Label content="Secondary color"/>
            <SliderPicker color={secondary} onChange={this.handleChangeSecondary}/>
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button inverted color="green" onClick={this.handleSaveColor} >
            <Icon name="checkmark"/>  
            Save Color
          </Button>
          <Button inverted color="grey" onClick={this.closeModal}>
            <Icon name="remove"/>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
      {userColors && this.displayUserColors(userColors)}
     </Sidebar>
    )
  }
}
export default connect(null, { setColors })(ColorPanel);