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
import { View, StyleSheet } from "react-native";
import TextGroup from "../text/TextGroup";
import UtilityTime from "../../utilities/UtilityTime";
import ProcessEfficiencyErrors from "../../engine/dtos/ProcessEfficiencyErrors";
import UtilityMap from "../../utilities/UtilityMap";
import Theme from "../../styles/Theme";
import ProcessEfficiency from "../../engine/dtos/ProcessEfficiency";

const styles = StyleSheet.create({
    root: {
        marginLeft: 20,
        marginRight: 20,
    },
    error:
    {
        color: Theme.colors.error
    },
    unstarted_wrapper:
    {
        padding:20, 
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%"
    },
    unstarted:
    {
        textAlign: "center"
    }
});

type Props = ReduxStateProps & WithLoadingProps & WithDatabaseProps &
{
}

interface State
{
    lifecycle: StoryLifecycle | "Loading",
    efficiency?: ProcessEfficiency | ProcessEfficiencyErrors
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

        if(this.state.efficiency instanceof ProcessEfficiency)
        {
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
        else if (this.state.lifecycle == "Unstarted")
        {
            return (
                <View style={styles.unstarted_wrapper}>
                    <Text style={styles.unstarted}>Analysis cannot be done until the story has been started.</Text>
                </View>
            );
        }
        else
        {
            const plurality = this.state.efficiency.length > 1 ? this.state.efficiency.length + " errors" : this.state.efficiency.length + " error";
            const thisOrThese = this.state.efficiency.length > 1 ? "these errors" : "this error";

            return (
                <View style={styles.root}>
                    <TextGroup title="What Happened">
                        <Text>We've encountered {plurality} while calculating your process efficiency. Please address {thisOrThese} in order to see the correct results of the calculations.</Text>
                    </TextGroup>
                    {this.state.efficiency.hasGlobalErrors() && 
                        <TextGroup title="Global Errors">
                            {this.state.efficiency.global().map(error => 
                            {   return <Text key={"global-" + error.type} style={styles.error}>{error.type.toString()}</Text>})}
                        </TextGroup>
                    }
                    {this.state.efficiency.hasUserSpecificErrors() && 
                        UtilityMap.map(this.state.efficiency.userSpecific(), (key, value) =>
                        {
                            return  <TextGroup key={key} title={key}>
                                        {value.map(type => <Text key={"key-" + type} style={styles.error}>{type}</Text>)}
                                    </TextGroup>
                        })
                    }
                    
                </View>
            );
        }
    }
}

const hoc1 = WithReduxSubscription<ScreenStoryAnalysis, ScreenStoryAnalysis, Props, ReduxStateProps,{}>(mapStateToProps, undefined)(ScreenStoryAnalysis);
const hoc2 = WithLoading(hoc1);
const hoc3 = WithDatabase(hoc2);
const hoc4 = WithEmptyListFiller(hoc3, new ListFillerOption(<FillerBored />, "We cannot analyze an unstarted story.", "Start the story in the 'interruptions' tab and let's get cracking!"));

export default hoc4;