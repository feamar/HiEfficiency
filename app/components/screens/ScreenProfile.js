import React, {Component} from 'react';
import PreferenceCategory from '../preferences/PreferenceCategory';
import PreferenceText from '../preferences/fields/PreferenceText';
import { View } from "react-native";
import PreferenceMultiSelect from '../preferences/fields/PreferenceMultiSelect';
import {STACK_NAME_AUTH} from '../routing/Router';
import PreferenceWeekSchema from '../preferences/fields/PreferenceWeekSchema';
import PreferenceSelectSpinner from '../preferences/fields/PreferenceSelectSpinner';
import {connect} from "react-redux";
import WithReduxListener from '../../hocs/WithReduxListener';
import UtilityObject from '../../utilities/UtilityObject';
import WithDatabase from "../../hocs/WithDatabase";
import ResolveType from '../../enums/ResolveType';

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

    this.state = {
      user: props.user
    }

    this.props.setLoading(false);
  }

  onReduxStateChanged = (props) =>
  {
    if(this.state.user != props.user)
    {   this.setState({user: props.user});}
  }

  onValueChanged = field => async value => 
  {   
    var data = {[field]: value};
    if(this.state.user.data.weekSchema == undefined && field != "weekSchema")
    {   data = {...data, weekSchema: this.getDefaultSchema()};}

    await this.props.database.updateUser(this.state.user.uid, {[field]: value}, ResolveType.NONE, ResolveType.TOAST);
  }

  getDefaultSchema = () => {
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

  render()
  {
    if(this.state.user == undefined)
    {   return null;}

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
      </View>
    ); 
  }
}

export default WithReduxListener(mapStateToProps, undefined, WithDatabase(ScreenProfile));
