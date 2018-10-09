import React from 'react';
import PreferenceCategory from '../preferences/PreferenceCategory';
import { ToastAndroid, View } from "react-native";
import {STACK_NAME_TEAMS} from '../routing/Router';
import UtilityObject from '../../utilities/UtilityObject';
import WithDatabase, { WithDatabaseProps } from "../../hocs/WithDatabase";
import WithDialogContainer, { WithDialogContainerProps, WithDialogContainerState } from '../../hocs/WithDialogContainer';
import update, { Spec } from '../../../node_modules/immutability-helper';
import WithBackButtonInterceptor, { WithBackButtonInterceptorProps } from '../../hocs/WithBackButtonInterceptor';
import InputFloatingActionButton from "../inputs/InputFloatingActionButton";
import { ReduxState } from '../../redux/ReduxState';
import ReduxUser from '../../dtos/redux/ReduxUser';
import EntitySchemaWeek from '../../dtos/firebase/firestore/entities/EntitySchemaWeek';
import { HiEfficiencyNavigator } from '../routing/RoutingTypes';
import { WithLoadingProps } from '../../hocs/WithLoading';
import WithReduxSubscription from '../../hocs/WithReduxSubscription';
import DocumentUser from '../../dtos/firebase/firestore/documents/DocumentUser';
import PreferenceText from '../preferences/field/PreferenceText';
import PreferenceWeekSchema from '../preferences/field/PreferenceWeekSchema';
import DialogConfirmation, { ConcreteDialogConfirmation, DialogConfirmationActionUnion } from '../dialog/instances/DialogConfirmation';
import { DialogPreferenceText_StorageValue } from '../dialog/preferences/DialogPreferenceText';
import UserUpdate from '../firebase/crud/UserUpdate';

const styles = {
  content: {padding: 0, height: "100%"}
}

type State = WithDialogContainerState & 
{
    user: ReduxUser,
    newData: Spec<DocumentUser, never>,
    fabEnabled: boolean,
    
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

class ScreenProfile extends React.Component<Props, State>
{
  static displayName = "Screen Profile";

  private dialogConfirmation?: ConcreteDialogConfirmation;
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
      fabEnabled: true,
      dialogs: []
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

    this.setState({newData: newData});
  }

  onWeekSchemaValueChanged = (field: keyof DocumentUser) => async (value: EntitySchemaWeek) =>
  {
    this.unsavedChanges = true;
    const newData = {...this.state.newData, [field]: {$set: value}};

    this.setState({newData: newData});
  }

  onFabPress = async () =>
  {
    this.setState({fabEnabled: false});
    await this.props.database.inDialog(this.props.addDialog, this.props.removeDialog, "Updating Profile", async (execute) => 
    {
        const update: UserUpdate = this.props.database.updateUser(this.state.user.document.id!, this.state.user.document.data, this.state.newData);
        const result = await execute(update, false);

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
      if(this.unsavedChanges == false || this.dialogConfirmation == undefined)
      {
        this.props.navigation.navigate(STACK_NAME_TEAMS);
        return true;
      }

      const base = this.dialogConfirmation.base;
      if(base)
      {   base.setVisible(true);}

      return true;
  }

  onDialogConfirmed = (_: ConcreteDialogConfirmation | undefined, action: DialogConfirmationActionUnion) =>
  {
      switch(action) 
      {
          case "Positive":
            this.props.navigation.navigate(STACK_NAME_TEAMS);
            break;
      }
  }

  render()
  {
    if(this.state.user == undefined)
    {   return null;}

    return (
      <View style={styles.content}>
        <View>
          <PreferenceCategory title="Demographics">
            <PreferenceText title="Nickname" label="Nickname" storageValue={{text: this.state.user.document.data.name}} onValueChanged={this.onTextValueChanged("name")}/>
            <PreferenceText title="Initials" label="Initials" storageValue={{text: this.state.user.document.data.initials}} onValueChanged={this.onTextValueChanged("initials")} />
          </PreferenceCategory>
          <PreferenceCategory title="Job">
            <PreferenceWeekSchema title="Week Schema" storageValue={this.state.user.document.data.weekSchema} onValueChanged={this.onWeekSchemaValueChanged("weekSchema")} />
          </PreferenceCategory> 
        </View>
        <InputFloatingActionButton enabled={this.state.fabEnabled} icon="save" onPress={this.onFabPress}  />
        <DialogConfirmation concreteRef={i => this.dialogConfirmation = i} title="Unsaved Changes" onActionClickListener={this.onDialogConfirmed} textPositive="Discard" message="There are unsaved changes to the profile. Are you sure you want to go back and discard your unsaved changes?"  />
        {this.state.dialogs.map(dialog => dialog)}
      </View>
    ); 
  }
}

const hoc1 = WithReduxSubscription<ScreenProfile, ScreenProfile, Props, SP, {}>(mapStateToProps, undefined)(ScreenProfile);
const hoc2 = WithDatabase(hoc1);
const hoc3 = WithDialogContainer(hoc2);
const hoc4 = WithBackButtonInterceptor(hoc3);

export default hoc4;
