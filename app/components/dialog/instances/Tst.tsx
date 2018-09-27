import React from "react";
import DialogLoading from "./DialogLoading";

export default class TestComponent extends React.Component<{}, {}>
{
    render()
    {
        return <DialogLoading onActionClicked={(_: any) => {}} onActionClickListener={(_: any) => {}} title="Loading Data" section="Hello!" onTimeout={() => {}} isComplete={false}  />;
    }
}