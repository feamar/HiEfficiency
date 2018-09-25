export default class ReduxInspecting
{
    public readonly team?: string;
    public readonly story?: string;

    constructor(team?: string, story?: string)
    {
        this.team = team;
        this.story = story;
    }

    setTeam = (team? : string) : ReduxInspecting =>
    {   return new ReduxInspecting(team, this.story);}

    setStory = (story? : string) : ReduxInspecting =>
    {   return new ReduxInspecting(this.team, story);}
}