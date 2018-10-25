export interface Baseable<BaseType> 
{
    base: BaseType | undefined
    onBaseReference?: (reference?: BaseType) => void,
}

export const onBaseReference = <BaseType extends {}> (child: Baseable<BaseType>) => (reference: BaseType | null): void =>
{
    if(reference == null)
    {   child.base = undefined;}
    else
    {   child.base = reference;}

    if(child.onBaseReference)
    {   child.onBaseReference(reference == null ? undefined : reference);}
}