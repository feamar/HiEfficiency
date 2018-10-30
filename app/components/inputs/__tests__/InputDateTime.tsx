import React from "react";
import renderer from "react-test-renderer";
import InputDateTime from "../InputDateTime";
import UtilityTest from "../../../utilities/UtilityTest";


beforeAll(() => 
{
    jest.mock('Platform', () => {
        const Platform = require('Platform');
        Platform.OS = 'android';
        return Platform;
    });
});

describe("An InputDateTime", () => 
{
    const timestamp = new Date(1514761200000); //2018-01-01
    const onSelectedMock = jest.fn();
  
    let component = renderer.create(<InputDateTime mode="date" timestamp={timestamp} onSelected={onSelectedMock} />);
    let tree = component.toJSON();
    let instance = component.getInstance();

    test("Opening the picker" , () => 
    {
        instance.open();
        expect(instance.state.open).toBe(true);

        instance.close();
        expect(instance.state.open).toBe(false);
    }); 

    test("Mode defaults to 'datetime'", () => 
    {   expect(instance.state.mode).toBe("datetime");});

    test("Elements should be present", () => 
    {
        expect(UtilityTest.findById(tree, "root")).toBeDefined();
        expect(UtilityTest.findById(tree, "touchable")).toBeDefined();
        expect(UtilityTest.findById(tree, "text")).toBeDefined();
    });

    test("Display value is correct", () => 
    {
        expect(instance.getDisplayValue(timestamp, "datetime")).toBe("Jan 01 2018 00:00");
        expect(instance.getDisplayValue(timestamp, "time")).toBe("00:00");
        expect(instance.getDisplayValue(timestamp, "date")).toBe("Jan 01 2018");
    });

    test("Callback onSelected is called", () => 
    {
        instance.onConfirm(1529857953000) //2018-06-24 at 18:32:33
        expect(onSelectedMock).toBeCalledWith(1529857953000);
        expect(onSelectedMock).toHaveBeenCalledTimes(1);
    });

    test("Renders correctly", () => 
    {
        expect(tree).toMatchSnapshot();
    });

});

