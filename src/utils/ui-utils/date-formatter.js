import DateObject from "react-date-object";

export const formatter = "DD.MM.YY hh:mm A";
export const formatter2 = "hh:mm A";
export const formatter3 = "DD.MM.YY";
const formatter4 = "DD.MM";

export function timeMilliesToDateObject(timeMillies){
    return new DateObject(timeMillies).format(formatter);
}

export function isAfter(dateString1, dateString2){
    let date1 = convertStringToDate(dateString1);
    let date2 = convertStringToDate(dateString2);
    return date1 > date2;
}

export function isAfterNow(dateString){
    let date = convertStringToDate(dateString);
    return date > new Date();
}

export function getDaysBetween(startDate, endDate){
    return Math.abs(Math.floor((endDate - startDate) / (1000*60*60*24)));
}

export function convertStringToDate(dateString){
    let date = new DateObject();
    date.setFormat(formatter);
    date.parse(dateString);

    return date.toDate();
}

export function convertStringToDateObject(dateTimeString){
    let date = new DateObject();
    date.setFormat(formatter);
    date.parse(dateTimeString);

    return date;
}

export function formatDate(unformattedDate) {
    let now = new DateObject(Date.now());
    
    let updatedAt = new DateObject();
    updatedAt.setFormat(formatter);
    updatedAt.parse(unformattedDate);

    let formattedDate = `on ${updatedAt.format(formatter3)} at ${updatedAt.format(formatter2)}`;

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
                    let mins = 0

                    if(now.hour == updatedAt.hour)
                        mins = now.minute - updatedAt.minute;
                    else
                        mins = now.minute + 60 - updatedAt.minute;

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

