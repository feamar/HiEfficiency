import React, {Component} from "react";
import {View} from "react-native";
import {STACK_NAME_STORY_DETAILS, SCREEN_NAME_STORY_CREATE, SCREEN_NAME_STORY_DETAILS_INFO} from "../routing/Router";
import {FAB} from "react-native-paper";
import ActionType from "../../enums/ActionType";
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import WithDialogContainer, { WithDialogContainerProps } from "../../hocs/WithDialogContainer";
import { ReduxState } from "../../redux/ReduxState";
import ReduxUser from "../../dtos/redux/ReduxUser";
import { Dispatch } from "redux";
import ActionStartInspectTeam from "../../redux/actions/inspection/ActionStartInspectTeam";
import ActionStartInspectStory from "../../redux/actions/inspection/ActionStartInspectStory";
import { HiEfficiencyNavigator } from "../routing/RoutingTypes";
import AbstractFirestoreDocument from "../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import DocumentTeam from "../../dtos/firebase/firestore/documents/DocumentTeam";
import WithReduxSubscription from "../../hocs/WithReduxSubscription";
import WithLoading, { WithLoadingProps } from "../../hocs/WithLoading";
import ReduxStory from "../../dtos/redux/ReduxStory";
import DialogConfirmation, { ConcreteDialogConfirmation, DialogConfirmationActionUnion } from "../dialog/instances/DialogConfirmation";
import ReduxTeam from "../../dtos/redux/ReduxTeam";
import ListStories from "../list/instances/stories/ListStories";
import ActionOption from "../../dtos/options/ActionOption";
import WithEmptyListFiller from "../../hocs/WithEmptyListFiller";
import ListFillerOption from "../../dtos/options/ListFillerOption";
import { AbstractList_Props_Virtual } from "../list/abstractions/list/AbstractList";
import equal from "deep-equal";
import DocumentStory from "../../dtos/firebase/firestore/documents/DocumentStory";
import Toast from 'react-native-simple-toast';

interface ReduxStateProps
{
  user: ReduxUser
}

interface ReduxDispatchProps
{
  onInspectTeamStart: (teamId: string) => ActionStartInspectTeam,
  onInspectStoryStart: (storyId: string) => ActionStartInspectStory
}

type Props = ReduxStateProps & ReduxDispatchProps & WithDatabaseProps & WithDialogContainerProps & WithLoadingProps &
{
  navigation: HiEfficiencyNavigator,
  mode: StoryboardMode
}

type State = ReduxStateProps  & 
{
  open: boolean,
  storyListItems: Array<ReduxStory>
}

const mapStateToProps = (state: ReduxState): ReduxStateProps =>
{
  return {
    user: state.user!
  }
}

const mapDispatchToProps = (dispatch: Dispatch): ReduxDispatchProps =>
{
  return {
    onInspectTeamStart: (teamId: string) => dispatch(new ActionStartInspectTeam(teamId)),
    onInspectStoryStart: (storyId: string) => dispatch(new ActionStartInspectStory(storyId))
  }
}

export type StoryboardMode = "Todo" | "Doing" | "Done";

class ScreenStoryBoard extends Component<Props, State>
{
  static displayName = "Screen Story Board";
  
  private team: AbstractFirestoreDocument<DocumentTeam>
  private dialogConfirmDelete?: ConcreteDialogConfirmation
  private itemToDelete?: ReduxStory;
  private list: ListStories | undefined;


  constructor(props: Props)
  {
    super(props);

    this.team = this.props.navigation.getParam("team");
    
    this.state =
    {
      open: false, 
      user: props.user,
      storyListItems: this.getStoryListItems(props),
    }
  }  

  shouldComponentUpdate = (nextProps: Readonly<Props>, nextState: Readonly<State>, _nextContext: Readonly<any>) =>
  {
    if(equal(nextProps, this.props) && equal(this.state, nextState))
    {   return false;}

    return true;
  }

  componentWillReceiveProps = (props: Props) =>
  {
    //console.log("NEW PROPS FOR STORYBOARD: " + UtilityObject.stringify(props));
    if(this.state.user != props.user)
    { 
      this.setState({user: props.user, storyListItems: this.getStoryListItems(props)});
      this.setLoading(props);
    }
  }

  setLoading = (props: Props) =>
  { 
    var shouldBeLoading: boolean = false;
    if(props.user == undefined || props.user.teams == undefined || this.team == undefined || this.team.id == undefined)
    {   shouldBeLoading = true;  }
    else
    {
      var team = props.user.teams[this.team.id];
      if(team == undefined || team.loaded == false)
      {   shouldBeLoading = true;}
    }

    return this.props.setLoading(shouldBeLoading);
  }

  getStoryListItems = (props: Props): Array<ReduxStory> =>
  {
    if(this.team.id == undefined)
    {   return [];}

    const team = props.user.teams[this.team.id];
    if(team == undefined)
    {   return [];}

    const stories = team.stories;
    const keys = Object.keys(stories);
    const collection = keys.map(key => 
    {   return stories[key]!});
    
    const filtered = this.filter(collection, props.mode);
    return filtered;
  }

  componentWillMount() 
  {
    const items = this.getStoryListItems(this.props);
    this.setState({storyListItems: items})
    this.setLoading(this.props);
  }

  componentDidMount()
  {   
    this.props.onInspectTeamStart(this.team.id!); 
  }

  onItemSelected = async (item: ReduxStory, _index: number, selectedTabScreenName?: string) =>
  {   
    this.props.onInspectStoryStart(item.document.id!);
    this.props.navigation.navigate(STACK_NAME_STORY_DETAILS, {story: item, subtitle: item.document.data.name});

    if(selectedTabScreenName != undefined)
    {   this.props.navigation.navigate(selectedTabScreenName);}
  } 


  onContextMenuItemSelected = async (item: ReduxStory, index: number, action: ActionOption) =>
  {
    switch(action.id)
    {
      case ActionType.DELETE:
        if(this.dialogConfirmDelete)
        {
          this.itemToDelete = item;
          if(this.dialogConfirmDelete.base)
          {   this.dialogConfirmDelete.base.setVisible(true);}
        }
        break;

      case ActionType.EDIT:
        this.onItemSelected(item, index, SCREEN_NAME_STORY_DETAILS_INFO);
        break; 

      case ActionType.UPVOTE:
        if(this.team.id == undefined || item.document.id == undefined)
        {   return;}

        const team: ReduxTeam | undefined = this.props.user.teams[this.team.id];
        if(team == undefined)
        {   return;}

        const old: ReduxStory | undefined = team.stories[item.document.id];
        if(old == undefined)
        {   return;}

        await this.props.database.inDialog("dialog-upvoting-story", this.props.addDialog, this.props.removeDialog, "Upvoting Story", async (execute) => 
        {
          const update = this.props.database.updateStory(this.team.id!, item.document.id!, old.document.data, {upvotes: {$set: item.document.data.upvotes + 1}});
          await execute(update, false);
        });
        break;
    }
  }

  onFabMenuItemSelected = async (action: ActionType) =>
  {
    switch(action)
    {
      case ActionType.CREATE:
        this.props.navigation.navigate(SCREEN_NAME_STORY_CREATE, {team: this.team});
        break;

      case ActionType.SCAFFOLD:
        const story = DocumentStory.create("Scaffolded Story " + Math.floor(Math.random() * 1000), 1, this.props.user.document.data);
        story.description = "Automatically scaffolded story for development purposes. This can be deleted in the production database if encounterd.";

        if(this.team.id == undefined)
        {   return Toast.show("Could not retrieve team id, please try again later.", Toast.LONG);}  

        await this.props.database.inDialog("dialog-creating-story", this.props.addDialog, this.props.removeDialog, "Creating Story", async (execute) => 
        {
            const create = this.props.database.createStory(this.team.id!, story);
            await execute(create, false);
        });
    }
  }

  onDialogActionPressed = async (_baseComponent: ConcreteDialogConfirmation | undefined, action: DialogConfirmationActionUnion) =>
  {
    switch(action)
    {
      case "Positive":
        
        if(this.team.id == undefined)
        {   return Toast.show("Could not retrieve team id, please try again later.", Toast.LONG);}  

        await this.props.database.inDialog("dialog-deleting-story", this.props.addDialog, this.props.removeDialog, "Deleting Story", async (execute) => 
        {
          const del = this.props.database.deleteStory(this.team.id!, this.itemToDelete!.document.id!);
          await execute(del, false);
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

  filter = (allStories: Array<ReduxStory>, mode: StoryboardMode) =>
  {
    var result: Array<ReduxStory> = [];
    switch(mode)
    {
      case "Todo":
        result = allStories.filter(story => story.document.data.startedOn == undefined);
        
        //Sort on "upvotes" in descending order, then on "createdOn".
        result = result.sort((a, b) => 
        { 
          if(a.document.data.upvotes == b.document.data.upvotes)
          {   return a.document.data.createdOn < b.document.data.createdOn ? -1 : 1}
          else
          {   return a.document.data.upvotes > b.document.data.upvotes ? -1 : 1;}
        }); 
        break;

      case "Doing":
        result = allStories.filter(story => story.document.data.finishedOn == undefined && story.document.data.startedOn != undefined);        
        result = result.sort((a, b) => {  return b.document.data.startedOn!.getTime() - a.document.data.startedOn!.getTime()}); //Sort on "startedOn" in descending order.
        break;
     
      case "Done":
        result = allStories.filter(story => story.document.data.finishedOn != undefined);
        result = result.sort((a, b) => {  return b.document.data.finishedOn!.getTime() - a.document.data.finishedOn!.getTime()}); //Sort on "finishedOn" in descending order.
        break;
    }
    return result;
  }


  getListComponent = (mode: StoryboardMode) =>
  {
    switch(mode)
    { 
      case "Todo":
        const Hoc1 = WithEmptyListFiller<ListStories, ListStories, AbstractList_Props_Virtual<ReduxStory>>(ListStories, ListFillerOption.NoExistingStories);
        return <Hoc1 navigation={this.props.navigation} listId={"stories-todo"}  concreteRef={(i: ListStories | undefined) => this.list = i} containerHasFab={true} items={this.state.storyListItems} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />

      case "Doing":
        const Hoc2 = WithEmptyListFiller<ListStories, ListStories, AbstractList_Props_Virtual<ReduxStory>>(ListStories, ListFillerOption.NoStoriesInProgress);
        return <Hoc2 navigation={this.props.navigation} listId={"stories-doing"}  concreteRef={(i: ListStories | undefined) => this.list = i} containerHasFab={true} items={this.state.storyListItems} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />

      default:
        const Hoc3 = WithEmptyListFiller<ListStories, ListStories, AbstractList_Props_Virtual<ReduxStory>>(ListStories, ListFillerOption.NoWorkCompleted);
        return <Hoc3 navigation={this.props.navigation} listId={"stories-done"}  concreteRef={(i: ListStories | undefined) => this.list = i} containerHasFab={true} items={this.state.storyListItems} onItemSelected={this.onItemSelected} onContextMenuItemSelected={this.onContextMenuItemSelected} />
    }
  }
  
  render()   
  {
    const component = <View style={{height: "100%"}}>
                        <DialogConfirmation title="Confirmation" concreteRef={i => this.dialogConfirmDelete = i}  visible={false} message="Are you sure you want to delete this user story?" onActionClickListener={this.onDialogActionPressed} />
                        {this.getListComponent(this.props.mode)}
                        {this.props.mode == "Todo" && <FAB.Group color="white" open={this.state.open} icon='more-vert' actions={this.getFabGroupActions()} onStateChange={(open: {open: boolean}) => this.setState(open)} />}
                      </View>;

    return component;
  
  } 
}

const hoc1 = WithReduxSubscription<ScreenStoryBoard, ScreenStoryBoard, Props, ReduxStateProps, ReduxDispatchProps>(mapStateToProps, mapDispatchToProps)(ScreenStoryBoard);
const hoc2 = WithDatabase(hoc1);
const hoc3 = WithDialogContainer(hoc2);
const hoc4 = WithLoading(hoc3);

export default hoc4;