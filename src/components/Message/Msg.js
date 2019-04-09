import React from 'react';
import { Comment, Icon, Image } from 'semantic-ui-react';

class Msg extends React.Component{
  isUserMessage =(msg, user) => {
    return msg.user.id === user.uid;
  }
  render() {
    const {msg, user} = this.props;
    return(
    <Comment.Group>
    <Comment>
      <Comment.Avatar as='a' src={msg.user.avatar} />
      <Comment.Content className={this.isUserMessage(msg,user) ? "message__self" : ""}>
        <Comment.Author>{msg.user.name}</Comment.Author>
        <Comment.Text>
          {msg.content}
          {msg.image && <Image src={msg.image} className="message__image"/>}
        </Comment.Text>
        <Comment.Actions>
          <Comment.Action>Reply</Comment.Action>
          <Comment.Action>Save</Comment.Action>
          <Comment.Action>Hide</Comment.Action>
          <Comment.Action>
            <Icon name='expand' />
            Full-screen
          </Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>
    </Comment.Group>
    )
  }
}
export default Msg;