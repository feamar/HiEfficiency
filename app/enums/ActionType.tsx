
export default class ActionType
{
    static readonly EDIT = "edit";
    static readonly DELETE = "delete";
    static readonly LEAVE = "leave";
    static readonly INSPECT = "inspect";
    static readonly UPVOTE = "upvote";
    static readonly FINISH = "finish";
    static readonly REOPEN = "reopen";
    static readonly JOIN = "join";
    static readonly CREATE = "create";
    static readonly POSITIVE = "positive";
    static readonly NEGATIVE = "negative";
    static readonly NEUTRAL = "neutral";
    static readonly SCAFFOLD = "scaffold";
    static readonly UNSTART = "unstart";

    static readonly Values: Array<string> = [ActionType.EDIT, ActionType.DELETE, ActionType.LEAVE, ActionType.INSPECT, 
        ActionType.UPVOTE, ActionType.FINISH, ActionType.REOPEN, ActionType.JOIN, ActionType.CREATE,
        ActionType.POSITIVE, ActionType.NEGATIVE, ActionType.NEUTRAL, ActionType.SCAFFOLD, ActionType.UNSTART];
}