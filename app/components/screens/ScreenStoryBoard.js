import React, {Component} from "react";
import {View, ToastAndroid, Keyboard} from "react-native";
import PropTypes from "prop-types";
import { getUsers, getTeams, getStories, hookIntoUserSignin, signOut } from '../firebase/FirebaseAdapter';
import ListStories from "../lists/instances/stories/ListStories";
import {ACTION_DELETE_STORY, ACTION_EDIT_STORY, ACTION_INSPECT_STORY, ACTION_UPVOTE_STORY} from  "../lists/instances/stories/ListItemStory";
import {SCREEN_NAME_STORY_DETAILS, SCREEN_NAME_STORY_CREATE} from "../routing/Router";
import {FABGroup} from "react-native-paper";
import DialogConfirmation, { DIALOG_ACTION_OK } from "../dialogs/instances/DialogConfirmation";
import { MODE_CREATE } from "./ScreenStoryCreate";

const styles = {
  
};

const ACTION_CREATE_STORY = "create_story";

export default class ScreenStoryboard extends Component
{
  constructor(props)
  {
    super(props);

    this.unsubscribers = [];
    this.keyboardUnsubscribers = [];
    this.state =
    {
      team: this.props.navigation.getParam("team"),
      stories: [],
      open: false
    } 
  } 

  componentWillMount() 
  {   
    var unsubscriber = getStories(this.state.team.id).orderBy("upvotes", "desc").onSnapshot(this.onStoryDocumentsChanged);
    this.unsubscribers.push(unsubscriber);

    unsubscriber = this.props.navigation.addListener('willFocus', this.onScreenWillFocus);
    this.unsubscribers.push(unsubscriber);

    unsubscriber = this.props.navigation.addListener('willBlur', this.onScreenWillBlur);
    this.unsubscribers.push(unsubscriber);
  } 
  
  onScreenWillFocus = (payload) =>
  {
    this.setState({shouldFabGroupRender: true})

    var unsubscriber = Keyboard.addListener('keyboardDidShow', () => {this.setState({shouldFabGroupRender: false})});
    this.keyboardUnsubscribers.push(unsubscriber);

    unsubscriber = Keyboard.addListener("keyboardDidHide", () => {this.setState({shouldFabGroupRender: true})});
    this.keyboardUnsubscribers.push(unsubscriber);
  }

  onScreenWillBlur = (payload) =>
  {
    this.setState({shouldFabGroupRender: false})
    this.keyboardUnsubscribers.forEach(unsubscriber => {unsubscriber.remove()});
  }
  
  onStoryDocumentsChanged = (snapshot) =>
  {
      console.log("onStoryDocumentsChanged: " + snapshot.docChanges.length);
      var stories = this.state.stories;
      console.log("Stories: " + stories.length);
      for(var i = 0 ;i < snapshot.docChanges.length ; i ++)
      {
        const current = snapshot.docChanges[i];
        switch(current.type)
        { 
            case "added":
              stories.splice(current.newIndex, 0, current.doc)
              break;

            case "removed":
              stories.splice(current.oldIndex, 1);
              break;

            case "modified":
              stories.splice(current.newIndex, 1, current.doc);
              break;
        }
      }


      this.setState({stories: stories});
      
  }

  componentWillUnmount = () =>
  {
    for(var i = 0 ; i < this.unsubscribers.length ; i ++)
    {
      const unsubscriber = this.unsubscribers[i];
      if(unsubscriber && unsubscriber instanceof Function)
      {   unsubscriber();}  
    }
  }

  onItemSelected = (item, index) =>
  {   this.props.navigation.navigate(SCREEN_NAME_STORY_DETAILS, {story: item});}

  onContextMenuItemSelected = (item, index, action) =>
  {
    console.log("CONTEXT ACTION: " + action);
    switch(action)
    {
      case ACTION_DELETE_STORY:
      if(this.dialogConfirmDelete)
      {
        this.itemToDelete = item;
        this.dialogConfirmDelete.setVisible(true);
      }
      break;
  
      case ACTION_EDIT_STORY:
      this.props.navigation.navigate(SCREEN_NAME_STORY_CREATE, {team: this.state.team, story: item});
      break;

      case ACTION_INSPECT_STORY:
      this.onItemSelected(item, index);
      break; 

      case ACTION_UPVOTE_STORY:
      console.log("Updating: " + item.data().upvotes + " to " + (item.data().upvotes + 1));
      var upvotes = item.data().upvotes + 1;
      item.ref.update({upvotes: upvotes}); 
      break;
    }
  }

  onFabMenuItemSelected = (action) =>
  {
    switch(action)
    {
      case ACTION_CREATE_STORY:
      this.props.navigation.navigate(SCREEN_NAME_STORY_CREATE, {team: this.state.team});
      break;
    }
  }

  onDialogActionPressed = (action) =>
  {
    switch(action)
    {
      case DIALOG_ACTION_OK:
      this.itemToDelete.ref.delete().then(() => 
      {   ToastAndroid.show("User story successfully deleted!", ToastAndroid.LONG);})
      .catch(error => 
      {   ToastAndroid.show("User story could not be deleted, please try again.", ToastAndroid.LONG);});
      break;
    }
  }

  getFabGroupActions = () =>
  {
    var actions = [];
    actions.push({ icon: "add", label: "Create Issue", onPress: () => this.onFabMenuItemSelected(ACTION_CREATE_STORY) })

    return actions;
  }

  getUnfinishedStories = (allStories) =>
  {
    var unfinishedStories = [];
    for(var i = 0 ; i < allStories.length ; i ++)
    {
      const current = allStories[i];
     
      if(current.data().finishedOn === undefined)
      {   unfinishedStories.push(current);}
    }

    return unfinishedStories;
  }
 
  render() 
  {
    return (
      <View>
          <DialogConfirmation title="Confirmation" ref={instance => this.dialogConfirmDelete = instance}  visible={false} message="Are you sure you want to delete this user story?" onDialogActionPressed={this.onDialogActionPressed} />
          <ListStories containerHasFab={true} items={this.getUnfinishedStories(this.state.stories)} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
          {this.state.shouldFabGroupRender && <FABGroup ref={instance => this.fabGroup = instance} color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />}
      </View>
    );
  }
}