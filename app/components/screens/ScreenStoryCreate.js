import React, {Component} from "react";
import {View, ScrollView, ToastAndroid, Keyboard} from "react-native";
import PropTypes from "prop-types";
import PreferenceCategory from "../preferences/PreferenceCategory";
import PreferenceText from "../preferences/fields/PreferenceText";
import PreferenceSelectSpinner from "../preferences/fields/PreferenceSelectSpinner";
import StoryType from "../../enums/StoryType";
import WithBackButtonInterceptor from "../../hocs/WithBackButtonInterceptor";
import { FAB, Snackbar } from 'react-native-paper';
import UtilityObject from "../../utilities/UtilityObject";
import DialogConfirmation from "../dialogs/instances/DialogConfirmation";
import ActionType from "../../enums/ActionType";
import Router, { SCREEN_NAME_STORY_DETAILS_INFO } from "../routing/Router";
import update from "immutability-helper";
import {connect} from "react-redux";
import WithDatabase from "../../hocs/WithDatabase";
import ResolveType from "../../enums/ResolveType";
import WithDialogContainer from "../../hocs/WithDialogContainer";
import UtilityUpdate from "../../utilities/UtilityUpdate";

const styles = {
    scrollView:{
        height: "100%"
    }
}

export const MODE_CREATE = "create";
export const MODE_EDIT = "edit";

const mapStateToProps = (state, props)  =>
{
    return {
        inspecting: state.inspecting
    }
}

class ScreenStoryCreate extends Component
{
    static displayName = "Story Details Information";

    constructor(props)
    {
        super(props);
  
        var story = {
            upvotes: 0,
            startedOn: null,
            finishedOn: null,
            createdOn: new Date()
        }

        const existingStory = props.navigation.getParam("story");
        this.mode = MODE_CREATE;
        if(existingStory) 
        {
            story = existingStory.data;
            this.mode = MODE_EDIT;
        }

        this.unsavedChanges = false;
        this.fields = {};
        this.unsubscribers = []
        this.state =
        {
            story: story,
            shouldFabGroupRender: true
        }
    }

    onHardwareBackPress = () =>
    {   return this.onSoftwareBackPress();}

    onSoftwareBackPress = () =>
    {
        if(this.unsavedChanges == false || this.confirmationDialog == undefined)
        {   return false;}

        this.confirmationDialog.setVisible(true);
        return true;
    }

    setFabVisibility = (visible) =>
    {   this.setState({shouldFabGroupRender: visible});}

    onValueChanged = (field) => (value) =>
    {
        var story = this.state.story;
        if(story[field] == value)
        {   return;}

        this.unsavedChanges = true;
        story = update(story, {[field]: {$set: value}});
        this.setState({story: story});
    }

    onValueValidation = (field) => (value) =>
    {
        switch(field)
        {
            case "points":
                if(value % 1 != 0)
                {   return "Please enter an integer value.";}
            break;
        }

        return undefined;
    }

    onFabPress = async () =>
    {
        var valid = true;
        const keys = Object.keys(this.fields);

        for(var i = 0 ; i < keys.length ; i++)
        {
            const key = keys[i];
            const field = this.fields[key];

            if(field.validate() == false)
            {   valid = false;}
        }   

        if(valid) 
        {
            const teamId = this.props.inspecting.team;

            switch(this.mode)
            { 
                case MODE_CREATE:
                    console.log("MODE_CREATE");

                    await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Creating Story", async (execute) => 
                    {
                        const crud = this.props.database.createStory(teamId, this.state.story);
                        crud.setOnDialogClosedListener(() => 
                        {   this.props.navigation.goBack();});
                        await execute(crud);
                    });

                    break;

                case MODE_EDIT:
                    console.log("EDIT");
                    const old = this.props.navigation.getParam("story");
                    const updates = UtilityUpdate.getUpdatesFromShallowObject(this.state.story);
                    
                    await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Updating Story", async (execute) => 
                    {
                        const update = this.props.database.updateStory(teamId, old.id, old.data, updates);
                        await execute(update);
                    });
                    this.unsavedChanges = false;
                    break;
            }
        }
    }

    getStoryTypeOptions = () =>
    {   return StoryType.Values.map(type => {return {value: type.name, storageValue: type.id}});}

    onDialogConfirmed = (action) =>
    {
        if(action == ActionType.POSITIVE)
        {
            this.unsavedChanges = false; 

            //If the screen is encapsulated in a tab navigator, we'll need to perform the navigation event on the parent tab navigator.
            if(this.props.navigation.state.key == SCREEN_NAME_STORY_DETAILS_INFO)
            {
                const parent = this.props.navigation.dangerouslyGetParent();
                parent.goBack();
            }
            else  
            {   this.props.navigation.goBack();}
        }
    }

    render()
    { 
        return ( 
            <View style={{height: "100%"}}> 
                <ScrollView style={styles.scrollView}>
                    <PreferenceCategory title="Mandatory">
                        <PreferenceText required ref={c => this.fields.name = c} title="Name" storageValue={this.state.story.name} onValueChanged={this.onValueChanged("name")} />
                        <PreferenceText ref={c => this.fields.description = c} title="Description" storageValue={this.state.story.description} onValueChanged={this.onValueChanged("description")} multiline={true} numberOfLines={5} />
                        <PreferenceSelectSpinner required ref={c => this.fields.type = c} title="Story Type" storageValue={this.state.story.type} onValueChanged={this.onValueChanged("type")} options={this.getStoryTypeOptions()} getDisplayValueFromItem={storageValue =>StoryType.fromId(storageValue).name}/> 
                    </PreferenceCategory>
                    <PreferenceCategory title="Optional">
                        <PreferenceText ref={c => this.fields.points = c} plural={true} title="Story Points" storageValue={this.state.story.points} onValueChanged={this.onValueChanged("points")} onValueValidation={this.onValueValidation("points")} />
                    </PreferenceCategory>
                </ScrollView>
                {this.state.shouldFabGroupRender && <FAB.Group icon="save" color="white" open={false} onPress={this.onFabPress} actions={[]} onStateChange={(open) => {} } />}
                <DialogConfirmation ref={i => this.confirmationDialog = i} message="There are unsaved changes to the user story. Are you sure you want to go back and discard your unsaved changes?" title="Unsaved Changes" onDialogActionPressed={this.onDialogConfirmed} textPositive="Discard" textNegative="Cancel" />
            </View> 
        );
    }
} 


const hoc1 = WithDatabase(ScreenStoryCreate);
const hoc2 = WithDialogContainer(hoc1);
const hoc3 = WithBackButtonInterceptor(hoc2);

export default connect(mapStateToProps)(hoc3);