import React from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Button, Input } from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor';
import firebase from './../firebase';


class UserPanel extends React.Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: "",
    croppedImage: "",
    uploadCroppedImage: "",
    blob: "",
    usersRef: firebase.database().ref("users"),
    userRef: firebase.auth().currentUser,
    storageRef: firebase.storage().ref(),
    metaData: {
      contentType: "image/jpeg"
    }
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
  onFileChange = e => {
    console.log("File", e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({previewImage: reader.result})
      })
    }
  }

  handleCroppImage = () => {
    if(this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob( blob => {
        let imageUrl = URL.createObjectURL(blob);
        console.log("imageURL: ", imageUrl);
        this.setState({
          croppedImage : imageUrl,
          blob
        })
      })
    }
  }
  handleChangeAvatar = () => {
    const {storageRef, blob, metaData} = this.state;
    const {currentUser: user} = this.props;
    storageRef
      .child(`avatars/users/${user.uid}`)
      .put(blob, metaData)
      .then(snap => {
        snap.ref.getDownloadURL()
          .then(downloadUrl => {
            this.setState({uploadCroppedImage: downloadUrl}, () => {this.changeAvatar()})
        })
      })
  }
  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadCroppedImage
      })
      .then(() => {
        console.log("Upload Profile avatar success");
      })
      .catch(err => {
        console.log("Upload profile avatar error: ", err);
      })

    this.state.usersRef
      .child(`${this.props.currentUser.uid}`)
      .update({
        photoURL: this.state.uploadCroppedImage
      })
      .then(() => {
        console.log("Change avatar success");
        this.closeModal();
      })
      .catch(err => {
        console.log("Change avatar error", err); 
      })
  }
  closeModal = () => {this.setState({modal: false})};

  openModal = () => {this.setState({modal: true})};

  render() {
    const { user, modal, previewImage, croppedImage, blob } = this.state;
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
              onChange={this.onFileChange}
              fluid
              inverted
              label="File type png, jpg"
              type="file"
            />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui centered aligned grid">
                  {previewImage && (
                    <AvatarEditor
                      ref={node => {this.avatarEditor = node}}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column className="ui centered aligned grid">
                    {croppedImage && (
                      <Image
                        style={{margin: '3.5em auto'}}
                        src={croppedImage}
                        width={100}
                        height={100}
                      />
                    )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {croppedImage && (
              <Button
                onClick={this.handleChangeAvatar}
                inverted
                color="green"
              >
                <Icon name="checkmark"/>
                Change Avatar
              </Button>
            )}
            {previewImage && (
              <Button
                onClick={this.handleCroppImage}
                inverted
                color="green"
              >
                <Icon name="image"/>
                Preview
              </Button>
            )}
              
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