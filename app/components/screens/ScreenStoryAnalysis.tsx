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
import ProcessEfficiency from "../../engine/dtos/ProccessEfficiency";
import { View, StyleSheet } from "react-native";
import TextGroup from "../text/TextGroup";
import UtilityTime from "../../utilities/UtilityTime";

const styles = StyleSheet.create({
    root: {
        marginLeft: 20,
        marginRight: 20,
    }
});

type Props = ReduxStateProps & WithLoadingProps & WithDatabaseProps &
{
}

interface State
{
    lifecycle: StoryLifecycle | "Loading",
    efficiency?: ProcessEfficiency
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

    componentWillReceiveProps = (props: Props) =>
    {
        const newStory = props.user.teams[props.inspecting.team!].stories[props.inspecting.story!];
        if(this.story != newStory)
        {
            this.story = newStory;
            this.setState({lifecycle: this.getLifecycleFromStory(this.story)});
        }

        this.getEfficiency().then(efficiency => 
        {   
            this.setState({efficiency: efficiency}, () => { this.setLoading(this.props);});
        });

        this.setLoading(props);
    }

    componentWillMount = () =>
    {
        this.getEfficiency().then(efficiency => 
        {   
            this.setState({efficiency: efficiency}, () => { this.setLoading(this.props);});
        });
    }
    
    getEfficiency = async () =>
    {
        return await EfficiencyEngine.getProcessEfficiency(this.story);
    }
    
    setLoading = (_props: Props) =>
    {  
        const shouldLoad = this.story == undefined || this.story.interruptions == undefined || this.story.loaded == false || this.state.efficiency == undefined;
        this.props.setLoading(shouldLoad);
    }

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
        if(this.state.efficiency == undefined)
        {   return null;}

        const participants = this.state.efficiency.usernames.length == 0 ? "None" : this.state.efficiency.usernames;
        const processEfficiency = (this.state.efficiency.processEfficiency * 100);
        const processEfficiencyString = isNaN(processEfficiency) ? "Uncalculatable" : processEfficiency.toFixed(2) + "%";
        
        const productiveTime = UtilityTime.millisecondsToLongDuration(this.state.efficiency.productiveTime);
        const interruptionTime = UtilityTime.millisecondsToLongDuration(this.state.efficiency.interruptionTime);
        const totalTime = UtilityTime.millisecondsToLongDuration(this.state.efficiency.totalTime);

        return(
            <View style={styles.root}>
                <TextGroup title="Participants">
                    <Text>{participants}</Text>
                </TextGroup>
                <TextGroup title="Productive Time">
                    <Text>{productiveTime}</Text>
                </TextGroup>
                <TextGroup title="Interruption Time">
                    <Text>{interruptionTime}</Text>
                </TextGroup>
                <TextGroup title="Total Time">
                    <Text>{totalTime}</Text>
                </TextGroup>
                <TextGroup title="Process Efficiency">
                    <Text>{processEfficiencyString}</Text>
                </TextGroup>
            </View>
        );
    }
}

const hoc1 = WithReduxSubscription<ScreenStoryAnalysis, ScreenStoryAnalysis, Props, ReduxStateProps,{}>(mapStateToProps, undefined)(ScreenStoryAnalysis);
const hoc2 = WithLoading(hoc1);
const hoc3 = WithDatabase(hoc2);
const hoc4 = WithEmptyListFiller(hoc3, new ListFillerOption(<FillerBored />, "We cannot analyze an unstarted story.", "Start the story in the 'interruptions' tab and let's get cracking!"));

export default hoc4;