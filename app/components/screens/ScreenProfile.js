import React, {Component} from 'react';
import PreferenceCategory from '../preferences/PreferenceCategory';
import PreferenceText from '../preferences/fields/PreferenceText';
import { View } from "react-native";
import { getUsers, hookIntoUserSignin, signOut } from "../firebase/FirebaseAdapter";
import PreferenceMultiSelect from '../preferences/fields/PreferenceMultiSelect';
import {STACK_NAME_AUTH} from '../routing/Router';
import PreferenceWeekSchema from '../preferences/fields/PreferenceWeekSchema';
import PreferenceSelectSpinner from '../preferences/fields/PreferenceSelectSpinner';

const styles ={
  content: {padding: 0}
}

export default class ScreenProfile extends Component
{
  constructor()
  {
    super();

    this.state ={
      loading: true,
      user: {}
    }
    
    this.unsubscribers = [];
  }

  componentWillMount = () =>
  {
    var unsubscriber = hookIntoUserSignin(this.onUserAvailableWhileMounting, this.onUserUnavailableWhileMounting);
    this.unsubscribers.push(unsubscriber);
  }

  onUserAvailableWhileMounting = (user) =>
  {
    getUsers().doc(user.uid).get().then((doc) => 
    {
      doc.ref.onSnapshot(this.onUserDocumentChanged);
      this.onUserDocumentChanged(doc);
    })
    .catch((error) => 
    {
      console.log("Signed up user does not have a profile for user id: " + user.uid + ": " + JSON.stringify(error) + ".");
      this.props.navigation.navigate(STACK_NAME_AUTH);
    });
  }

  onUserUnavailableWhileMounting = () =>
  {   signOut();}

  componentWillUnmount = () =>
  {
    for(var i = 0 ; i < this.unsubscribers.length; i ++)
    {
      const unsubscriber = this.unsubscribers[i];
      unsubscriber();
    }
  }

  onUserDocumentChanged = (user) =>
  {
    if(user.data().weekSchema == undefined)
    {
      user.ref.update({weekSchema: this.getDefaultSchema()}).then(() => 
      { this.setState({user:user, loading: false});});
    } 
    else
    { this.setState({user:user, loading: false});}
  }

  onValueChanged = field => value => 
  {
    this.state.user.ref.update({[field]: value});
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
    const data = this.state.loading ? null : this.state.user.data();
    return (
      <View style={styles.content}>
        {this.state.loading == false &&  
          <View>
            <PreferenceCategory title="Demographics">
              <PreferenceText title="Nickname" storageValue={data.name} onValueChanged={this.onValueChanged("name")}/>
              <PreferenceText title="Initials" storageValue={data.initials} onValueChanged={this.onValueChanged("initials")} />
            </PreferenceCategory>
            <PreferenceCategory title="Job">
              <PreferenceWeekSchema title="Week Schema" storageValue={data.weekSchema} onValueChanged={this.onValueChanged("weekSchema")} />
            </PreferenceCategory> 
          </View>
        }  
      </View>
    ); 
  }
}