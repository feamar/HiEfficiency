export default class AbstractFirestoreDocument<DocumentType>
{
    public readonly id?: string;
    public data: DocumentType;
    
    constructor(data: DocumentType, id: string | null)
    {
        this.data = data;
        this.id = id || undefined;
    }
}