import React from 'react';
import { Sidebar, Divider, Button, Menu } from 'semantic-ui-react';

class ColorPanel extends React.Component {
  render() {
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
      <Button icon="add" color="blue" size="small"/>
     </Sidebar>
    )
  }
}
export default ColorPanel;