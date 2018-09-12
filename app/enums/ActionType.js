
export default class ActionType
{
    static EDIT = "edit";
    static DELETE = "delete";
    static LEAVE = "leave";
    static INSPECT = "inspect";
    static UPVOTE = "upvote";
    static FINISH = "finish";
    static REOPEN = "reopen";
    static JOIN = "join";
    static CREATE = "create";
    static POSITIVE = "positive";
    static NEGATIVE = "negative";
    static NEUTRAL = "neutral";
    static SCAFFOLD = "scaffold";
    static UNSTART = "unstart";

    static Values = [ActionType.EDIT, ActionType.DELETE, ActionType.LEAVE, ActionType.INSPECT, 
        ActionType.UPVOTE, ActionType.FINISH, ActionType.REOPEN, ActionType.JOIN, ActionType.CREATE,
        ActionType.POSITIVE, ActionType.NEGATIVE, ActionType.Neutral, ActionType.SCAFFOLD, ActionType.UNSTART];
}