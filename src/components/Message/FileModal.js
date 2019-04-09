import React from 'react';
import mime from 'mime-types';
import { Modal, Header, Input, Button, Icon, Progress } from 'semantic-ui-react';

class FileModal extends React.Component {
  state = {
    file: null,
    authorized: ['image/jpg', 'image/jpeg', 'image/png'],
  }
  addFile = event => {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    console.log("file check :", mime.lookup(file.name));
    if( file ) {
      this.setState({file})
    }
  }
  sendFile = event => {
    event.preventDefault();
    const { file } = this.state;
    const { uploadFile } = this.props;
    if(file) {
      if(this.isImageFile(file.name)) {
        console.log("valid");
        const metaData = this.createMetaData(file.name)
        uploadFile(file, metaData);
        this.clearFile();
      }
    }
  }
  clearFile = () => {
    this.setState({file: null})
  }

  isImageFile = fileName => (this.state.authorized.includes(mime.lookup(fileName)))
  
  createMetaData = (fileName) => {
    return {
      contentType: mime.lookup(fileName)
    }
  }
  render() {
    const {modal, closeModal, percent } = this.props;
    return(
      <Modal basic size="small"
        open={modal}
        onClose={closeModal}
      >
        <Header>Upload File</Header>
        <Modal.Content>
          <Input
            fluid
            label="File type jpg, png"
            placholder="Upload your file"
            type="file"
            name="file"
            onChange={this.addFile}
          />
          { percent >= 0 && <Progress size="tiny" percent={percent} active indicating inverted progress/> }
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={this.sendFile}
            inverted
            color="green"
          >
            <Icon name="checkmark"/>Upload
          </Button>
          <Button
            inverted
            onClick={closeModal}
            color="red"
          >
            <Icon name="remove"/>Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default FileModal;