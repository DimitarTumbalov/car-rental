import axios from 'axios';
import { convertStringToDate, getDaysBetween, isAfter } from '../ui-utils/date-formatter';

const apiUrl = 'http://localhost:3005/rental-events'
const apiUrl2 = 'http://localhost:3005/users'
const apiUrl3 = 'http://localhost:3005/vehicles'

export function deleteRentalEvent(id) {
    return axios.delete(`${apiUrl}/${id}`);
}

export function saveRentalEvent(rental_event, vehicle_price_per_day, user_rented_count) {
    let startDate = convertStringToDate(rental_event.start_time);
    let endDate = convertStringToDate(rental_event.end_time);

    let days = getDaysBetween(startDate, endDate) + 1;

     // More than 3 days - 5% discount
    // More than 5 days - 7% discount
    // More than 10 days - 10% discount
    // If a customer has rented a vehicle more than 3 times in the last 60 days, they would be designated as 
    // VIP customers and get a discount of 15%

    var discount = 0;

    if(user_rented_count > 3){
        discount = 15
    }else{
        if(days > 10)
            discount = 10;
        else if (days > 5)
            discount = 7;
        else if (days > 3)
            discount = 5;
        else 
            discount = 0;
    }

    var price = days * vehicle_price_per_day;

    if(discount > 0) 
        price = price - (price * discount) / 100;

    rental_event.price = price.toFixed(2);

    return axios.post(`${apiUrl}`, rental_event);
}

export function getAllRentalEvents(){
    return axios.get(apiUrl);
}