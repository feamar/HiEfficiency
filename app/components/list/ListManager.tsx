export default class ListManager
{
    static instance: ListManager = new ListManager();
    
    private scrollOffsets: Map<string, number>;
    
    private constructor()
    {
        this.scrollOffsets = new Map<string, number>();
    }

    public onScrollOffsetChanged = (listId: string, offset: number) =>
    {   this.scrollOffsets.set(listId, offset);}

    public getStoredOffset = (listId: string) =>
    {   return this.scrollOffsets.get(listId);}
}