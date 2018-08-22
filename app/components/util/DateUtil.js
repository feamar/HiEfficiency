import React from 'react';

export const asTime = (date) => {
	return date.toLocaleTimeString().substring(0, 5);
}

export const asDate = (date) => {
	return date.toDateString().slice(4, 10);
}

export const difference = (start, finish) => {
	if (start == undefined || finish == undefined) {
		return "";
	}
	var first = (start.constructor !== undefined && start.constructor.name == 'Date') ? start.getTime() / 1000 : start;
	var second = (finish.constructor !== undefined && finish.constructor.name == 'Date') ? finish.getTime() / 1000 : finish;

  var difference = second - first;
  seconds = difference % 60;
  difference -= seconds;
  difference /= 60;
  minutes = difference % 60;
  difference -= minutes;
  difference /= 60;
  hours = difference % 24;
  difference -= hours;
  difference /= 24;
  days = difference;

  result = '';
  if (days > 0) {
    result += days + 'd';
  }
  if (hours > 0) {
    if (result !== '') { result += ' ' }
  	result += hours + 'h';
  }
  if (minutes > 0) {
    if (result !== '') { result += ' ' }
    result += minutes + 'm';
  }

  if (result == '') {
    result += ((seconds - (seconds % 1))) + 's';
  }

  return result;
}
