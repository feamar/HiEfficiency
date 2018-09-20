import React from "react";
import renderer from "react-test-renderer";
import DatabaseActionType from "../DatabaseActionType";

it("cannot be created at runtime", () => 
{
    expect(() => new DatabaseActionType(undefined, "tested", "test", "testing")).toThrow("You cannot create additional enum values at runtime.");
    expect(() => new DatabaseActionType(null, "tested", "test", "testing")).toThrow("You cannot create additional enum values at runtime.");
    expect(() => new DatabaseActionType({}, "tested", "test", "testing")).toThrow("You cannot create additional enum values at runtime.");
    expect(() => new DatabaseActionType("EnforcerInstance", "tested", "test", "testing")).toThrow("You cannot create additional enum values at runtime.");
});