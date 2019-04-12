import React from 'react';
import { Accordion, Icon, Segment, Header } from 'semantic-ui-react';

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
  render() {
    const { activeIndex } = this.state;
    const { isPrivateChannel } = this.props;
    if (isPrivateChannel) return null;
    return (
      <Segment>
        <Header as="h3" attached="top">
          About # channel
        </Header>
        <Accordion>
          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
            <Icon name="dropdown"/>
            <Icon name="info circle"/>
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex===0}>
            Details
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
            <Icon name="dropdown"/>
            <Icon name="user circle"/>
            Top Poster
          </Accordion.Title>
          <Accordion.Content active={activeIndex===1}>
            Poster
          </Accordion.Content>
          <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
            <Icon name="dropdown"/>
            <Icon name="edit"/>
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex===2}>
            Created
          </Accordion.Content>
        </Accordion>
      </Segment>
    )
  }
}
export default MetaPanel;