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
import UtilityObject from '../../../utilities/UtilityObject';

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
        console.log("onCheckboxPress!");
        if(this.base)
        {

            const field: keyof EntitySchemaWeek | undefined = EntitySchemaWeek.getPropertyByIndex(index);
            console.log("onCheckboxPress 1: field");    
            if(field != undefined)
            {
                const sv = this.base.getCurrentStorageValue();
                console.log("onCheckboxPress 2: " + sv);    

                if(sv == null)
                {   return;}

                //Ugly, ugly hack to work around reference issues.
                switch(index)
                {
                    case 0: sv.monday.enabled = !sv.monday.enabled;
                    case 1: sv.tuesday.enabled = !sv.tuesday.enabled;
                    case 2: sv.wednesday.enabled = !sv.wednesday.enabled;
                    case 3: sv.thursday.enabled = !sv.thursday.enabled;
                    case 4: sv.friday.enabled = !sv.friday.enabled;
                    case 5: sv.saturday.enabled = !sv.saturday.enabled;
                    case 6: sv.sunday.enabled = !sv.sunday.enabled;
                }

                this.base.setStorageValue(sv);
            }
        }
    }

    onValueValidation = (storageValue: EntitySchemaWeek): string | undefined =>
    {
        var error: string | undefined;
        console.log("ON VALUE VALIDATRION INTERNAL: " + UtilityObject.stringify(storageValue));

        storageValue.forEachDay((day, _index) => 
        {
            console.log("START " + day.start + " AND END: " + day.end);
            if(this.isBefore(day.end, day.start))
            {   error = "Please make sure the end of your workday is after the start of your workday."}
        });
        console.log("ON VALUE VALIDATRION INTERNAL: " + error);

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

        const day = value.getByIndex(index);
        if(day == undefined)
        {   return false;}

        return day.enabled;
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
        console.log("onRangeChange: " + this.base);
        if(this.base == undefined)
        {   return;}

        console.log("onRangechange: " + component + ": " + timestamp.getHours() + ":" + timestamp.getMinutes());

        const display = this.toDisplayValue(timestamp);
        const field = EntitySchemaWeek.getPropertyByIndex(index);

        console.log("INdex: " + index + " AND " + field);
        if(field)
        {   
            const sv = this.base.getCurrentStorageValue() || EntitySchemaWeek.default();

            //Ugly, ugly hack to work around reference issues.
            if(component == "start")
            {
                switch(index)
                {
                    case 0: sv.monday.start = display;
                    case 1: sv.tuesday.start = display;
                    case 2: sv.wednesday.start = display;
                    case 3: sv.thursday.start = display;
                    case 4: sv.friday.start = display;
                    case 5: sv.saturday.start = display;
                    case 6: sv.sunday.start = display;
                }
            }
            else
            {
                switch(index)
                {
                    case 0: sv.monday.end = display;
                    case 1: sv.tuesday.end = display;
                    case 2: sv.wednesday.end = display;
                    case 3: sv.thursday.end = display;
                    case 4: sv.friday.end = display;
                    case 5: sv.saturday.end = display;
                    case 6: sv.sunday.end = display;
                }
            }
            
            this.base.setStorageValue(sv);
        }
    }

    getTimespanFor = (item: EntitySchemaDay, index: number) => {

        //Check whether the current value array contains the current index.
        const enabled = this.isEnabled(index);
        const status = enabled ? "checked" : "unchecked";
        console.log("STATUS: " + index + ": " + status);
        const dayName = this.days[index];
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

    getDialogContent = (storageValue: EntitySchemaWeek, error: string | undefined) =>
    {
        const timespans = storageValue.forEachDay(this.getTimespanFor);
        return (
            <View>
                {timespans}
                <InputError margin={true} error={error} />
            </View>
        );
    }

    render()
    {
        return (
            <AbstractPreferenceDialog ref={onBaseReference(this)} onInternalValueValidation={this.onValueValidation} getDialogContent={this.getDialogContent} {...this.props}/>
        );
    }
}
