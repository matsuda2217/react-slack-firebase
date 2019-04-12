import React from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

class MessagesHeader extends React.Component{
  render() {
    const { 
      channelName, 
      userAmount, 
      handleSearchMessage, 
      searchLoading, 
      isStarredChannel, 
      starredChannel, 
      isPrivateChannel 
    } = this.props;
    return (
      <Segment clearing>
        {/* channel title */}
        <Header as="h2" fluid="true" floated="left" style={{marginBottom: 0}}>
          <span>
            {channelName}
            {!isPrivateChannel && <Icon 
            onClick={starredChannel}
            name={isStarredChannel ? "star" : "star outline"} 
            color={isStarredChannel ? "yellow" : "black"}/>}
          </span>
          <Header.Subheader>{userAmount.length} Users</Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
            loading={searchLoading}
            onChange={handleSearchMessage}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    )
  }
}
export default MessagesHeader;