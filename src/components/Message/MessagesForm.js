import React from 'react';
import uuidv4 from 'uuid';
import { Segment, Input, Button } from 'semantic-ui-react';
import firebase from './../firebase';
import FileModal from './FileModal';

import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

class MessagesForm extends React.Component{
  state = {
    uploadStated: "",
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    typingRef: firebase.database().ref("typing"),
    user: this.props.currentUser,
    channel: this.props.currentChannel,
    messageRef: this.props.messageRef,
    message: '',
    loading: false,
    errors: [],
    modal: false,
    percent: -1,
    emojiPicker: false,
  }

  componentWillReceiveProps = nextProps => {
    this.setState({channel: nextProps.currentChannel});
  }

  handleChange = event => {
    this.setState({[event.target.name]: event.target.value});
  }

  sendMessage = event => {
    event.preventDefault();
    const {message, typingRef} = this.state;
    this.setState({loading: true});
    if (message) {
      this.props.messageRef()
      .child(this.props.currentChannel.id)
      .push()
      .set(this.setMessage())
      .then(() => {
        this.setState({loading: false, errors: [], message: ''});
        console.log("Message created");
        typingRef
          .child( this.props.currentChannel.id)
          .child(this.props.currentUser.uid)
          .remove();
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
    return isPrivateChannel ? `chat/private/${this.props.currentChannel.id}` : "chat/public";
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
  handleKeyDown = e => {
    
    if (e.ctrlKey && e.keyCode === 13) {
      this.sendMessage(e);
    }
    const {message, typingRef} = this.state;
    const {currentUser: user, currentChannel: channel} = this.props;
    if (message) {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .set(user.displayName)
        .then( () => {
          console.log("Typing set");
        })
        .catch(err => {
          console.log("error typing: ", err);
          
        })
    } else {
      typingRef
        .child(channel.id)
        .child(user.uid)
        .remove();
    }
  }
  handleTogglePicker = () => {
    this.setState({emojiPicker: !this.state.emojiPicker});
  }
  handleAddEmoji = emoji => {
    console.log("emoji", emoji);
    
    const oldMsg = this.state.message;
    const newMsg = `${oldMsg} ${emoji.native} `;
    this.setState({message: newMsg, emojiPicker: false});
    
    setTimeout(() => {
      this.messageInputRef.focus()
    }, 0);
  }
  colonToUniCode = message => {
    return message.replace()
  }
  render() {
    const {message, errors, loading, modal, percent, uploadStated, emojiPicker} = this.state;
    return(
      <Segment className="message__form">
        {emojiPicker && (
          <Picker
            set='google'
            onSelect={this.handleAddEmoji}
            className="emojipicker"
            title="Pick your emoji"
            emoji="point_up"
          />
        )}
        <Input
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          fluid
          name="message"
          style={{marginBottom: '.7em'}}
          ref={node =>( this.messageInputRef= node )}
          label={
            <Button 
              icon={emojiPicker ? "close" : "add"} 
              content={emojiPicker ? "Close" : null}
              onClick={this.handleTogglePicker}
            />}
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