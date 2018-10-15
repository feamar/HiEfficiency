
export const asTime = (date: Date) => {
	return date.toLocaleTimeString().substring(0, 5);
}

export const asDate = (date: Date) => {
	return date.toDateString().slice(4, 15);
}

export const difference = (start: any, finish: any) => {
	if (start == undefined || finish == undefined) {
		return "";
	}
	var first = (start.constructor !== undefined && start.constructor.name == 'Date') ? start.getTime() / 1000 : start;
	var second = (finish.constructor !== undefined && finish.constructor.name == 'Date') ? finish.getTime() / 1000 : finish;

  var difference = second - first;
  var seconds = difference % 60;
  difference -= seconds;
  difference /= 60;
  var minutes = difference % 60;
  difference -= minutes;
  difference /= 60;
  var hours = difference % 24;
  difference -= hours;
  difference /= 24;
  var days = difference;
 
  var result = '';
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
