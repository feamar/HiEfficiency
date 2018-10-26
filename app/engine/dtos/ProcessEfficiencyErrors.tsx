import ProcessEfficiencyError from "./ProcessEfficiencyError";
import { ProcessEfficiencyErrorType } from "./ProcessEfficiencyErrorType";

export default class ProcessEfficiencyErrors
{
    private errors: Array<ProcessEfficiencyError>;

    public get length()
    {   return this.errors.length;}

    constructor(errors: Array<ProcessEfficiencyError> = [])
    {
        this.errors = errors;
    }

    public global = (): Array<ProcessEfficiencyError> => 
    {   return this.errors.filter(e => e.usernames.length == 0);}

    public userSpecific = (): Map<string, Array<ProcessEfficiencyErrorType>> =>
    {
        const withUsers = this.errors.filter(e => e.usernames.length > 0);
        const result = new Map<string, Array<ProcessEfficiencyErrorType>>();
        
        withUsers.forEach(error => 
        {
            error.usernames.forEach(username => 
            {
                const existing = result.get(username);
                if(existing)
                {
                    if(existing.includes(error.type) == false)
                    {   existing.push(error.type);}
                }
                else
                {
                    result.set(username, [error.type]);
                }
            });
        });

        return result;
        }

    public all = () =>
    {   return this.errors;}  

    public add = (error: ProcessEfficiencyError) =>
    {   this.errors.push(error);}

    public addNoDuplicate = (error: ProcessEfficiencyError) =>
    {
        const index = this.errors.indexOf(error);
        if(index < 0)
        {   this.add(error);}
        else
        {
            error.usernames.forEach(username => 
            {
                if(this.errors[index].usernames.includes(username) == false)
                {   this.errors[index].usernames.push(username);}
            });
        }
    }

    public hasAny = () =>
    {   return this.errors.length > 0;}

    public hasGlobalErrors = () =>
    {   return this.errors.some(e => e.usernames.length == 0);}

    public hasUserSpecificErrors = () =>
    {   return this.errors.some(e => e.usernames.length > 0);}

    public merge = (otherErrors: ProcessEfficiencyErrors) =>
    {
        const newErrors = new ProcessEfficiencyErrors();

        this.errors.forEach(error => 
        {   newErrors.addNoDuplicate(error); });

        otherErrors.all().forEach(error => 
        {   newErrors.addNoDuplicate(error)});

        return newErrors;
    }
}