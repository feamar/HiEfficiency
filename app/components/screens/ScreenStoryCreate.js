import React, {Component} from "react";
import {View, ScrollView, ToastAndroid, Keyboard} from "react-native";
import PropTypes from "prop-types";
import PreferenceCategory from "../preferences/PreferenceCategory";
import PreferenceText from "../preferences/fields/PreferenceText";
import PreferenceSelectSpinner from "../preferences/fields/PreferenceSelectSpinner";
import StoryType from "../../enums/StoryType";
import FirebaseAdapter from "../firebase/FirebaseAdapter";
import withFloatingActionButton from "../../hocs/WithFloatingActionButton";
import withBackButtonInterceptor from "../../hocs/WithBackButtonInterceptor";
import { FAB, Snackbar } from 'react-native-paper';
import UtilityScreen from "../../utilities/UtilityScreen";
import UtilityObject from "../../utilities/UtilityObject";
import DialogConfirmation, { DIALOG_ACTION_POSITIVE } from "../dialogs/instances/DialogConfirmation";

const styles = {
    scrollView:{
        height: "100%"
    }
}

export const MODE_CREATE = "create";
export const MODE_EDIT = "edit";

class ScreenStoryCreate extends Component
{
    static displayName = "Story Details Information";

    constructor(props)
    {
        super(props);
  
        var story = {
            upvotes: 0,
            startedOn: null,
            finishedOn: null
        }

        const existingStory = props.navigation.getParam("story");
        this.mode = MODE_CREATE;
        if(existingStory) 
        {
            story = existingStory.data();
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

    componentDidMount = () =>
    {   
        this.props.navigation.setParams({onBackClicked: this.onBackClicked});
    }


    setFabVisibility = (visible) =>
    {   this.setState({shouldFabGroupRender: visible});}

    onValueChanged = (field) => (value) =>
    {
        const story = this.state.story;
        if(story[field] == value)
        {   return;}

        this.unsavedChanges = true;
        story[field] = value;
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

    onFabPress = () =>
    {
        var valid = true;
        const keys = Object.keys(this.fields);
        var story = {};

        for(var i = 0 ; i < keys.length ; i++)
        {
            const key = keys[i];
            const field = this.fields[key];

            if(field.validate() == false)
            {   valid = false;}
        }   

        if(valid) 
        {
            var self = this;
            var team = this.props.navigation.getParam("team");

            switch(this.mode)
            { 
                case MODE_CREATE:
                    FirebaseAdapter.getStories(team.id).add(this.state.story).then(() => 
                    {
                        ToastAndroid.show("Story successfully created!", ToastAndroid.LONG);
                        this.props.navigation.goBack();
                    })
                    .catch(error => 
                    {
                        ToastAndroid.show("Something went wrong while saving, please try again.", ToastAndroid.LONG);
                    });
                    break;

                case MODE_EDIT:
                    this.props.navigation.getParam("story").ref.update(this.state.story).then(() => 
                    {
                        ToastAndroid.show("Story successfully updated!", ToastAndroid.LONG);
                    })
                    .catch(error => 
                    {
                        ToastAndroid.show("Something went wrong while saving, please try again.", ToastAndroid.LONG);
                    });;
                    break;
            }
        }
    }

    getStoryTypeOptions = () =>
    {   return StoryType.Values.map(type => {return {value: type.name, storageValue: type.id}});}

    onDialogConfirmed = (action) =>
    {
        if(action == DIALOG_ACTION_POSITIVE)
        {   this.props.navigation.goBack();}
    }

    render()
    { 
        return ( 
            <View style={{height: "100%"}}> 
                <ScrollView style={styles.scrollView}>
                    <PreferenceCategory title="Mandatory">
                        <PreferenceText required ref={c => this.fields.name = c} title="Name" storageValue={this.state.story.name} onValueChanged={this.onValueChanged("name")} />
                        <PreferenceText ref={c => this.fields.description = c} title="Description" storageValue={this.state.story.description} onValueChanged={this.onValueChanged("description")} multiline={true} numberOfLines={5} />
                        <PreferenceSelectSpinner required ref={c => this.fields.type = c} title="Story Type" storageValue={this.state.story.type} onValueChanged={this.onValueChanged("type")} options={this.getStoryTypeOptions()} getDisplayValueFromItem={storageValue => { return StoryType.fromId(storageValue).name}}/> 
                    </PreferenceCategory>
                    <PreferenceCategory title="Optional">
                        <PreferenceText ref={c => this.fields.points = c} title="Story Points" storageValue={this.state.story.points} onValueChanged={this.onValueChanged("points")} onValueValidation={this.onValueValidation("points")} />
                    </PreferenceCategory>
                </ScrollView>
                {this.state.shouldFabGroupRender && <FAB.Group icon="save" color="white" open={false} onPress={this.onFabPress} actions={[]} onStateChange={(open) => {} } />}
                <DialogConfirmation ref={i => this.confirmationDialog = i} message="There are unsaved changes to the user story. Are you sure you want to go back and discard your unsaved changes?" title="Unsaved Changes" onDialogActionPressed={this.onDialogConfirmed} textPositive="Discard" textNegative="Cancel" />
            </View> 
        );
    }
} 



export default withBackButtonInterceptor(ScreenStoryCreate);