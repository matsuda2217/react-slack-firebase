import React from 'react';
import { Accordion, Icon, Segment, Header, Image, List } from 'semantic-ui-react';

class MetaPanel extends React.Component {
  state = {
    activeIndex: 0,
  }

  handleClick = (e, titleProps) => {
    const {index} = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index
    this.setState({activeIndex: newIndex});
  }
  formatCount = count => (count > 1 || count === 0) ? `${count} posts` : `${count} post`;

  displayUserPosts = posts => (
    Object.entries(posts)
      .sort((a, b) => b[1]- a[1])
      .map(([key, val], i) =>  (
        <List.Item key={i} as="h5">
          <Image avatar src={val.avatar}/>
          <List.Content>
            <List.Header as="a">{key}</List.Header>
            <List.Description>{this.formatCount(val.count)}</List.Description>
          </List.Content>
        </List.Item>
    ))
  )
  render() {
    const { activeIndex } = this.state;
    const { isPrivateChannel, channel, userPosts } = this.props;
    if (isPrivateChannel || !userPosts) return null;
    return (
      <Segment loading={!channel}>
        <Header as="h3" attached="top">
          About # { channel && channel.name}
        </Header>
        <Accordion>
          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
            <Icon name="dropdown"/>
            <Icon name="info circle"/>
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex===0}>
            { channel && channel.about}
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
            <Icon name="dropdown"/>
            <Icon name="user circle"/>
            Top Poster
          </Accordion.Title>
          <Accordion.Content active={activeIndex===1}>
            <List>
              {userPosts && this.displayUserPosts(userPosts)}
            </List>
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
            <Icon name="dropdown"/>
            <Icon name="edit"/>
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex===2}>
            <Header as="h3">
              { channel && <Image src={channel.createdBy.avatar} circular/>}
              { channel && channel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    )
  }
}
export default MetaPanel;