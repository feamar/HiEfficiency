
export default class CrudEvent
{
    static readonly DIALOG_SHOWN      = "dialog_shown";
    static readonly DIALOG_DISMISSED  = "dialog_dismissed";
    static readonly PROCESS_COMPLETED = "process_completed";

    static readonly Values: Array<string> = [CrudEvent.DIALOG_SHOWN, CrudEvent.DIALOG_DISMISSED, CrudEvent.PROCESS_COMPLETED];
}