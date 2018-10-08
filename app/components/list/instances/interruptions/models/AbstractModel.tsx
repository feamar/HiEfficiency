export default class AbstractModel
{
    public readonly factory: {new (props: any, context?: any): React.Component<any>};

    constructor(factory: {new (props: any, context?: any): React.Component<any>})
    {
        this.factory = factory;
    }
}