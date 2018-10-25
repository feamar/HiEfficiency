import { Component } from "react";

export default class UtilityAsync
{
    static sleep = (milliseconds: number) : Promise<void> => 
    {   return new Promise(resolve => setTimeout(resolve, milliseconds))}

    static setState = (component: Component, updates: object) =>
    {   return new Promise(resolve => component.setState(updates, resolve));}
}