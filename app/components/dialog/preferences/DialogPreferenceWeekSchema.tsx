import React  from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Checkbox, Text} from 'react-native-paper';
import AbstractPreferenceDialog, { AbstractPreferenceDialog_Props_Virtual } from './AbstractPreferenceDialog';
import EntitySchemaWeek from '../../../dtos/firebase/firestore/entities/EntitySchemaWeek';
import EntitySchemaDay from '../../../dtos/firebase/firestore/entities/EntitySchemaDay';
import InputTimeRange from '../../inputs/InputTimeRange';
import UtilityTime from '../../../utilities/UtilityTime';
import UtilityNumber from '../../../utilities/UtilityNumber';
import InputError from '../../inputs/InputError';
import { Baseable, onBaseReference } from '../../../render_props/Baseable';

export const VALUE_SEPARATOR = "|";

const styles = StyleSheet.create({
    item: {
        paddingTop: 3,
        paddingBottom: 3,
    },
    title: {
        fontWeight: "bold",
        paddingTop: 9,

    },
    wrapper:
    {
        width: "100%",
        paddingLeft: 25,
        paddingRight: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    checkbox:
    {
        flex: 2,
        marginLeft: 10,
        marginRight: 10
    },
    contentWrapper:
    {
        flex: 1,
        marginRight: 40
    },
});


type Props = AbstractPreferenceDialog_Props_Virtual<EntitySchemaWeek> & 
{

}

interface State
{

}

export default class DialogPreferenceWeekSchema extends React.Component<Props, State> implements Baseable<AbstractPreferenceDialog<EntitySchemaWeek>>
{
    //This is REALLY messy, but needed during TypeScript conversion. Change when localization comes into play.
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    public base: AbstractPreferenceDialog<EntitySchemaWeek> | undefined;

    constructor(props: Props) 
    {
        super(props);

        this.state = 
        {
        }
    }

    onCheckboxPress = (index: number) => () => 
    {
        if(this.base)
        {
            const field: keyof EntitySchemaWeek | undefined = EntitySchemaWeek.getPropertyByIndex(index);
            if(field != undefined)
            {
                const sv = this.base.getCurrentStorageValue();
                if(sv == null)
                {   return;}

                const day: EntitySchemaDay = sv[field] as EntitySchemaDay;
                this.base.onValueChange({[field]: {enabled: {$set: !day.enabled}}});
            }
        }
    }

    onValueValidation = (storageValue: EntitySchemaWeek): string | undefined =>
    {
        const array = storageValue.toArray();
        var error: string | undefined;
        array.forEach(day => 
        {
            if(this.isBefore(day.end, day.start))
            {   error = "Please make sure the end of your workday is after the start of your workday."}
        });

        return error;
    }

    isBefore = (t1: string, t2: string) => {
        var split1 = t1.split(":");
        var split2 = t2.split(":");

        if (split1[0] < split2[0]) 
        {   return true;}

        if (split1[0] > split2[0]) 
        {   return false;}

        if (split1[1] < split2[1]) 
        {   return true;}

        return false;
    }

    getInnerWrapperStyle = (index: number) => 
    {
        var style: ViewStyle = 
        {
            paddingTop: 10,
            paddingBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%"
        };

        if (this.isEnabled(index) == false) 
        {   style["opacity"] = 0.4;}

        return style;
    }

    isEnabled = (index: number) => 
    {   
        const value = this.getCurrentStorageValue();
        if(value == null)
        {   return false;}

        return value.getByIndex(index).enabled;
    }

    getCurrentStorageValue = () =>
    {   
        if(this.base)
        {   return this.base.getCurrentStorageValue();}
        else
        {   return this.props.storageValue;}
    }

    toDisplayValue = (timestamp: Date): string =>
    {
        const hours = UtilityNumber.pad(timestamp.getHours(), 2);
        const minutes = UtilityNumber.pad(timestamp.getMinutes(), 2);

        return hours + ":" + minutes;
    }

    fromDisplayValue = (display: string): Date =>
    {   return UtilityTime.HhmmToDate(display);}

    onRangeChange = (index: number) => (component: "start" | "end", timestamp: Date) =>
    {
        if(this.base == undefined)
        {   return;}

        const display = this.toDisplayValue(timestamp);
        const field = EntitySchemaWeek.getPropertyByIndex(index);

        if(field)
        {   this.base.onValueChange({[field]: {[component]: {$set: display}}});}
    }

    getTimespanFor = (item: EntitySchemaDay, index: number) => {

        //Check whether the current value array contains the current index.
        const enabled = this.isEnabled(index);
        const status = enabled ? "checked" : "unchecked";

        console.log("INDEX: " + index);
        const dayName = this.days[index];
        console.log("DAYNAME: "+ dayName);
        return (
            <View style={styles.item} key={index}>
                <View style={styles.wrapper}>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.title}>{dayName}</Text>
                        <InputTimeRange disabled={enabled == false} onRangeChange={this.onRangeChange(index)} start={UtilityTime.HhmmToDate(item.start)} end={UtilityTime.HhmmToDate(item.end)} />
                    </View>
                    <Checkbox status={status} onPress={this.onCheckboxPress(index)} />
                </View>
            </View>
        );
    }

    getDialogContent = () =>
    {
        const value = this.getCurrentStorageValue() || EntitySchemaWeek.default();

        return (
            <View>
                {value.toArray().map((item, index) => 
                {   return this.getTimespanFor(item, index); })}
                {this.getErrorComponent()}
            </View>
        );
    }

    getErrorComponent = () =>
    {
        if(this.base == undefined)
        {   return null;}

        return <InputError error={this.base.getCurrentError()} />
    }

    render()
    {
        return (
            <AbstractPreferenceDialog ref={onBaseReference(this)} onInternalValueValidation={this.onValueValidation} getDialogContent={this.getDialogContent} {...this.props}/>
        );
    }
}
