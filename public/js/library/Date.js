// DATE METHODS LIBRARY
// AUTHOR: WebAntek


// COMPARE DATE WITHOUT HOURS
// Return True if equal else False
// Return type: boolean
/**
 * @desc Function that allows you to compare two dates without hours and return true if equal
 * @link https://www.portfolio-loic-dauchy.com
 * @param {*} date1 - First date to compare
 * @param {*} date2 - Second date to compare
 * @returns true or false
 */
function dateWithoutHoursIsEqual(date1, date2) {

    var firstDate = new Date(date1);
    var firstDateToCompare = firstDate.getDate() + '-' + firstDate.getMonth() + '-' + firstDate.getFullYear();

    var secondDate = new Date(date2);
    var secondDateToCompare = secondDate.getDate() + '-' + secondDate.getMonth() + '-' + secondDate.getFullYear();

    if (firstDateToCompare === secondDateToCompare) {
        return true;
    } else {
        return false;
    }
}

// COMPARE DATE WITH HOURS
// Return True if equal else False
// Return type: boolean
function dateWithHoursIsEqual(date1, date2) {

    var firstDate = new Date(date1);
    var firstDateToCompare = firstDate.getDate() + '-' + firstDate.getMonth() + '-' + firstDate.getFullYear() + ' ' + firstDate.getHours() + ':' + firstDate.getMinutes();

    var secondDate = new Date(date2);
    var secondDateToCompare = secondDate.getDate() + '-' + secondDate.getMonth() + '-' + secondDate.getFullYear() + ' ' + secondDate.getHours() + ':' + secondDate.getMinutes();

    if (firstDateToCompare === secondDateToCompare) {
        return true;
    } else {
        return false;
    }
}

/**
 * 
 * @param {*} dateToCompare 
 * @param {*} date1 
 * @param {*} date2 
 */
function dateIsBetween(dateToCompare, start, end){
    var between = new Date(dateToCompare);
    var date1 = new Date(start);
    var date2 = new Date(end);
    
    if(between >= date1 && between < date2){
        return true;
    }else{
        return false;
    }
}

// COMPARE IF DATE IS SUP
// Return true if date1 is superior to date2 else false
// Return type: boolean
function dateIsSup(date1, date2) {

    var firstDate = new Date(date1);
    var secondDate = new Date(date2);

    if (firstDate > secondDate) {
        return true;
    } else {
        return false;
    }
}


// COMPARE HOURS IS EQUAL
// Return true if is equal else false
// Return type: boolean
function hourIsEqual(date1, date2) {

    var firstDate = parseInt(date1.replace(':', ''));

    var secondDate = parseInt(date2.replace(':', ''));

    if (firstDate === secondDate) {
        return true;
    } else {
        return false;
    }
}

// COMPARE HOURS IS BETWEEN
// Return true if is between else false
// Return type: boolean
function hourIsBetween(dateToCompare, start, end) {

    var date = parseInt(dateToCompare.replace(':', ''));
    var firstDate = parseInt(start.replace(':', ''));
    var secondDate = parseInt(end.replace(':', ''));

    if (date >= firstDate && date < secondDate) {
        return true;
    } else {
        return false;
    }
}

// COMPARE IF HOUR IS SUP
// Return true if date1 is superior to date2 else false
// Return type: boolean
function hourIsSup(date1, date2) {

    var firstDate = parseInt(date1.replace(':', ''));
    var secondDate = parseInt(date2.replace(':', ''));

    if (firstDate > secondDate) {
        return true;
    } else {
        return false;
    }

}

// DISPLAY FRENCH FULL DATE
// Expected output ex: Mardi 07 Juillet 2021
// Return type: string
function displayFrenchFullDate(date) {
    var newDate = new Date(date);

    var dayWeek = newDate.getDay();

    var dayString;

    if (dayWeek === 0) {
        dayString = "Dimanche";
    } else if (dayWeek === 1) {
        dayString = "Lundi";
    } else if (dayWeek === 2) {
        dayString = "Mardi";
    } else if (dayWeek === 3) {
        dayString = "Mercredi";
    } else if (dayWeek === 4) {
        dayString = "Jeudi";
    } else if (dayWeek === 5) {
        dayString = "Vendredi";
    } else if (dayWeek === 6) {
        dayString = "Samedi";
    }

    var month = newDate.getMonth();

    var monthString;

    if (month === 0) {
        monthString = "Janvier";
    } else if (month === 1) {
        monthString = "Février";
    } else if (month === 2) {
        monthString = "Mars";
    } else if (month === 3) {
        monthString = "Avril";
    } else if (month === 4) {
        monthString = "Mai";
    } else if (month === 5) {
        monthString = "Juin";
    } else if (month === 6) {
        monthString = "Juillet";
    } else if (month === 7) {
        monthString = "Août";
    } else if (month === 8) {
        monthString = "Septembre";
    } else if (month === 9) {
        monthString = "Octobre";
    } else if (month === 10) {
        monthString = "Novembre";
    } else if (month === 11) {
        monthString = "Décembre";
    }

    var day = newDate.getDate();
    if (day < 10) {
        day = "0" + day.toString();
    }

    var years = newDate.getFullYear().toString();

    return dayString + ' ' + day + ' ' + monthString + ' ' + years;
}

// DISPLAY FRENCH DATE
// Expected output ex: 29/07/2021
// Return type: string
function displayFrenchDate(date) {

    var newDate = new Date(date);

    var month = newDate.getMonth() + 1;
    if(month < 10){
        month = "0"+month.toString();
    }

    var day = newDate.getDate();

    if (day < 10) {
        day = "0" + day.toString();
    }

    var years = newDate.getFullYear().toString();

    return day + '/' + month + '/' + years;

}

// DISPLAY FULL FRENCH HOURS
// Expected output ex: 11 heures et 23 minutes
// Return type: string
function displayFullFrenchHours(date) {

    var time = new Date(date);

    var hours = time.getHours();
    if(hours < 10){
        hours = "0"+hours.toString();
    }

    var minutes = time.getMinutes();
    if(minutes < 10){
        minutes = "0"+minutes.toString();
    }

    return hours + ' heures et ' + minutes + ' minutes';

}

// DISPLAY FRENCH HOURS
// Expected output ex: 11h23
// Return type: string
function displayFrenchHours(date) {

    var time = new Date(date);
    var hours = time.getHours();
    if(hours < 10){
        hours = "0"+hours.toString();
    }

    var minutes = time.getMinutes();
    if(minutes < 10){
        minutes = "0"+minutes.toString();
    }

    return hours + 'h' + minutes;
}

// DISPLAY  HOURS
// Expected output ex: 11:23
// Return type: string
function displayHours(date) {

    var time = new Date(date);
    var hours = time.getHours();
    if(hours < 10){
        hours = "0"+hours.toString();
    }

    var minutes = time.getMinutes();
    if(minutes < 10){
        minutes = "0"+minutes.toString();
    }

    return hours + ':' + minutes;
}

// DISPLAY FULL FRENCH MINUTES
// Expected output ex: 11 minutes et 23 secondes
// Return type: string
function displayFullFrenchMinutes(date) {

    var time = new Date(date);
    var minutes = time.getMinutes();
    if(minutes < 10){
        minutes = "0"+minutes.toString();
    }
    var secondes = time.getSeconds();
    if(secondes < 10){
        secondes = "0"+secondes.toString();
    }

    return minutes + ' minutes et ' + secondes + ' secondes';
}

// DISPLAY FRENCH MINUTES
// Expected output ex: 11min 23s
// Return type: string
function displayFrenchMinutes(date) {

    var time = new Date(date);
    var minutes = time.getMinutes();
    if(minutes < 10){
        minutes = "0"+minutes.toString();
    }
    var secondes = time.getSeconds();
    if(secondes < 10){
        secondes = "0"+secondes.toString();
    }

    return minutes + 'min ' + secondes+ 's';

}
