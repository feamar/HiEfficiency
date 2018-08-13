import React from 'react';
import { Modal, View } from 'react-native';
import { Button, Icon, Text, Input, Item, } from 'native-base';
import { styles } from '../../styles/Styles';
import { getTeams } from '../firebase/FirebaseAdapter';

export class Team extends React.Component {
  constructor(props) {
    super(props);
		this.confirm = this.confirm.bind(this);
	}

	close = () => {
		this.props.close();
	}

	confirm = () => {
		if (this.teamName !== undefined && this.teamCode !== undefined) {
			this.props.onConfirm(this.teamName, this.teamCode);
			this.close();
		} else {
			alert('You must enter both a name and a code for the team');
		}
	}

  render() {
    return (
			<Modal
				animationType="slide"
				transparent={true}
				visible={this.props.visible}
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
							<Input
			            placeholder="The name of the new team"
			            onChangeText={text => this.teamName = text}
				      />
			      </Item>
						<Item regular>
							<Input
			            placeholder="The security code for the new team (required to join)"
			            onChangeText={text => this.teamCode = text}
				      />
			      </Item>
						<View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end',}}>
							<Button transparent onPress = { this.close }>
								<Text style={{color: 'red',}}>Cancel</Text>
							</Button>
							<Button transparent onPress={ this.confirm }>
								<Text style={{color: 'green',}}>Create</Text>
							</Button>
						</View>
			  	</View>
				</View>
			</Modal>
    );
  }
}
