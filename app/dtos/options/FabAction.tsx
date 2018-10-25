export default class FabAction
{
    public readonly icon: string;
    public readonly label: string;
    public readonly onPress: () => any;

    constructor(icon: string, label: string, onPress: () => any)
    {
        this.icon = icon;
        this.label = label;
        this.onPress = onPress;
    }
}