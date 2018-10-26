import { ProcessEfficiencyErrorType } from "./ProcessEfficiencyErrorType";

export default class ProcessEfficiencyError
{
    public readonly type: ProcessEfficiencyErrorType;
    public readonly usernames: Array<string>;

    constructor(type: ProcessEfficiencyErrorType, usernames: Array<string> = [])
    {
           this.type = type;
           this.usernames = usernames;
    }
}