import React from 'react';
import uuidv4 from 'uuid';
import { Segment, Input, Button } from 'semantic-ui-react';
import firebase from './../firebase';
import FileModal from './FileModal';

class MessagesForm extends React.Component{
  state = {
    uploadStated: "",
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    user: this.props.currentUser,
    channel: this.props.currentChannel,
    messageRef: this.props.messageRef,
    message: '',
    loading: false,
    errors: [],
    modal: false,
    percent: -1,
  }

  componentWillReceiveProps = nextProps => {
    this.setState({channel: nextProps.currentChannel});
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  }

  sendMessage = event => {
    event.preventDefault();
    const {message} = this.state;
    this.setState({loading: true});
    if (message) {
      this.props.messageRef()
      .child(this.props.currentChannel.id)
      .push()
      .set(this.setMessage())
      .then(() => {
        this.setState({loading: false, errors: [], message: ''});
        console.log("Message created");
      })
      .catch(err => {
        console.log("err", err);
        this.setState({loading: false, errors: this.state.errors.concat(err)})
      })
    } else {
      this.setState({loading: false, errors: this.state.errors.concat({message: "Fill in message"})});
    }
  }
  setMessage = (image = null) => {
    const { message, user } = this.state;
    const messageObj = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        avatar: user.photoURL,
        name: user.displayName
      },
      content: message,
      image
    }

    return messageObj;
  }
  openModal = () => {
    this.setState({ modal: true });
  }
  closeModal = () => {
    this.setState({ modal: false });
  }
  getFilePath = (isPrivateChannel) => {
    return isPrivateChannel ? `chat/private-${this.props.currentChannel.id}` : "chat/public";
  }
  uploadFile = (file, metaData) => {
    const { isPrivateChannel, currentChannel: { id: pathToUpload } } = this.props;
    const ref = this.props.messageRef();
    const filePath = `${this.getFilePath(isPrivateChannel)}/${uuidv4()}.jpg`;

    this.setState({
      uploadStated: "uploading",
      uploadTask: this.state.storageRef.child(filePath).put(file, metaData) 
    },
      () => {
        this.state.uploadTask.on("state_changed", snap => {
          let uploadPercent = Math.floor((snap.bytesTransferred / snap.totalBytes) * 100);
          console.log('Upload is ' + uploadPercent + '% done');
          this.setState({ percent: uploadPercent });
        },
        err => {
          console.log("err", err);
          this.setState({
            errors: this.state.errors.concat(err),
            uploadStated: "error",
            uploadTask: null
          })
        },
        () => {
          this.state.uploadTask.snapshot.ref.getDownloadURL().then(
            downloadUrl => {
              this.sendMessageFile(downloadUrl, ref, pathToUpload);
            }
          )
          .catch( err => {
            console.log("err", err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadStated: "error",
              uploadTask: null
            })
          })
        })
      }
    )
  }
  sendMessageFile = (url, ref, path) => {
    ref
      .child(path)
      .push()
      .set(this.setMessage(url)) 
      .then(() => {
        this.setState({
          uploadStated: "done",
          modal: false,
        })
      })
      .catch(err => {
        this.setState({
          errors: this.state.errors.concat(err),
        })
      }) 
  }
  render() {
    const {message, errors, loading, modal, percent, uploadStated} = this.state;
    return(
      <Segment className="message__form">
        <Input
          onChange={this.handleChange}
          fluid
          name="message"
          style={{marginBottom: '.7em'}}
          label={<Button icon="add"/>}
          labelPosition="left"
          placeholder="Write your message"
          value={message}
          className={errors.some(err => err.message.includes("message")) ? "error" : ""}
        />
        <Button.Group>
          <Button
            disabled={loading}
            onClick={this.sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            disabled={uploadStated === "uploading"}
            color="teal"
            onClick={this.openModal}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
        <FileModal
          percent={percent}
          uploadFile={this.uploadFile}
          modal={modal}
          closeModal={this.closeModal}
        />
      </Segment>
    )
  }
}

export default MessagesForm;