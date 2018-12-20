import EntityInterruption from "../dtos/firebase/firestore/entities/EntityInterruption";

export default class UtilityInterruption
{
    public static overlaps = (interruption: EntityInterruption, from: Date, to: Date, now: Date = new Date()) =>
    {
        const start = interruption.timestamp;
        const end = new Date(interruption.timestamp.getTime() + (interruption.duration || (now.getTime() - interruption.timestamp.getTime())));
    
        if(start < from && end > from)   return true;
        if(start > from && start < to)  return true;
        
        return false;
    }
}