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

export default class StoriesOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listViewData: [],
    };
  }

  static navigationOptions = {
	title: 'Stories',
	headerTitleStyle: {flex: 1}
  };

  registerDatabaseListener() {
    var _this = this;
    this.unregisterDatabaseListener = getStories().onSnapshot(function(querySnapshot) {
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
    getStories().doc(data.id).delete();
  }

  addRow(newStoryName) {
	  if (newStoryName !== undefined) {
		  getStories().add({
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
            <Button style={styles.storiesButton} iconLeft onPress={_ => this.props.navigation.navigate('NewStory', {
            	onSubmit: this.addRow,
            	mode: 'New',
            })}>
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
            	  this.props.navigation.navigate('NewStory', {
                	onSubmit: this.addRow,
                  	story: doc,
                  	mode: 'Edit',
                  })}}>
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
        </Content>
      </Container>
    );
  }
}
