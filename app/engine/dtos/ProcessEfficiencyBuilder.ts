import ProcessEfficiencyErrors from "./ProcessEfficiencyErrors";
import ProcessEfficiencyError from "./ProcessEfficiencyError";
import ProcessEfficiency from "./ProcessEfficiency";
import UtilityArray from "../../utilities/UtilityArray";


export default class ProcessEfficiencyBuilder
{
    private productiveTime: number = 0;
    private interruptedTime: number = 0;
    private potentialTime: number = 0;

    private errors: ProcessEfficiencyErrors = new ProcessEfficiencyErrors();
    private participants: Array<string>;

    constructor(from: Date, to: Date)
    {
        this.participants = [];
        this.potentialTime = to.getTime() - from.getTime();
    }

    addProductiveTime = (productiveTimeOrError: number | ProcessEfficiencyError) =>
    {
        if(productiveTimeOrError instanceof ProcessEfficiencyError)
        {
            this.errors.addNoDuplicate(productiveTimeOrError);
        }
        else
        {
            this.productiveTime += productiveTimeOrError;
        }
        return this;
    }

    addInterruptedTime = (interruptedTime: number | ProcessEfficiencyError) =>
    {
        if(interruptedTime instanceof ProcessEfficiencyError)
        {
            this.errors.addNoDuplicate(interruptedTime);
        }
        else
        {
            this.interruptedTime += interruptedTime;
        }
        return this;
    }

    addError = (error: ProcessEfficiencyError) =>
    {
        this.errors.addNoDuplicate(error);
    }

    addEfficiency = (efficiency: ProcessEfficiency | ProcessEfficiencyErrors) =>
    {
        if(efficiency instanceof ProcessEfficiency)
        {
            this.productiveTime += efficiency.productiveTime;
            this.interruptedTime += efficiency.interruptionTime;
            this.participants = UtilityArray.merge(this.participants, efficiency.usernames, false);
        }
        else
        {
            efficiency.all().forEach(e => this.errors.addNoDuplicate(e));
        }
    }

    build = () =>
    {
        if(this.errors.hasAny())
        {   
            return this.errors;
        }
        else
        {   
            return new ProcessEfficiency(this.potentialTime, this.productiveTime, this.interruptedTime, this.participants);
        }
    }
}