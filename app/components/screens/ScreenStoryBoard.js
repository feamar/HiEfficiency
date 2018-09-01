import React, {Component} from "react";
import {View, ToastAndroid, Keyboard} from "react-native";
import PropTypes from "prop-types";
import FirebaseAdapter from '../firebase/FirebaseAdapter';
import ListStories from "../lists/instances/stories/ListStories";
import {ACTION_DELETE_STORY, ACTION_EDIT_STORY, ACTION_INSPECT_STORY, ACTION_UPVOTE_STORY} from  "../lists/instances/stories/ListItemStory";
import {SCREEN_NAME_STORY_DETAILS, SCREEN_NAME_STORY_CREATE} from "../routing/Router";
import {FABGroup} from "react-native-paper";
import DialogConfirmation, { DIALOG_ACTION_OK } from "../dialogs/instances/DialogConfirmation";
import { MODE_CREATE } from "./ScreenStoryCreate";
import * as Progress from 'react-native-progress';
import Theme from "../../styles/Theme";
import UtilityArray from "../../utilities/UtilityArray";
import { Firebase } from "react-native-firebase";

const styles = {
    loading: {
      wrapper: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100%"
      },
      loader: {

      }
  },
};

const ACTION_CREATE_STORY = "create_story";
const ACTION_SCAFFOLD_STORY = "create_story_dev";

export default class ScreenStoryBoard extends Component
{
  static MODE_UNFINISHED = 0;
  static MODE_FINISHED = 1;
  
  constructor(props)
  {
    super(props);

    this.unsubscribers = [];
    this.keyboardUnsubscribers = [];
    
    this.stories = [];
    this.team = this.props.navigation.getParam("team");

    this.state =
    {
      items: [],
      open: false,
      loading: true
    } 
  } 

  componentWillMount() 
  {   
    unsubscriber = this.props.navigation.addListener('willFocus', this.onScreenWillFocus);
    this.unsubscribers.push(unsubscriber);

    unsubscriber = this.props.navigation.addListener('willBlur', this.onScreenWillBlur);
    this.unsubscribers.push(unsubscriber);

    switch(this.props.mode)
    {
      case ScreenStoryBoard.MODE_UNFINISHED:
        var unsubscriber = FirebaseAdapter.getStories(this.team.id).orderBy("upvotes", "desc").onSnapshot(this.onStoryDocumentsChanged);
        break;

      case ScreenStoryBoard.MODE_FINISHED:
        var unsubscriber = FirebaseAdapter.getStories(this.team.id).orderBy("finishedOn", "desc").onSnapshot(this.onStoryDocumentsChanged);
        break;
    }

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
  
  onStoryDocumentsChanged = async (snapshot) =>
  {
      for(var i = 0 ;i < snapshot.docChanges.length ; i ++)
      {
        const current = snapshot.docChanges[i];
        switch(current.type)
        { 
            case "added":
              this.stories.splice(current.newIndex, 0, current.doc)
              break;

            case "removed":
              this.stories.splice(current.oldIndex, 1);
              break;

            case "modified":
              this.stories = UtilityArray.move(this.stories, current.oldIndex, 1, current.newIndex); //Move the old document to the new index.
              this.stories.splice(current.newIndex, 1, current.doc); //Replace the old document AT THE NEW INDEX to the new document.
              break; 
        } 
      } 
      
      this.setState({items: this.getItemsFromStories(this.stories), loading: false});
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

  onItemSelected = async (item, index) =>
  {   this.props.navigation.navigate(SCREEN_NAME_STORY_DETAILS, {story: await this.getStoryDocumentFromData(item)});} 

  onContextMenuItemSelected = async (item, index, action) =>
  {
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
        this.props.navigation.navigate(SCREEN_NAME_STORY_CREATE, {team: this.team, story: await this.getStoryDocumentFromData(item)});
        break;

      case ACTION_INSPECT_STORY:
        this.onItemSelected(item, index);
        break; 

      case ACTION_UPVOTE_STORY:
        const document = await this.getStoryDocumentFromData(item);
        const data = document.data();
        data.upvotes += 1;
        document.ref.update(data); 
        break;
    }
  }

  onFabMenuItemSelected = (action) =>
  {
    switch(action)
    {
      case ACTION_CREATE_STORY:
        this.props.navigation.navigate(SCREEN_NAME_STORY_CREATE, {team: this.team});
        break;

      case ACTION_SCAFFOLD_STORY:
        const story = {
          description: "Automatically scaffolded story for development purposes. This can be deleted in the production database if encounterd.",
          finishedOn: undefined,
          name: "Scaffolded Story " + Math.floor(Math.random() * 1000),
          points:5,
          type:1,
          upvotes: 0
        }

        FirebaseAdapter.getStories(this.team.id).add(story);
    }
  }

  onDialogActionPressed = async (action) =>
  {
    switch(action)
    {
      case DIALOG_ACTION_OK:
        const document = await this.getStoryDocumentFromData(this.itemToDelete);
        document.ref.delete().then(() => 
        {   ToastAndroid.show("User story successfully deleted!", ToastAndroid.LONG);})
        .catch(error => 
        {   ToastAndroid.show("User story could not be deleted, please try again.", ToastAndroid.LONG);});
        break;
    }
  }

  getFabGroupActions = () =>
  {
    var actions = [];
    actions.push({ icon: "add", label: "Create Story", onPress: () => this.onFabMenuItemSelected(ACTION_CREATE_STORY) })

    if(__DEV__)
    {   actions.push({icon: "add", label: "(Development) Scaffold Story", onPress: () => this.onFabMenuItemSelected(ACTION_SCAFFOLD_STORY)});}

    return actions;
  }

  filter = (allStories) =>
  {
    var result = [];
    switch(this.props.mode)
    {
      case ScreenStoryBoard.MODE_FINISHED:
        result = allStories.filter(story => story.finishedOn != undefined);
        break;

      case ScreenStoryBoard.MODE_UNFINISHED:
        result = allStories.filter(story => story.finishedOn == undefined);
        break;
    }
    return result;
  }
  
  render()   
  {
    return (
      <View>
          <DialogConfirmation title="Confirmation" ref={instance => this.dialogConfirmDelete = instance}  visible={false} message="Are you sure you want to delete this user story?" onDialogActionPressed={this.onDialogActionPressed} />
          
          {this.state.loading && 
            <View style={styles.loading.wrapper}>
                <Progress.Circle color={Theme.colors.primary} size={45} indeterminate={true} style={styles.loading.loader} borderWidth={3} />
            </View> 
          }

          {this.state.loading  == false && 
            <ListStories containerHasFab={true} items={this.filter(this.state.items)} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
          }

          {this.state.shouldFabGroupRender && this.state.loading == false && this.props.mode == ScreenStoryBoard.MODE_UNFINISHED && <FABGroup ref={instance => this.fabGroup = instance} color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />}
      </View>
    );
  } 

  getStoryDocumentFromData = async(data) =>
  {
       const document = FirebaseAdapter.getStories(this.team.id).doc(data.id);
       if(document == undefined)
       {  return undefined;}

       return document.get();
  }

  getItemsFromStories = (stories) =>
  {
    return stories.map(story => 
    {
      const data = story.data();
      data.id = story.id;

      return data;
    })
  ;}
}