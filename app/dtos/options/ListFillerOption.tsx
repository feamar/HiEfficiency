import React from "react";
import FillerAwkward from "../../components/svg/fillers/FillerAwkward";
import FillerHappy from "../../components/svg/fillers/FillerHappy";
import FillerBored from "../../components/svg/fillers/FillerBored";

export default class ListFillerOption
{
    public readonly viewConstructor: JSX.Element;
    public readonly title: string;
    public readonly subtitle: string;

    constructor(viewConstructor: JSX.Element, title: string, subtitle: string)
    {
        this.viewConstructor = viewConstructor;
        this.title = title;
        this.subtitle = subtitle;
    }

    public static readonly  Awkward: ListFillerOption = new ListFillerOption(<FillerAwkward />, "You don't have to feel alone...", "Tap the action button below to create or join a team.");
    public static readonly  Happy: ListFillerOption = new ListFillerOption(<FillerHappy />, "I see you've completed all your work!", "Swipe left to get even more done!");
    public static readonly  Bored: ListFillerOption = new ListFillerOption(<FillerBored />, "It's a bit boring here, isn't it?", "Tap the action button below to create new stories.");

    public static Values = [ListFillerOption.Awkward, ListFillerOption.Happy, ListFillerOption.Bored];
}