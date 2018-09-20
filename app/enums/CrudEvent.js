
export default class CrudEvent
{
    static DIALOG_SHOWN = "dialog_shown";
    static DIALOG_DISMISSED = "dialog_dismissed";
    static PROCESS_COMPLETED = "process_completed";

    static Values = [CrudEvent.DIALOG_SHOWN, CrudEvent.DIALOG_DISMISSED, CrudEvent.PROCESS_COMPLETED];
}