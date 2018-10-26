export enum ProcessEfficiencyErrorType
{
    IncorrectOrder = "Process efficiency cannot be calculated because this user has an incorrect order in their interruptions.",
    StoryUnstarted = "Process efficiency cannot be calculated because the story has not yet been started.",
    StoryStartInFuture = "Process efficiency cannot be calculated because the start time of the story lies in the future."
}
