import ReduxStory from "../../../../../dtos/redux/ReduxStory";
import EfficiencyEngine from "../../../../../engine/EfficiencyEngine";
import ProcessEfficiencyErrors from "../../../../../engine/dtos/ProcessEfficiencyErrors";

export default abstract class AbstractChartGranularity
{
    public readonly text: string;

    constructor (text: string)
    {
        this.text = text;
    }   

    //abstract getTitleDisplayValue(timestamp: Date): string;
    //abstract getSubtitleDisplayValue(timestamp: Date): string | undefined;
    abstract getNextTimestamp(timestamp: Date): Date ;
    abstract getPreviousTimestamp(timestamp: Date): Date ;
    abstract setToGranularityStart(timestamp: Date): Date;
    abstract setToGranularityEnd(timestamp: Date): Date;

    public async aggregate(timestamp: Date | undefined, story: ReduxStory): Promise<Array<number>> 
    {
        if(timestamp == undefined) { console.log("HA 1"); return [];}
        if(story.document.data.startedOn == undefined)  { console.log("HA 2"); return [];}
        if(timestamp > (story.document.data.finishedOn || new Date()))  { console.log("HA 3: " + timestamp + " AND " + story.document.data.finishedOn || new Date()); return [];}
        
        const from = this.setToGranularityStart(timestamp);
        const to = this.setToGranularityEnd(from);


        const efficiency = await EfficiencyEngine.getProcessEfficiency(story, from, to);

        if(efficiency instanceof ProcessEfficiencyErrors)
        {
            throw new Error("Chart errors occurred: " + efficiency + ".");
        }

        console.log("AGGREGATING: " + from + " " + to + " - Efficiency: " + efficiency.processEfficiency);

        const recursed = await this.aggregate(this.getNextTimestamp(from), story);
        return [efficiency.processEfficiency].concat(recursed);
    }    
}