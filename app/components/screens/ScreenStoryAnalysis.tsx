import React from "react";
import { ReduxState } from "../../redux/ReduxState";
import ReduxUser from "../../dtos/redux/ReduxUser";
import WithReduxSubscription from "../../hocs/WithReduxSubscription";
import ReduxStory, { StoryLifecycle } from "../../dtos/redux/ReduxStory";
import ReduxInspecting from "../../dtos/redux/ReduxInspecting";
import WithLoading, { WithLoadingProps } from "../../hocs/WithLoading";
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import { Text } from "react-native-paper";
import WithEmptyListFiller from "../../hocs/WithEmptyListFiller";
import ListFillerOption from "../../dtos/options/ListFillerOption";
import FillerBored from "../svg/fillers/FillerBored";
import EfficiencyEngine from "../../engine/EfficiencyEngine";
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import { RNFirebase } from "react-native-firebase";
import DocumentUser from "../../dtos/firebase/firestore/documents/DocumentUser";

type Props = ReduxStateProps & WithLoadingProps & WithDatabaseProps &
{
}

interface State
{
    lifecycle: StoryLifecycle | "Loading",
    efficiency?: number
}

interface ReduxStateProps
{
    user: ReduxUser,
    inspecting: ReduxInspecting
}

const mapStateToProps = (state: ReduxState): ReduxStateProps =>
{
    return {
        user: state.user!,
        inspecting: state.inspecting
    }
}


class ScreenStoryAnalysis extends React.Component<Props, State>
{
    private story: ReduxStory

    constructor(props: Props)
    {
        super(props);
        this.story = props.user.teams[props.inspecting.team!].stories[props.inspecting.story!];

        this.state = {
            lifecycle: this.getLifecycleFromStory(this.story),
            efficiency: undefined
        }
    }

    componentWillMount = () =>
    {
        this.getEfficiency().then(efficiency => 
        {   this.setState({efficiency: efficiency});});
    }
    
    getEfficiency = async () =>
    {
        const query: RNFirebase.firestore.Query = FirebaseAdapter.getUsers().where("teams", "array-contains", this.props.inspecting.team!);
        const snapshot = await query.get();

        const users = snapshot.docs.map(document => DocumentUser.fromSnapshot(document)!);
        return EfficiencyEngine.getProcessEfficiency(this.story, users);
    }
    
    setLoading = (_props: Props) =>
    {   this.props.setLoading(this.story == undefined || this.story.interruptions == undefined || this.story.loaded == false || this.state.efficiency == undefined);}

    getLifecycleFromStory = (story: ReduxStory | undefined) =>
    {
        if(story == undefined)
        {   return "Loading";}

        return story.getLifeCycle(this.props.user.document.id!);
    }

    shouldShowEmptyListFiller = () =>
    {   return this.state.lifecycle == "Unstarted";}

    render()
    {
        return(
            <Text>Process Efficiency: {this.state.efficiency}</Text>
        );
    }
}

const hoc1 = WithReduxSubscription<ScreenStoryAnalysis, ScreenStoryAnalysis, Props, ReduxStateProps,{}>(mapStateToProps, undefined)(ScreenStoryAnalysis);
const hoc2 = WithLoading(hoc1);
const hoc3 = WithDatabase(hoc2);
const hoc4 = WithEmptyListFiller(hoc3, new ListFillerOption(<FillerBored />, "We cannot analyze an unstarted story.", "Start the story in the 'interruptions' tab and let's get cracking!"));

export default hoc4;