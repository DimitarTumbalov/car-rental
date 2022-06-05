import DateObject from "react-date-object";

var formatter = "hh:mm A DD.MM.YY";
const formatter2 = "hh:mm A";
const formatter3 = "DD.MM.YY";
const formatter4 = "DD.MM";

export function timeMilliesToDate(timeMillies){
    return new DateObject(timeMillies).format(formatter3);
}

export function isAfter(dateString1, dateString2){
    let date1 = convertStringToDate(dateString1);
    let date2 = convertStringToDate(dateString2);

    return date1 > date2;
}

export function isAfterNow(dateString){
    let date = convertStringToDate(dateString);
    return date.getTime() > Date.now();
}

export function getDaysBetween(startDate, endDate){
    return Math.floor((endDate - startDate) / (1000*60*60*24));
}

export function convertStringToDate(dateString){
    var date = new DateObject();
    date.setFormat(formatter3);
    date.parse(dateString);

    return date.toDate();
}

export function convertStringToDateObject(dateTimeString){
    var date = new DateObject();
    date.setFormat(formatter);
    date.parse(dateTimeString);

    return date;
}

export function formatDate(unformattedDate) {
    var now = new DateObject(Date.now());
    
    var updatedAt = new DateObject();
    updatedAt.setFormat(formatter);
    updatedAt.parse(unformattedDate);

    var formattedDate = `on ${updatedAt.format(formatter3)} at ${updatedAt.format(formatter2)}`;

    if(updatedAt.year == now.year){
        if(updatedAt.dayOfYear != now.dayOfYear){
            if(now.dayOfYear - updatedAt.dayOfYear == 1)
                formattedDate = `yesterday at ${updatedAt.format(formatter2)}`;
            else
                formattedDate = `on ${updatedAt.format(formatter4)} at ${updatedAt.format(formatter2)}`;
        }else{
            if(now.hour == updatedAt.hour || (now.hour == updatedAt.hour + 1 && now.minute + 60 - updatedAt.minute < 60)){
                if(now.minute == updatedAt.minute || (now.second + 60 - updatedAt.second) < 60)
                    formattedDate = "right now";
                else{
                    var mins = 0

                    if(now.hour == updatedAt.hour)
                        mins = now.minute - updatedAt.minute;
                    else
                        mins = now.minute + 60 - updatedAt.minute;

                    console.log(mins);

                    if(mins > 1)
                        formattedDate = `${mins} minutes ago`;
                    else
                        formattedDate = `${mins} minute ago`;
                }
            } else{
                formattedDate = `Today at ${updatedAt.format(formatter2)} `;
            }
            
        }
    }

    return formattedDate;
}

