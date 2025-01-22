const months = ["янв", "фев", "март", "апр", "май", "июнь", "июль", "авг", "сен", "окт", "ноя", "дек"]

const getFormatedDate = (strDate) => {
    //console.log(Date.parse(strDate));
    var date = new Date(Date.parse(strDate));
    //console.log(date);
    return((date.getDate() < 10 && "0") + date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear())
}

const getShortedDate = (strDate) => {
    //console.log(Date.parse(strDate));
    var date = new Date(Date.parse(strDate));
    //console.log(date);
    return((date.getDate() < 10 && "0") + date.getDate() + "." + (date.getMonth() < 9 && "0") + (date.getMonth() + 1) + "." + (date.getFullYear()%100))
}

const getShortedTime = (strDate) => {
    var date = new Date(Date.parse(strDate));
    return(date.getHours() + ":" + date.getMinutes())
    //return((date.getDate() < 10 && "0") + date.getDate() + "." + (date.getMonth() < 9 && "0") + (date.getMonth() + 1) + "." + (date.getFullYear()%100))
}

const wasOnlineString = (strDate, strRegDate) => {
    let datems = new Date(Date.parse(strDate)).getTime();
    let nowms = new Date().getTime();    
    // get total seconds between the times
    var delta = Math.abs(nowms - datems) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = Math.floor(delta % 60);
    if (days > 0)
        return(getShortedDate(strDate) + " " + getShortedTime(strDate))
    
    return((hours > 0 ? hours + " ч " : "") + (minutes > 0 ? minutes + " мин " : "") + " назад")
}

const onlineNow = (strDate) => {
    let datems = new Date(Date.parse(strDate)).getTime();
    let nowms = new Date().getTime();   
    var delta = Math.abs(nowms - datems) / 1000;
    
    return(delta < 60);
}

const onlineNever = (strDate, strRegDate) => {
    let datems = new Date(Date.parse(strDate)).getTime();
    let regdatems = new Date(Date.parse(strRegDate)).getTime();

    return (datems - regdatems < 0)
}

export {getFormatedDate, 
        getShortedDate, 
        getShortedTime, 
        wasOnlineString, 
        onlineNever, 
        onlineNow}