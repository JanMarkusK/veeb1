const monthNamesET =["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
//kuupäeva leidmine
const monthNamesEN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const dateENformatted= function(){
	let timeNow = new Date();
	//return timeNow.getDate() + "." + (timeNow.getMonth() + 1) + "." + timeNow.getFullYear();
	return monthNamesEN[timeNow.getMonth()] + " " + timeNow.getDate() + " " + timeNow.getFullYear();
}

const dateENShort = function(){
	let timeNow = new Date();
	return (timeNow.getMonth() + 1) + "/" + timeNow.getDate() + "/" + timeNow.getFullYear();
}

const dateETformatted = function(){
    console.log (monthNamesET [1]);
    let timeNow = new Date();
    return timeNow.getDate() + "." + monthNamesET[timeNow.getMonth()] + "." + timeNow.getFullYear();
}
//aja leidmine
const timeETformatted = function (){
    let timeNow = new Date();
    return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
}
const timeOfDayET = function(){
    let partOfDay = "suvaline hetk";
    let hourNow = new Date().getHours();
    if (hourNow >= 6 && hourNow < 12){
        partOfDay = "hommik";
    }
    if (hourNow >= 14 && hourNow < 18){
        partOfDay = "pärastlõuna";
    }
    if (hourNow >= 18){
        partOfDay = "õhtu";
    }
    return partOfDay;

}

//ekspordin kõik asjad
module.exports = {dateETformatted: dateETformatted, timeETformatted: timeETformatted, monthsET: monthNamesET, timeOfDayET: timeOfDayET, dateENformatted: dateENformatted, dateENShort: dateENShort};
//console.log(monthNamesET)