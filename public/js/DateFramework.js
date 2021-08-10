// DATE METHODS LIBRARY
// AUTHOR: WebAntek


// COMPARE DATE WITHOUT HOURS
// Return True if equal else False
// Return type: boolean
export const dateWithoutHoursIsEqual = (date1, date2) => {

    var firstDate = new Date(date1);
    var firstDateToCompare = firstDate.getDate()+'-'+firstDate.getMonth()+'-'+firstDate.getFullYear();

    var secondDate = new Date(date2);
    var secondDateToCompare = secondDate.getDate()+'-'+secondDate.getMonth()+'-'+secondDate.getFullYear();

    if(firstDateToCompare === secondDateToCompare){
        return true;
    }else{
        return false;
    }

}

// COMPARE DATE WITH HOURS
// Return True if equal else False
// Return type: boolean
export const dateWithHoursIsEqual = (date1, date2) => {

}

// COMPARE IF DATE WITHOUT HOUR IS SUP
// Return true if date1 is superior to date2 else false
// Return type: boolean
export const dateWithoutHourIsSup = (date1, date2) => {
    
}

// COMPARE IF DATE WITH HOUR IS SUP
// Return true if date1 is superior to date2 else false
// Return type: boolean
export const dateWithHourIsSup = (date1, date2) => {
    
}

// COMPARE HOURS IS EQUAL
// Return true if is equal else false
// Return type: boolean
export const hourIsEqual = (date1, date2) => {

}

// COMPARE HOURS IS BETWEEN
// Return true if is between else false
// Return type: boolean
export const hourIsBetween = (dateToCompare, date1, date2) => {

}

// COMPARE IF HOUR IS SUP
// Return true if date1 is superior to date2 else false
// Return type: boolean
export const hourIsSup = (date1, date2) => {
    
}

// DISPLAY FRENCH FULL DATE
// Expected output ex: Mardi 07 Juillet 2021
// Return type: string
export const displayFrenchFullDate = (date) => {

}

// DISPLAY FRENCH DATE
// Expected output ex: 29/07/2021
// Return type: string
export const displayFrenchDate = (date) => {

}

// DISPLAY FULL FRENCH HOURS
// Expected output ex: 11 heures et 23 minutes
// Return type: string
export const displayFullFrenchHours = (date) => {

}

// DISPLAY FRENCH HOURS
// Expected output ex: 11h23
// Return type: string
export const displayFrenchHours = (date) => {

}

// DISPLAY  HOURS
// Expected output ex: 11:23
// Return type: string
export const displayHours = (date) => {

}

// DISPLAY FULL FRENCH MINUTES
// Expected output ex: 11 minutes et 23 secondes
// Return type: string
export const displayFullFrenchMinutes = (date) => {

}

// DISPLAY FRENCH MINUTES
// Expected output ex: 11min 23s
// Return type; string
export const displayFrenchMinutes = (date) => {

}
