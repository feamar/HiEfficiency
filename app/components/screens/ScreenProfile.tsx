import React from 'react';
import PreferenceCategory from '../preferences/PreferenceCategory';
import { View } from "react-native";
import {STACK_NAME_TEAMS} from '../routing/Router';
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import WithDialogContainer, { WithDialogContainerProps } from '../../hocs/WithDialogContainer';
import update, { Spec } from '../../../node_modules/immutability-helper';
import WithBackButtonInterceptor, { WithBackButtonInterceptorProps } from '../../hocs/WithBackButtonInterceptor';
import InputFloatingActionButton from "../inputs/InputFloatingActionButton";
import { ReduxState } from '../../redux/ReduxState';
import ReduxUser from '../../dtos/redux/ReduxUser';
import EntitySchemaWeek from '../../dtos/firebase/firestore/entities/EntitySchemaWeek';
import { HiEfficiencyNavigator } from '../routing/RoutingTypes';
import WithLoading, { WithLoadingProps } from '../../hocs/WithLoading';
import WithReduxSubscription from '../../hocs/WithReduxSubscription';
import DocumentUser from '../../dtos/firebase/firestore/documents/DocumentUser';
import PreferenceText from '../preferences/field/PreferenceText';
import PreferenceWeekSchema from '../preferences/field/PreferenceWeekSchema';
import DialogConfirmation, { ConcreteDialogConfirmation, DialogConfirmationActionUnion } from '../dialog/instances/DialogConfirmation';
import { DialogPreferenceText_StorageValue } from '../dialog/preferences/DialogPreferenceText';
import UserUpdate from '../firebase/crud/UserUpdate';
import WithDrawerNavigationInterceptor, { WithDrawerInterceptorFunctions } from '../../hocs/WithDrawerNavigationInterceptor';
import { NavigationRoute } from 'react-navigation';
import Toast from 'react-native-simple-toast';

const styles = {
  content: {padding: 0, height: "100%"}
}

type State =  
{
    user: ReduxUser,
    newData: Spec<DocumentUser, never>,
    fabEnabled: boolean,
    profile: DocumentUser
}

type Props = WithDatabaseProps & WithDialogContainerProps & WithBackButtonInterceptorProps & WithLoadingProps & 
{
  user: ReduxUser,
  navigation: HiEfficiencyNavigator
}

interface SP 
{
  user: ReduxUser
}

const mapStateToProps = (state: ReduxState): SP =>
{
  return {
    user: state.user!,
  }
}

class ScreenProfile extends React.Component<Props, State> implements WithDrawerInterceptorFunctions
{
  static displayName = "Screen Profile";

  private concreteDialogConfirmation?: ConcreteDialogConfirmation;
  private unsavedChanges: boolean = false;

  constructor(props: Props, _?: any)
  {
    super(props);

    var weekSchema: EntitySchemaWeek = props.user.document.data.weekSchema;
    if(weekSchema == undefined)
    {   weekSchema = EntitySchemaWeek.default();}
    var user: ReduxUser = update(props.user, {document: {data: {weekSchema: {$set: weekSchema}}}});

    this.state = {
      user: user,
      newData: {weekSchema: {$set: weekSchema}},
      profile: update(props.user.document.data, {weekSchema: {$set: weekSchema}}),
      fabEnabled: false,
    }

    this.props.setLoading(false);
  }

  
  componentWillReceiveProps = (props: Props) =>
  {
    if(this.state.user != props.user)
    {   this.setState({user: props.user});}
  }

  onTextValueChanged = (field: keyof DocumentUser) => async (value: DialogPreferenceText_StorageValue) =>
  {
    this.unsavedChanges = true;
    const newData = {...this.state.newData, [field]: {$set: value.text}};
    const newProfile = update(this.state.profile, {[field]: {$set: value.text}});
    this.setState({newData: newData, fabEnabled: true, profile: newProfile});
  }

  onWeekSchemaValueChanged = (field: keyof DocumentUser) => async (value: EntitySchemaWeek) =>
  {
    this.unsavedChanges = true;
    const newData = {...this.state.newData, [field]: {$set: value}};
    const newProfile = update(this.state.profile, {[field]: {$set: value}});

    this.setState({newData: newData, fabEnabled: true, profile: newProfile});
  }

  onFabPress = async () =>
  {
    this.setState({fabEnabled: false});
    await this.props.database.inDialog("dialog-updating-profile", this.props.addDialog, this.props.removeDialog, "Updating Profile", async (execute) => 
    {
        const update: UserUpdate = this.props.database.updateUser(this.state.user.document.id!, this.state.user.document.data, this.state.newData);
        const result = await execute(update, false);

        if(result.successful && result.dialogOpened == false)
        {   Toast.show("Successfully updated your profile.", Toast.SHORT);}

        this.unsavedChanges = false;
    });
  }

  onHardwareBackPress = () =>
  {   return this.onSoftwareBackPress();}

  onSoftwareBackPress = () =>
  {
      if(this.unsavedChanges == false || this.concreteDialogConfirmation == undefined)
      {
        this.props.navigation.navigate(STACK_NAME_TEAMS);
        return true;
      }

      const listener = (_: ConcreteDialogConfirmation | undefined, action: DialogConfirmationActionUnion) =>
      {
          switch(action) 
          {
              case "Positive":
                this.props.navigation.navigate(STACK_NAME_TEAMS);
                break;
          }

          if(this.concreteDialogConfirmation)
          {   this.concreteDialogConfirmation.removeOnActionClickedListener(listener);}
      };

      this.concreteDialogConfirmation.addOnActionClickedListener(listener);

      const base = this.concreteDialogConfirmation.base;
      if(base)
      {   base.setVisible(true);}

      return true;
  }

  onDrawerNavigation = (navigationTarget: NavigationRoute) =>
  {
    console.log("On Drawer Navigation for: " + navigationTarget.routeName);
    if(this.unsavedChanges == false || this.concreteDialogConfirmation == undefined)
    {   return false;}

    const onActionListener = (_: ConcreteDialogConfirmation | undefined, action: DialogConfirmationActionUnion) => 
    {
      console.log("onActionListener for: " + navigationTarget.routeName);
      switch(action)
      {
        case "Positive":
          this.props.navigation.navigate(navigationTarget.routeName);
          break;
      }

      if(this.concreteDialogConfirmation)
      {   this.concreteDialogConfirmation.removeOnActionClickedListener(onActionListener)};
    }

    const base = this.concreteDialogConfirmation.base;
    if(base == undefined)
    {   return false;}

    this.concreteDialogConfirmation.addOnActionClickedListener(onActionListener);

    const onCloseListener = () =>
    {
      if(this.concreteDialogConfirmation && this.concreteDialogConfirmation.base)
      {
          this.concreteDialogConfirmation.base.removeOnCloseListener(onCloseListener);
          this.concreteDialogConfirmation.removeOnActionClickedListener(onActionListener);
      }
    }

    base.addOnCloseListener(onCloseListener);
    base.setVisible(true);
    return true;
  }


  render()
  {
    if(this.state.user == undefined)
    {   return null;}

    return (
      <View style={styles.content}>
        <View>
          <PreferenceCategory title="Demographics">
            <PreferenceText title="Nickname" label="Nickname" storageValue={{text: this.state.profile.name}} onValueChanged={this.onTextValueChanged("name")}/>
            <PreferenceText title="Initials" label="Initials" storageValue={{text: this.state.profile.initials}} onValueChanged={this.onTextValueChanged("initials")} />
          </PreferenceCategory>
          <PreferenceCategory title="Job">
            <PreferenceWeekSchema title="Week Schema" storageValue={this.state.profile.weekSchema} onValueChanged={this.onWeekSchemaValueChanged("weekSchema")} />
          </PreferenceCategory> 
        </View>
        <InputFloatingActionButton enabled={this.state.fabEnabled} icon="save" onPress={this.onFabPress}  />
        <DialogConfirmation concreteRef={i => this.concreteDialogConfirmation = i} title="Unsaved Changes" textPositive="Discard" message="There are unsaved changes to the profile. Are you sure you want to go back and discard your unsaved changes?"  />
      </View>
    ); 
  }
}

const hoc1 = WithReduxSubscription<ScreenProfile, ScreenProfile, Props, SP, {}>(mapStateToProps, undefined)(ScreenProfile);
const hoc2 = WithDatabase(hoc1);
const hoc3 = WithDialogContainer(hoc2);
const hoc4 = WithBackButtonInterceptor(hoc3);
const hoc5 = WithDrawerNavigationInterceptor(hoc4);
const hoc6 = WithLoading(hoc5);

export default hoc6;
