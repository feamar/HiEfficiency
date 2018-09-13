import React, {Component} from "react";
import {View, ToastAndroid, Keyboard} from "react-native";
import FirebaseAdapter from '../firebase/FirebaseAdapter';
import ListStories from "../lists/instances/stories/ListStories";
import {STACK_NAME_STORY_DETAILS, SCREEN_NAME_STORY_CREATE, SCREEN_NAME_STORY_DETAILS_INFO} from "../routing/Router";
import {FAB} from "react-native-paper";
import DialogConfirmation from "../dialogs/instances/DialogConfirmation";
import ActionType from "../../enums/ActionType";
import WithReduxListener from "../../hocs/WithReduxListener";
import * as ReducerInspecting from "../../redux/reducers/ReducerInspecting";

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

const mapStateToProps = (state, props) =>
{
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, props) =>
{
  return {
    onInspectTeamStart: (teamId) => dispatch(ReducerInspecting.onInspectTeamStart(teamId)),
    onInspectTeamEnd: () => dispatch(ReducerInspecting.onInspectTeamEnd()),
    onInspectStoryStart: (storyId) => dispatch(ReducerInspecting.onInspectStoryStart(storyId))
  }
}

class ScreenStoryBoard extends Component
{
  static displayName = "Screen Story Board";
  static MODE_TODO = 0;
  static MODE_DOING = 1;
  static MODE_DONE = 2;
  
  constructor(props)
  {
    super(props);

    this.team = this.props.navigation.getParam("team");

    this.state =
    {
      storyListItems: [],
      open: false, 
      shouldFabGroupRender: true
    }
  }  

  onReduxStateChanged = (props) =>
  {
    if(this.state.user != props.user)
    { 
      this.setState({user: props.user, storyListItems: this.getStoryListItems(props)});
      this.setLoading(props);
    }
  }

  setLoading = (props) =>
  { 
    const shouldBeLoading = props.user == undefined 
                            || props.user.teams == undefined 
                            || props.user.teams[this.team.id] == undefined 
                            || props.user.teams[this.team.id].stories == undefined
                            || props.user.teams[this.team.id].loaded == false;
    return this.props.setLoading(shouldBeLoading);
  }

  getStoryListItems = (props) =>
  {
    const stories = props.user.teams[this.team.id].stories;
    const keys = Object.keys(stories);
    const collection = keys.map((key, index) => 
    {   return stories[key]});
    
    return this.filter(collection, props.mode)
  }

  setFabVisibility = (visible) =>
  {   this.setState({shouldFabGroupRender: visible});}

  componentWillMount() 
  {
    const items = this.getStoryListItems(this.props);
    this.setState({storyListItems: items})
    this.setLoading(this.props);
  }

  componentDidMount()
  {   this.props.onInspectTeamStart(this.team.id); }

  componentWillUnmount()
  {   this.props.onInspectTeamEnd();}

  onItemSelected = async (item, index, selectedTabScreenName) =>
  {   
    this.props.onInspectStoryStart(item.id);
    this.props.navigation.navigate(STACK_NAME_STORY_DETAILS, {story: item});

    if(selectedTabScreenName)
    { this.props.navigation.navigate(selectedTabScreenName);}
  } 

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

      case ActionType.EDIT:
        this.onItemSelected(item, index, SCREEN_NAME_STORY_DETAILS_INFO);
        break; 

      case ActionType.UPVOTE:
        const document = FirebaseAdapter.getStories(this.team.id).doc(item.id);
        document.update({upvotes: item.data.upvotes + 1});
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
          upvotes: 0,
          createdOn: new Date()
        }
        FirebaseAdapter.getStories(this.team.id).add(story);
    }
  }

  onDialogActionPressed = async (action) =>
  {
    switch(action)
    {
      case ActionType.POSITIVE:

        const document = FirebaseAdapter.getStories(this.team.id).doc(this.itemToDelete.id);

        document.collection("interruptionsPerUser").get().then(interruptions => 
        {
          interruptions.docs.forEach(doc => {doc.ref.delete()});

          document.delete().then(() =>
          {   ToastAndroid.show("User story successfully deleted!", ToastAndroid.LONG);})
          .catch(error => 
          {   ToastAndroid.show("User story could not be deleted, please try again.", ToastAndroid.LONG);});
        });

        
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

  filter = (allStories, mode) =>
  {
    var result = [];
    switch(mode)
    {
      case ScreenStoryBoard.MODE_TODO:
        result = allStories.filter(story => story.data.startedOn == undefined);
        result = result.sort((a, b) => {  return b.data.upvotes - a.data.upvotes}); //Sort on "upvotes" in descending order.
        break;

      case ScreenStoryBoard.MODE_DOING:
        result = allStories.filter(story => story.data.finishedOn == undefined && story.data.startedOn != undefined);        
        result = result.sort((a, b) => {  return b.data.startedOn - a.data.startedOn}); //Sort on "startedOn" in descending order.
        break;
     
      case ScreenStoryBoard.MODE_DONE:
        result = allStories.filter(story => story.data.finishedOn != undefined);
        result = result.sort((a, b) => {  return b.data.finishedOn - a.data.finishedOn}); //Sort on "finishedOn" in descending order.
        break;
    }
    return result;
  }
  
  render()   
  {
    return (
      <View style={{height: "100%"}}>
          <DialogConfirmation title="Confirmation" ref={instance => this.dialogConfirmDelete = instance}  visible={false} message="Are you sure you want to delete this user story?" onDialogActionPressed={this.onDialogActionPressed} />
          <ListStories containerHasFab={true} items={this.state.storyListItems} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
          {this.state.shouldFabGroupRender && this.props.mode == ScreenStoryBoard.MODE_TODO && <FAB.Group ref={instance => this.fabGroup = instance} color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open) => this.setState(open)} />}
      </View>
    );
  } 
}

export default WithReduxListener(mapStateToProps, mapDispatchToProps, ScreenStoryBoard);