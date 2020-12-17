export const betTimeFormat = (dateVal) => {
  var newDate = new Date(dateVal);
  console.log(newDate);

  var sMonth = newDate.getMonth() + 1;
  var sDay = newDate.getDate();

  var sHour = newDate.getHours();
  var sMinute = newDate.getMinutes();
  var sAMPM = "AM";

  var iHourCheck = parseInt(sHour);

  if (iHourCheck >= 12) {
    sAMPM = "PM";
    if (iHourCheck > 12) {
      sHour = iHourCheck - 12;
    }
  } else if (iHourCheck === 0) {
    sHour = "12";
  }

  sMinute = padValue(sMinute);

  //If today, only show the time
  var todaysDate = new Date();
  if (newDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
    return sHour + ":" + sMinute + " " + sAMPM;
  }
  //else, if tomorrow, say "Tomorrow" instead of the date
  else if (newDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
    return "Tomorrow, " + sHour + ":" + sMinute + " " + sAMPM;
  }
  //else, display normally
  else {
    return sMonth + "/" + sDay + ", " + sHour + ":" + sMinute + " " + sAMPM;
  }
};

function padValue(value) {
  return value < 10 ? "0" + value : value;
}
