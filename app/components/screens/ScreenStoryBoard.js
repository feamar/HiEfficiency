import React, {Component} from "react";
import {View, ToastAndroid, Keyboard} from "react-native";
import PropTypes from "prop-types";
import FirebaseAdapter from '../firebase/FirebaseAdapter';
import ListStories from "../lists/instances/stories/ListStories";
import {STACK_NAME_STORY_DETAILS, SCREEN_NAME_STORY_CREATE} from "../routing/Router";
import {FAB} from "react-native-paper";
import DialogConfirmation from "../dialogs/instances/DialogConfirmation";
import { MODE_CREATE } from "./ScreenStoryCreate";
import * as Progress from 'react-native-progress';
import Theme from "../../styles/Theme";
import UtilityArray from "../../utilities/UtilityArray";
import { Firebase } from "react-native-firebase";
import UtilityScreen from "../../utilities/UtilityScreen";
import withFloatingActionButton from "../../hocs/WithFloatingActionButton";
import ActionType from "../../enums/ActionType";
import ListItemStory from "../lists/instances/stories/ListItemStory";
import AbstractList from "../lists/abstractions/list/AbstractList";
import UtilityObject from "../../utilities/UtilityObject";

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

class ScreenStoryBoard extends Component
{
  static MODE_UNFINISHED = 0;
  static MODE_FINISHED = 1;
  
  constructor(props)
  {
    super(props);

    this.unsubscribers = [];
    
    this.stories = [];
    this.team = this.props.navigation.getParam("team");

    this.state =
    {
      items: [],
      open: false, 
      loading: true,
      shouldFabGroupRender: true
    } 
  }  

  componentWillMount() 
  {   

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

  setFabVisibility = (visible) =>
  {   this.setState({shouldFabGroupRender: visible});}
  
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
              this.stories.splice(current.newIndex, 1, current.doc); //Replace the old document AT THE NEW INDEX with the new document.
              break; 
        } 
      } 
      
      this.setState({items: this.filter(this.getItemsFromStories(this.stories)), loading: false});
  }

  componentWillUnmount = () => 
  {   this.unsubscribers.forEach(unsubscriber => unsubscriber());}

  onItemSelected = async (item, index) =>
  {   this.props.navigation.navigate(STACK_NAME_STORY_DETAILS, {story: await this.getStoryDocumentFromData(item)});} 

  onContextMenuItemSelected = async (item, index, action) =>
  {
    switch(action)
    {
      case ActionType.DELETE:
        if(this.dialogConfirmDelete)
        {
          this.itemToDelete = item;
          this.dialogConfirmDelete.setVisible(true);
        }
        break;

      case ActionType.INSPECT:
        this.onItemSelected(item, index);
        break; 

      case ActionType.UPVOTE:
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
      case ActionType.CREATE:
        this.props.navigation.navigate(SCREEN_NAME_STORY_CREATE, {team: this.team});
        break;

      case ActionType.SCAFFOLD:
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
      case ActionType.POSITIVE:
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
    actions.push({ icon: "add", label: "Create Story", onPress: () => this.onFabMenuItemSelected(ActionType.CREATE) })

    if(__DEV__)
    {   actions.push({icon: "add", label: "(Development) Scaffold Story", onPress: () => this.onFabMenuItemSelected(ActionType.SCAFFOLD)});}

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
      <View style={{height: "100%"}}>
          <DialogConfirmation title="Confirmation" ref={instance => this.dialogConfirmDelete = instance}  visible={false} message="Are you sure you want to delete this user story?" onDialogActionPressed={this.onDialogActionPressed} />
          
          {this.state.loading && 
            <View style={styles.loading.wrapper}>
                <Progress.Circle color={Theme.colors.primary} size={45} indeterminate={true} style={styles.loading.loader} borderWidth={3} />
            </View> 
          }

          {this.state.loading  == false && 
            <ListStories containerHasFab={true} items={this.state.items} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
          }

          {this.state.shouldFabGroupRender && this.state.loading == false && this.props.mode == ScreenStoryBoard.MODE_UNFINISHED && <FAB.Group ref={instance => this.fabGroup = instance} color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />}
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

export default ScreenStoryBoard;