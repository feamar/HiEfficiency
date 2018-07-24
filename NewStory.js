import React from 'react';
import { View } from 'react-native';
import {
	  Button,
	  Container,
	  Header,
	  Content,
	  Icon,
	  List,
	  ListItem,
	  Text,
	  Input,
	  Item,
	} from 'native-base';

export default class NewStoryModal extends React.Component {
	
  static navigationOptions = ({ navigation }) => {
	return {
		title: navigation.getParam('mode', 'New') + ' story',
		headerTitleStyle: {flex: 1}
    }
  }

  render() {
    let updateBtn;
    let textField;
    if (this.props.navigation.getParam('mode', 'New') == 'New') {
        updateBtn = 
    	  <Button success iconLeft onPress={() => { 
    	  	this.props.navigation.goBack(), 
    	  	this.props.navigation.getParam('onSubmit')(this.storyName)}}>
	        <Icon name='add' />
	        <Text>Create</Text>
	      </Button>;
	    textField =    
	      <Input
            placeholder="The name of the new story"
            onChangeText={text => this.storyName = text}
	      />
	    
    } else {
    	if (this.storyName == undefined) {
	    	this.storyName = this.props.navigation.getParam('story').data().name;
    	}
    	updateBtn =
      	  <Button success iconLeft onPress={() => { 
      		  this.props.navigation.goBack(); 	  
      		  this.props.navigation.getParam('story').ref.update({
      			  name: this.storyName
      		  }); } }>
	        <Icon name='create' />
	        <Text>Change</Text>
	      </Button>;
	    textField =
	      <Input placeholder = {this.props.navigation.getParam('story').data().name}
            onChangeText={text => this.storyName = text}
	      />
    }
    
    
	  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
	      <Item regular>
	        {textField}
	      </Item>
	      <View style={{
	          flex: 1,
	    	  flexDirection: 'row',
	          justifyContent: 'space-between',
	          height: 100,
	          padding: 20,
	        }}>
	          <Button success onPress={() => { this.props.navigation.goBack() } }>
	            <Text>Cancel</Text>
	          </Button>
	          {updateBtn}
	      </View>
	  </View>
    );
  }
}