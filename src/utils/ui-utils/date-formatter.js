import DateObject from "react-date-object";
import moment from 'moment';

const formatter = "hh:mm A DD-MM-YYYY";
const formatter2 = "hh:mm A";
const formatter3 = "DD/MM/YY";
const formatter4 = "DD/MM";

export function timeMilliesToDate(timeMillies){
    return new DateObject(timeMillies).format(formatter);
}

export function isAfter(dateString){
    const date = new DateObject();
    date.setFormat(formatter)
    date.parse(dateString);

    return date.toDate() > Date.now();
}

export function convertStringToDate(dateString){
    var date = new DateObject();
    date.setFormat(formatter);
    date.parse(dateString);

    return date.toDate();
}

export function formatDate(unformattedDate) {
    var now = new DateObject(Date.now());
    
    var updated_at = new DateObject();
    updated_at.setFormat(formatter);
    updated_at.parse(unformattedDate);

    var formattedDate = `on ${updated_at.format(formatter3)} at ${updated_at.format(formatter2)}`;

    if(updated_at.year == now.year){
        if(updated_at.day != now.day){
            formattedDate = `on ${updated_at.format(formatter4)} at ${updated_at.format(formatter2)}`;
        }else{
            if(now.hour == updated_at.hour || (now.hour == updated_at.hour + 1 && now.minute + 60 - updated_at.minute < 60)){
                if(now.minute == updated_at.minute || (now.second + 60 - updated_at.second) < 60)
                    formattedDate = "right now";
                else{
                    var mins = 0

                    if(now.hour == updated_at.hour)
                        mins = now.minute - updated_at.minute;
                    else
                        mins = now.minute + 60 - updated_at.minute;

                    console.log(mins);

                    if(mins > 1)
                        formattedDate = `${mins} minutes ago`;
                    else
                        formattedDate = `${mins} minute ago`;
                }
            } else{
                formattedDate = `Today at ${updated_at.format(formatter2)} `;
            }
            
        }
    }

    return formattedDate;
}

