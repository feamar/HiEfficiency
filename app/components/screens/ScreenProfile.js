import React, {Component} from 'react';
import PreferenceCategory from '../preferences/PreferenceCategory';
import PreferenceText from '../preferences/fields/PreferenceText';
import { ToastAndroid, View } from "react-native";
import PreferenceMultiSelect from '../preferences/fields/PreferenceMultiSelect';
import {STACK_NAME_AUTH, STACK_NAME_TEAMS} from '../routing/Router';
import PreferenceWeekSchema from '../preferences/fields/PreferenceWeekSchema';
import PreferenceSelectSpinner from '../preferences/fields/PreferenceSelectSpinner';
import {connect} from "react-redux";
import WithReduxListener from '../../hocs/WithReduxListener';
import UtilityObject from '../../utilities/UtilityObject';
import UtilityAsync from '../../utilities/UtilityAsync';
import WithDatabase from "../../hocs/WithDatabase";
import ResolveType from '../../enums/ResolveType';
import WithDialogContainer from '../../hocs/WithDialogContainer';
import update from '../../../node_modules/immutability-helper';
import WithBackButtonInterceptor from '../../hocs/WithBackButtonInterceptor';
import {FAB} from "react-native-paper";
import DialogConfirmation from "../dialogs/instances/DialogConfirmation";
import ActionType from '../../enums/ActionType';
import InputFloatingActionButton from "../inputs/InputFloatingActionButton";

const styles ={
  content: {padding: 0, height: "100%"}
}

const mapStateToProps = (state, props) =>
{
  return {
    user: state.user
  }
}

class ScreenProfile extends Component
{
  static displayName = "Screen Profile";
  constructor(props)
  {
    super(props);

    var weekSchema = props.user.data.weekSchema;
    if(weekSchema == undefined)
    {   weekSchema = ScreenProfile.getDefaultSchema();}
    var user = update(props.user, {data: {weekSchema: {$set: weekSchema}}});

    this.state = {
      user: user,
      newData: {weekSchema: {$set: weekSchema}},
      fabEnabled: true
    }


    this.unsavedChanges = false;
    this.props.setLoading(false);
  }

  onReduxStateChanged = (props) =>
  {
    if(this.state.user != props.user)
    {   this.setState({user: props.user});}
  }

  onValueChanged = field => async value => 
  {   
    this.unsavedChanges = true;
    var data = {...this.state.newData};
    data[field] = {$set: value};

    this.setState({newData: data});
  }

  static getDefaultSchema = () => {
    return [
      {enabled: true, 0: "09:00", 1: "17:00"}, 
      {enabled: true, 0: "09:00", 1: "17:00"}, 
      {enabled: true, 0: "09:00", 1: "17:00"}, 
      {enabled: true, 0: "09:00", 1: "17:00"}, 
      {enabled: true, 0: "09:00", 1: "17:00"}, 
      {enabled: false, 0: "09:00", 1: "17:00"}, 
      {enabled: false, 0: "09:00", 1: "17:00"},  
    ]; 
  }

  onFabPress = async () =>
  {
    this.setState({fabEnabled: false});
    await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Updating Profile", async (execute) => 
    {
        //console.log("UPDATES: " + UtilityObject.stringify(this.state.newData));
        const update = this.props.database.updateUser(this.state.user.uid, this.state.user.data, this.state.newData);
        const result = await execute(update);

        console.log("RESULT: " + UtilityObject.stringify(result));
        if(result.successful && result.dialogOpened == false)
        {   ToastAndroid.show("Successfully updated your profile.", ToastAndroid.SHORT);}

        this.setState({fabEnabled: true});
        this.unsavedChanges = false;
    });
  }

  onHardwareBackPress = () =>
  {   return this.onSoftwareBackPress();}

  onSoftwareBackPress = () =>
  {
      if(this.unsavedChanges == false || this.confirmationDialog == undefined)
      {
        this.props.navigation.navigate(STACK_NAME_TEAMS);
        return true;
      }

      this.confirmationDialog.setVisible(true);
      return true;
  }

  onDialogConfirmed = (action) =>
  {
      switch(action) 
      {
          case ActionType.POSITIVE:
            this.props.navigation.navigate(STACK_NAME_TEAMS);
            break;
      }
  }

  render()
  {
    console.log("Renderrriiing");
    if(this.state.user == undefined)
    {   return null;}
    console.log("Renderrriiing 1");

    return (
      <View style={styles.content}>
        <View>
          <PreferenceCategory title="Demographics">
            <PreferenceText title="Nickname" storageValue={this.state.user.data.name} onValueChanged={this.onValueChanged("name")}/>
            <PreferenceText title="Initials" storageValue={this.state.user.data.initials} onValueChanged={this.onValueChanged("initials")} />
          </PreferenceCategory>
          <PreferenceCategory title="Job">
            <PreferenceWeekSchema title="Week Schema" storageValue={this.state.user.data.weekSchema} onValueChanged={this.onValueChanged("weekSchema")} />
          </PreferenceCategory> 
        </View>
        <InputFloatingActionButton enabled={this.state.fabEnabled} icon="save" onPress={this.onFabPress}  />
        <DialogConfirmation ref={i => this.confirmationDialog = i} message="There are unsaved changes to the profile. Are you sure you want to go back and discard your unsaved changes?" title="Unsaved Changes" onDialogActionPressed={this.onDialogConfirmed} textPositive="Discard" textNegative="Cancel" />
      </View>
    ); 
  }
}

const hoc1 = WithDatabase(ScreenProfile);
const hoc2 = WithDialogContainer(hoc1);
const hoc3 = WithBackButtonInterceptor(hoc2);
const hoc4 = WithReduxListener(mapStateToProps, undefined, hoc3);

export default hoc4;
