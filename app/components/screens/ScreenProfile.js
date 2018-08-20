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

//<PreferenceMultiSelect title="Workdays" storageValue={[0, 1, 5]} onValueChanged={this.onValueChanged("workdays")} options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]} />


/*import React from "react";
import { View } from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { signOut, getUsers, getTeams, hookIntoUserSignin } from "../firebase/FirebaseAdapter";

import { styles } from "../../styles/Styles";

export default class ScreenProfile extends React.Component {
  constructor(props) {
    super(props);
    this.signOutAndRedirect = this.signOutAndRedirect.bind(this);
    this.state = {
      name: undefined,
      initials: undefined,
      teams: []
    }
  }

  signOutAndRedirect = () => {
    signOut().then(() => this.props.navigation.navigate("SignedOut"));
  }

  displayUserProfileData = (user) => {
    let _this = this;
    getUsers().doc(user.uid).get().then(function(doc) {
        if (doc.exists) {
            // Map teams identifiers to documents
            _this.setState({name: doc.data().name, initials: doc.data().initials, teams: doc.data().teams});
        } else {
            console.log("Signed up user does not have a profile for user id: " + user.id);
        }
    }).catch(function(error) {
        console.log("Error getting user profile:", error);
    });
  }

  componentDidMount() {
    this.signInUnsubscriber = hookIntoUserSignin(this.displayUserProfileData, this.signOutAndRedirect);
  }

  componentWillUnmount() {
    if(this.signInUnsubscriber)
    { this.signInUnsubscriber();}
  }

  render() {
    return (
      <View style={{ paddingVertical: 20 }}>
        <Card title={this.state.name}>
          <View
            style={{
              backgroundColor: "#bcbec1",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: 40,
              alignSelf: "center",
              marginBottom: 20
            }}
          >
            <Text style={{ color: "white", fontSize: 28 }}>{this.state.initials}</Text>
          </View>
          <Button
            style={styles.profile}
            title="SIGN OUT"
            onPress={() => signOut().then(() => this.props.navigation.navigate("SignedOut"))}
          />
        </Card>
      </View>
    );
  }
}
*/