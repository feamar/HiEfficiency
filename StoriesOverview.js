import React, { Component } from 'react';
import { AppLoading, Font } from 'expo';
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
import firebase from 'firebase';
import 'firebase/firestore';

export default class StoriesOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      basic: true,
      listViewData: [],
      isReady: false,
      isOpen: false
    };
  }
  
  static navigationOptions = {
	title: 'Stories',
	headerTitleStyle: {flex: 1}
  };
  
  registerDatabaseListener() {
    var _this = this;
    this.unregisterDatabaseListener = this.stories.onSnapshot(function(querySnapshot) {
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
	var firebaseConfig = require('./firebase.config.json');
    !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
    store = firebase.firestore();
    store.settings({timestampsInSnapshots: true});
    this.stories = store.collection('stories');
	this.registerDatabaseListener();
    this.loadFonts();
  }
  
  componentWillUnmount() {
	  this.unregisterDatabaseListener();
  }
  
  // For basic functionality, we need to load some resources 
  async loadFonts() {
    await Font.loadAsync({
      FontAwesome: require('@expo/vector-icons/fonts/FontAwesome.ttf'),
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'),
    });
    this.setState({ isReady: true });
  }

  // For deleting and adding rows to the database
  deleteRow(data) {
    this.stories.doc(data.id).delete();
  }

  addRow(newStoryName) {
	  if (newStoryName !== undefined) {
		  this.stories.add({
			  name: newStoryName,
		  });
	  } else {
		  alert('You cannot add a story without giving it a name');
	  }
  }
  
  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    return (
      <Container>
        <Header style={{height: 0}} />
        <Content>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button success iconLeft onPress={_ => this.props.navigation.navigate('NewStory', {
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
              <ListItem onPress = {_ => this.props.navigation.navigate('Details', {
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