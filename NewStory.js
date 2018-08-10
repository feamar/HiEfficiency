import React from 'react';
import { Modal, View } from 'react-native';
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
import { styles } from './Styles';

export default class NewStoryModal extends React.Component {
  constructor(props) {
    super(props);
	}

	close = () => {
		this.props.parent.closeModal();
	}

	create = () => {
		this.props.parent.addRow(this.storyName);
		this.close();
	}

	edit = () => {
		this.props.story.ref.update({name: this.storyName});
		this.close();
	}

  render() {
    let updateBtn;
    let textField;
    if (this.props.mode == 'new') {
        updateBtn =
				<Button transparent onPress={ this.create }>
					<Text style={{color: 'green',}}>Create</Text>
				</Button>;
	    textField =
	      <Input
            placeholder="The name of the new story"
            onChangeText={text => this.storyName = text}
	      />

    } else {
    	if (this.storyName == undefined) {
	    	this.storyName = this.props.story.data().name;
    	}
    	updateBtn =
					<Button transparent onPress={ this.edit }>
						<Text style={{color: 'green',}}>Change</Text>
	      	</Button>;
	    textField =
	      <Input placeholder = {this.props.story == undefined ? '' : this.props.story.data().name}
            onChangeText={text => this.storyName = text}
	      />
    }



    return (
			<Modal
				animationType="slide"
				transparent={true}
				visible={this.props.modalVisible}
				onRequestClose={() => alert('Requested close for modal')}
			>
				<View style={styles.modalSurroundings}>
					<View style={styles.modalContainer}>
						<View style={styles.modalHeader}>
							<Button transparent onPress = { this.close }>
								<Icon active name='close' style={{color: 'white'}} />
							</Button>
						</View>
			      <Item regular>
			        {textField}
			      </Item>
						<View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end',}}>
							<Button transparent onPress = { this.close }>
								<Text style={{color: 'red',}}>Cancel</Text>
							</Button>
							{updateBtn}
						</View>
			  	</View>
				</View>
			</Modal>
    );
  }
}
