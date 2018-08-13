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
import { getStories } from '../firebase/FirebaseAdapter';
import { styles } from '../../styles/Styles';
import ModalStoryNew from '../modals/ModalStoryNew';

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
    headerTitleStyle: { flex: 1 }
  };

  closeModal() {
    this.setState({ modalVisible: false, modalItemSelected: undefined });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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
  this.unregisterDatabaseListener = getStories(this.state.teamId).onSnapshot(function (querySnapshot) {
    var i;

    console.log("Snapshot size: " + querySnapshot.size)
    const newData = [..._this.state.listViewData];

    //console.log("Snapshot: " + JSON.stringify(JSON.decycle(querySnapshot)));   

    for(i = 0 ; i < querySnapshot._changes.length ; i ++)
    {
      let dcs = querySnapshot._changes[i];
      if (dcs._type == 'added') {
        newData.splice(dcs._newIndex, 0, dcs._document);
      }
      else if (dcs._type == 'removed') {
        newData.splice(dcs._oldIndex, 1);
      }
      else if (dcs._type == 'modified') {
        newData.splice(dcs._newIndex, 1, dcs._document);
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
      <Header style={{ height: 0 }} />
      <Content>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button style={styles.stories} onPress={this.editStory(undefined, 'new')}>
            <Icon name="add" />
            <Text>New story</Text>
          </Button>
        </View>
        <List
          leftOpenValue={75}
          rightOpenValue={-75}
          dataSource={ds.cloneWithRows(this.state.listViewData.filter(function (item) { return item.data().finishedOn == undefined }))}
          renderRow={doc => (
            <ListItem style={[styles.storyOverviewItem, doc.data().finishedOn !== undefined ? styles.storyOpen : styles.storyFinished]} onPress={_ => this.props.navigation.navigate('Details', {
              story: doc,
            })}>
              <Text> {doc.data().name} </Text>
            </ListItem>
          )}
          renderLeftHiddenRow={(doc, secId, rowId, rowMap) => (
            <Button full onPress={_ => {
              rowMap[`${secId}${rowId}`].props.closeRow();
              this.editStory(doc, 'edit')()
            }}>
              <Icon active name="create" />
            </Button>
          )}
          renderRightHiddenRow={(doc, secId, rowId, rowMap) => (
            <Button full danger onPress={_ => {
              rowMap[`${secId}${rowId}`].props.closeRow();
              this.deleteRow(doc)
            }}>
              <Icon active name="trash" />
            </Button>
          )}
        />
        <ModalStoryNew
          parent={this}
          modalVisible={this.state.modalVisible}
          story={this.state.modalItemSelected}
          mode={this.state.mode} />
      </Content>
    </Container>
  );
}
}
