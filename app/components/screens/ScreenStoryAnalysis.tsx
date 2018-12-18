import React from "react";
import { ReduxState } from "../../redux/ReduxState";
import ReduxUser from "../../dtos/redux/ReduxUser";
import WithReduxSubscription from "../../hocs/WithReduxSubscription";
import ReduxStory from "../../dtos/redux/ReduxStory";
import ReduxInspecting from "../../dtos/redux/ReduxInspecting";
import WithLoading, { WithLoadingProps } from "../../hocs/WithLoading";
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import WithEmptyListFiller from "../../hocs/WithEmptyListFiller";
import ListFillerOption from "../../dtos/options/ListFillerOption";
import FillerBored from "../svg/fillers/FillerBored";
import ProcessEfficiency from "../../engine/dtos/ProcessEfficiency";
import { HiEfficiencyNavigator } from "../routing/RoutingTypes";
import ProcessEfficiencyErrors from "../../engine/dtos/ProcessEfficiencyErrors";
import ScreenVsm from "../../modules/vsm/screen/ScreenVsm";
import VsmConstants from "../../modules/vsm/VsmConstants";

type Props = ReduxStateProps & WithLoadingProps & WithDatabaseProps &
{
    navigation: HiEfficiencyNavigator
}

interface State
{
    //lifecycle: StoryLifecycle | "Loading",
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
            //lifecycle: this.getLifecycleFromStory(this.story),
            efficiency: undefined
        }

        this.props.setLoading(false);  
    }

    
    setLoading = (_props: Props) =>
    {  
        const shouldLoad = this.story == undefined || this.story.interruptions == undefined || this.story.loaded == false || this.state.efficiency == undefined;
        this.props.setLoading(shouldLoad);
    }
    /*

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


    /*
    getTimelineFromStory = (story: ReduxStory | undefined): Array<AbstractTimelineModel> =>
    {
        if(story == undefined) return [];
        if(story.document.data.startedOn == undefined) return [];

        const interruptions = UtilityIndexable.toArray(story.interruptions);
        const events: Array<{timestamp: Date, change: number}> = [];
        const participants = interruptions.length;

        for(var i = 0 ; i < interruptions.length ; i ++)
        {
            const current = interruptions[i];
            current.document.data.interruptions.map(e => 
            {
                events.push({timestamp: e.timestamp, change: -1});
                if(e.duration) events.push({timestamp: new Date(e.timestamp.getTime() + e.duration), change: 1});
            });
        }

        const sorted = events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        const ratio = 100 / participants;

        const builder = new TimelineBuilder();
        builder.addStart(story.document.data.startedOn, 100);
        
        var previousDate = story.document.data.startedOn;
        var previousValue = 100;

        sorted.forEach(e => 
        {
             if(UtilityDate.areOnSameDay(previousDate, e.timestamp) == false)
             {
                 builder.addSkip(e.timestamp);
             }

             const newValue = previousValue + e.change * ratio;
             builder.addEvent(e.timestamp, newValue);

             previousDate = e.timestamp;
             previousValue = newValue;
        });

        if(story.document.data.finishedOn)
        {
            builder.addFinish(story.document.data.finishedOn, builder.previousValue);
        }

        return builder.build();

        /*const builder = new TimelineBuilder();
        builder.addStart(new Date(2018, 6, 13, 11, 45, 20, 33), 100);
        builder.addSkip(new Date(2018, 6, 14, 11, 50, 0));
        builder.addEvent(new Date(2018, 6, 14, 12, 0, 44, 23), 75);
        builder.addEvent(new Date(2018, 6, 14, 13, 15, 23, 44), 10);
        builder.addSkip(new Date(2018, 6, 15, 17, 0, 0));
        builder.addEvent(new Date(2018, 6, 15, 9, 0, 0, 0), 25);
        builder.addEvent(new Date(2018, 6, 15, 9, 15, 0, 0), 66);
        builder.addSkip(new Date(2018, 6, 16, 17, 0, 0));
        builder.addFinish(new Date(2018, 6, 16, 13, 20, 20, 20), 66);

        return builder.build();
    }*/

    getArrayWindow = (start: number, amount: number, array: Array<number>) =>
    {   return array.splice(start, amount);} 

    render()
    {
        //VSM
        return <ScreenVsm granularity={VsmConstants.GRANULARITIES[0]} story={this.story} />

        //TIMELINE
        //return <Timeline items={this.getTimelineFromStory(this.story)} listId="list-analysis" navigation={this.props.navigation} />

        //OLD ANALYSIS
        /*if(this.state.efficiency == undefined)
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
        }*/
    }
}

const hoc1 = WithReduxSubscription<ScreenStoryAnalysis, ScreenStoryAnalysis, Props, ReduxStateProps,{}>(mapStateToProps, undefined)(ScreenStoryAnalysis);
const hoc2 = WithLoading(hoc1);
const hoc3 = WithDatabase(hoc2);
const hoc4 = WithEmptyListFiller(hoc3, new ListFillerOption(<FillerBored />, "We cannot analyze an unstarted story.", "Start the story in the 'interruptions' tab and let's get cracking!"));

export default hoc4;