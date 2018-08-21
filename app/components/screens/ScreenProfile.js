import React, {Component} from 'react';
import PreferenceCategory from '../preferences/PreferenceCategory';
import PreferenceText from '../preferences/fields/PreferenceText';
import { View } from "react-native";
import { getUsers, hookIntoUserSignin } from "../firebase/FirebaseAdapter";
import PreferenceMultiSelect from '../preferences/fields/PreferenceMultiSelect';
import {STACK_NAME_AUTH} from '../routing/Router';
import PreferenceWeekSchema from '../preferences/fields/PreferenceWeekSchema';

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
    this.signInUnsubscriber = hookIntoUserSignin((user) => {
      getUsers().doc(user.uid).get().then((doc) => {
        this.setState({loading: false, user:{uid: user.uid, name:doc.data().name, initials: doc.data().initials}});
      })
      .catch((error) => {
        console.log("Signed up user does not have a profile for user id: " + user.uid + ": " + JSON.stringify(error) + ".");
        this.props.navigation.navigate(STACK_NAME_AUTH);
      });
    }, 
    () => {
      //Should we redirect to auth?
      console.log("User is not signed in.");
    }); 
  }


  
  handleInputChange = name => value =>
  {
    this.setState({[name]: value});
  } 


  onValueChanged = field => value => 
  {
    this.setState({user:{...this.state.user, [field]: value}}, () => {
      var update = {[field]: this.state.user[field]};

      getUsers().doc(this.state.user.uid).update(update)
      .catch((error) => console.log("Error: " + JSON.stringify(JSON.decycle(error))));
    });
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
    return (
      <View style={styles.content}>
        {this.state.loading == false &&  
          <View>
            <PreferenceCategory title="Demographics">
              <PreferenceText title="Nickname" value={this.state.user.name} onValueChanged={this.onValueChanged("name")}/>
              <PreferenceText title="Initials" value={this.state.user.initials} onValueChanged={this.onValueChanged("initials")} />
            </PreferenceCategory>
            <PreferenceCategory title="Job">
              <PreferenceWeekSchema title="Week Schema" storageValue={this.getDefaultSchema()} onValueChanged={this.onValueChanged("weekSchema")} />
            </PreferenceCategory> 
          </View>
        }  
      </View>
    ); 
  }
}