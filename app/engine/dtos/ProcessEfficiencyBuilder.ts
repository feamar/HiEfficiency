import ProcessEfficiencyErrors from "./ProcessEfficiencyErrors";
import ProcessEfficiencyError from "./ProcessEfficiencyError";
import EntityInterruption from "../../dtos/firebase/firestore/entities/EntityInterruption";
import ProcessEfficiency from "./ProcessEfficiency";
import DocumentUser from "../../dtos/firebase/firestore/documents/DocumentUser";


export default class ProcessEfficiencyBuilder
{
    private username: string;

    private userProductiveTime: number = 0;
    private userInterruptionTime: number = 0;
    private errors: ProcessEfficiencyErrors = new ProcessEfficiencyErrors();

    constructor(user: DocumentUser)
    {
        this.username = user.name;
    }

    processInterruptionInterval = (differenceOrError: number | ProcessEfficiencyError, interruption?: EntityInterruption) => 
    {
        if(differenceOrError instanceof ProcessEfficiencyError)
        {
            this.errors.addNoDuplicate(differenceOrError);
        }
        else
        {
            this.userProductiveTime += differenceOrError;
            this.userInterruptionTime += interruption ? interruption.duration || 0 : 0;
        }
        return this;
    }

    build = () =>
    {
        if(this.errors.hasAny())
        {   
            return this.errors;
        }
        else
        {   
            return new ProcessEfficiency(this.userProductiveTime, this.userInterruptionTime, [this.username]);
        }
    }
}