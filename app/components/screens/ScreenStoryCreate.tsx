import React, {Component} from "react";
import {View, ScrollView, StyleSheet} from "react-native";
import PreferenceCategory from "../preferences/PreferenceCategory";
import StoryType from "../../enums/StoryType";
import WithBackButtonInterceptor from "../../hocs/WithBackButtonInterceptor";
import { SCREEN_NAME_STORY_DETAILS_INFO } from "../routing/Router";
import update from "immutability-helper";
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import WithDialogContainer, { WithDialogContainerProps } from "../../hocs/WithDialogContainer";
import UtilityUpdate from "../../utilities/UtilityUpdate";
import InputFloatingActionButton from "../inputs/InputFloatingActionButton";
import { ReduxState } from "../../redux/ReduxState";
import ReduxInspecting from "../../dtos/redux/ReduxInspecting";
import { HiEfficiencyNavigator } from "../routing/RoutingTypes";
import DocumentStory from "../../dtos/firebase/firestore/documents/DocumentStory";
import AbstractPreference from "../preferences/field/AbstractPreference";
import AbstractFirestoreDocument from "../../dtos/firebase/firestore/documents/AbstractFirestoreDocument";
import DialogConfirmation, { ConcreteDialogConfirmation, DialogConfirmationActionUnion } from "../dialog/instances/DialogConfirmation";
import PreferenceText from "../preferences/field/PreferenceText";
import { Baseable } from "../../render_props/Baseable";
import { DialogPreferenceText_StorageValue } from "../dialog/preferences/DialogPreferenceText";
import PreferenceSelectSpinner, { PreferenceSelectSpinner_StorageValue } from "../preferences/field/PreferenceSelectSpinner";
import SelectOption from "../../dtos/options/SelectOption";
import WithReduxSubscription from "../../hocs/WithReduxSubscription";

const styles = StyleSheet.create({
    scrollView:{
        height: "100%"
    }
});

interface ReduxStateProps
{
    inspecting: ReduxInspecting
}

type Props = ReduxStateProps & WithDatabaseProps & WithDialogContainerProps &  
{
    navigation: HiEfficiencyNavigator
}

type State =  
{
    story: AbstractFirestoreDocument<DocumentStory>,
    fabEnabled: boolean
}

type Mode = "Create" | "Edit";

const mapStateToProps = (state: ReduxState): ReduxStateProps  =>
{
    return {
        inspecting: state.inspecting
    }
}

type Fields = 
{
    name: Baseable<Baseable<AbstractPreference<DialogPreferenceText_StorageValue>>> | null,
    description: Baseable<Baseable<AbstractPreference<DialogPreferenceText_StorageValue>>> | null,
    type: Baseable<Baseable<AbstractPreference<PreferenceSelectSpinner_StorageValue>>> | null,
    points: Baseable<Baseable<AbstractPreference<DialogPreferenceText_StorageValue>>> | null
}

class ScreenStoryCreate extends Component<Props, State>
{
    static displayName = "Story Details Information";

    private unsavedChanges: boolean;
    private mode: Mode;
    private fields: Fields;
    private confirmationDialog?: ConcreteDialogConfirmation;

    constructor(props: Props)
    {
        super(props);
  
        var story: AbstractFirestoreDocument<DocumentStory> = 
        {
            id: undefined,
            data:
            {
                upvotes: 0,
                startedOn: undefined,
                finishedOn: undefined,
                createdOn: new Date(),
                name: "",
                type: 0
            }
        }

        const existingStory = props.navigation.getParam("story");
        this.mode = "Create";
        if(existingStory) 
        {
            story = existingStory;
            this.mode = "Edit";
        }

        this.unsavedChanges = false;
        this.fields = 
        {
            name: null,
            description: null,
            type: null,
            points: null
        };

        this.state =
        {
            story: story,
            fabEnabled: true,
        }
    }

    onHardwareBackPress = () =>
    {   return this.onSoftwareBackPress();}

    onSoftwareBackPress = () =>
    {
        if(this.unsavedChanges == false || this.confirmationDialog == undefined)
        {   return false;}

        if(this.confirmationDialog.base)
        {   this.confirmationDialog.base.setVisible(true);}

        return true;
    }
 
    onValueChanged = (field: keyof DocumentStory) => (value: any) =>
    {
        var story = this.state.story;
        if(story.data[field] == value)
        {   return;}

        this.unsavedChanges = true ;
        story = update(story, {data: {[field]: {$set: value}}});
        this.setState({story: story});
    }

    onValueValidation = (field: keyof DocumentStory) => (value: any) =>
    {
        switch(field)
        {
            case "upvotes":
                if(value % 1 != 0)
                {   return "Please enter an integer value.";}
            break;
        }

        return undefined;
    }

    chainValidation = (fields: Array<Baseable<Baseable<AbstractPreference<any>>> | null>) =>
    {
        for(var i = 0; i < fields.length ; i ++)
        {
            const field = fields[i];
            const result = this.isFieldValid(field);

            if(result == false)
            {   return false;}
        }

        return true;
    }

    isFieldValid = (field?: Baseable<Baseable<AbstractPreference<any>>>| null): boolean =>
    {
        if(field == undefined)
        {   return false;}

        if(field.base == undefined || field.base.base == undefined)
        {   return false;}

        return field.base.base.validate();
    }


    onFabPress = async () =>
    {
        this.setState({fabEnabled: false});
        const valid: boolean = this.chainValidation([this.fields.name, this.fields.description, this.fields.type, this.fields.points])

        if(valid == false) 
        {
            this.setState({fabEnabled: true});
            return;
        }

        const teamId = this.props.inspecting.team;
        switch(this.mode)
        { 
            case "Create":
                await this.props.database.inDialog("dialog-creating-story", this.props.addDialog, this.props.removeDialog, "Creating Story", async (execute) => 
                {
                    const crud = this.props.database.createStory(teamId!, this.state.story.data);
                    crud.onCompleteListener = (successful: boolean) => 
                    {
                        if(successful)
                        {   this.props.navigation.goBack();}
                    };
                    await execute(crud, false);
                });

                break;

            case "Edit":
                const old: AbstractFirestoreDocument<DocumentStory> = this.props.navigation.getParam("story");
                const updates = UtilityUpdate.getUpdatesFromShallowObject(this.state.story);
                
                await this.props.database.inDialog("dialog-updating-story", this.props.addDialog, this.props.removeDialog, "Updating Story", async (execute) => 
                {
                    const update = this.props.database.updateStory(teamId!, old.id!, old.data, updates);
                    const result = await execute(update, false);

                    if(result.successful)
                    {   
                        const parent = this.props.navigation;
                        if(parent)
                        {   parent.setParams({ subtitle: this.state.story.data.name });}
                    }
                });
                this.unsavedChanges = false;
                break;
        }

        this.setState({fabEnabled: true});
    }

    getStoryTypeOptions = (): Array<SelectOption> =>
    {   return StoryType.Values.map(type => new SelectOption(type.id, type.name));}

    onDialogConfirmed = (_baseComponent: ConcreteDialogConfirmation | undefined, action: DialogConfirmationActionUnion) =>
    {
        if(action == "Positive")
        {
            this.unsavedChanges = false; 

            //If the screen is encapsulated in a tab navigator, we'll need to perform the navigation event on the parent tab navigator.
            if(this.props.navigation.state.key == SCREEN_NAME_STORY_DETAILS_INFO)
            {
                const parent = this.props.navigation;
                parent.goBack();
            }
            else  
            {   this.props.navigation.goBack();}
        }
    }

    render()
    { 
        const data = this.state.story.data;
        const storyType: StoryType = StoryType.fromId(data.type) || StoryType.Feature;
        const storyPoints = data.points == undefined ? ""  : data.points.toString();

        return ( 
            <View style={{height: "100%"}}> 
                <ScrollView style={styles.scrollView}>
                    <PreferenceCategory title="Mandatory">
                        <PreferenceText label="Name" required ref={c => this.fields.name = c} title="Name" storageValue={{text: data.name}} onValueChanged={this.onValueChanged("name")}  multiline={true} numberOfLines={2} />
                        <PreferenceText label="Description" ref={c => this.fields.description = c} title="Description" storageValue={{text: data.description}} onValueChanged={this.onValueChanged("description")} multiline={true} numberOfLines={5} />
                        <PreferenceSelectSpinner required ref={c => this.fields.type = c} title="Story Type" storageValue={{selected: new SelectOption(storyType.id, storyType.name)}} onValueChanged={this.onValueChanged("type")} options={this.getStoryTypeOptions()} /> 
                    </PreferenceCategory>
                    <PreferenceCategory title="Optional">
                        <PreferenceText label="Story Points" ref={c => this.fields.points = c} plural={true} title="Story Points" storageValue={{text: storyPoints}} onValueChanged={this.onValueChanged("points")} onValueValidation={this.onValueValidation("points")} />
                    </PreferenceCategory>
                </ScrollView>
                <InputFloatingActionButton icon="save" onPress={this.onFabPress} enabled={this.state.fabEnabled}/>
                <DialogConfirmation concreteRef={i => this.confirmationDialog = i} message="There are unsaved changes to the user story. Are you sure you want to go back and discard your unsaved changes?" title="Unsaved Changes" onActionClickListener={this.onDialogConfirmed} textPositive="Discard" textNegative="Cancel" />
            </View> 
        );
    }
} 


const hoc1 = WithReduxSubscription<ScreenStoryCreate, ScreenStoryCreate, Props, ReduxStateProps, {}>(mapStateToProps)(ScreenStoryCreate);
const hoc2 = WithDatabase(hoc1);
const hoc3 = WithDialogContainer(hoc2);
const hoc4 = WithBackButtonInterceptor(hoc3);

export default hoc4;