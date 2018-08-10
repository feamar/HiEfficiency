import React, { Component } from 'react';
import { ListView, View } from 'react-native';
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
import { getStories } from './FirebaseAdapter';
import { styles } from './Styles';
import NewStoryModal from './NewStory';

export default class StoriesOverview extends React.Component {
  constructor(props) {
    super(props);
    console.log('TeamId: ' + props.navigation.getParam('teamId'));
    this.state = {
      listViewData: [],
      modalItemSelected: undefined,
      modalVisible: false,
      mode: 'new',
      teamId: props.navigation.getParam('teamId')
    };
  }

  static navigationOptions = {
  	title: 'Stories',
  	headerTitleStyle: {flex: 1}
  };

  closeModal() {
		this.setState({modalVisible: false, modalItemSelected: undefined});
	}

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  editStory = (story, mode) => {
		return () => {
      this.setState({
        modalItemSelected: story,
        mode: mode,
      });
			this.setModalVisible(true);
		}
	}

  registerDatabaseListener() {
    var _this = this;
    this.unregisterDatabaseListener = getStories(this.state.teamId).onSnapshot(function(querySnapshot) {
    	var i;
	    const newData = [..._this.state.listViewData];
    	for (i = 0; i < querySnapshot.docChanges().length; i++) {
        	var dcs = querySnapshot.docChanges()[i];
        	if (dcs.type == 'added') {
        	    newData.splice(dcs.newIndex, 0, dcs.doc);
        	}
        	if (dcs.type == 'removed') {
        	    newData.splice(dcs.oldIndex, 1);
        	}
        	if (dcs.type == 'modified') {
        		newData.splice(dcs.newIndex, 1, dcs.doc);
        	}
        }
	    _this.setState({ listViewData: newData });
    });
  }

  componentDidMount() {
	  this.registerDatabaseListener();
  }

  componentWillUnmount() {
	  this.unregisterDatabaseListener();
  }

  // For deleting and adding rows to the database
  deleteRow(data) {
    getStories(this.state.teamId).doc(data.id).delete();
  }

  addRow(newStoryName) {
	  if (newStoryName !== undefined) {
		  getStories(this.state.teamId).add({
			  name: newStoryName,
		  });
	  } else {
		  alert('You cannot add a story without giving it a name');
	  }
  }

  render() {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
      <Container>
        <Header style={{height: 0}} />
        <Content>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button style={styles.storiesButton} onPress={this.editStory(undefined, 'new')}>
              <Icon name="add" />
              <Text>New story</Text>
            </Button>
          </View>
          <List
            leftOpenValue={75}
            rightOpenValue={-75}
            dataSource={ds.cloneWithRows(this.state.listViewData)}
            renderRow={doc => (
              <ListItem style={[styles.storyOverviewItem, doc.data().finishedOn !== undefined ? styles.storyOpen : styles.storyFinished]} onPress = {_ => this.props.navigation.navigate('Details', {
              	  story: doc,
              })}>
	             <Text> {doc.data().name} </Text>
              </ListItem>
            )}
            renderLeftHiddenRow={(doc, secId, rowId, rowMap) => (
              <Button full onPress={_ => {
            	  rowMap[`${secId}${rowId}`].props.closeRow();
            	  this.editStory(doc, 'edit')()}}>
                <Icon active name="create" />
              </Button>
            )}
            renderRightHiddenRow={(doc, secId, rowId, rowMap) => (
              <Button full danger onPress={_ => {
            	  rowMap[`${secId}${rowId}`].props.closeRow();
            	  this.deleteRow(doc)}}>
                <Icon active name="trash" />
              </Button>
            )}
          />
          <NewStoryModal
     				parent={this}
  					modalVisible={this.state.modalVisible}
            story={this.state.modalItemSelected}
  					mode={this.state.mode} />
        </Content>
      </Container>
    );
  }
}
