import axios from 'axios';

const apiUrl = 'http://localhost:3005/rental-events'
const apiUrl2 = 'http://localhost:3005/users'
const apiUrl3 = 'http://localhost:3005/vehicles'

// export function deleteRentalEvent(id) {
//     return axios.delete(`${apiUrl}/${id}`);
// }

export function saveRentalEvent(rental_event) {
    return axios.post(`${apiUrl}`, rental_event);
}

export function getAllRentalEvents(){
    return axios.get(apiUrl);
}

export function getRentalEventByUserId(id){
    return axios.get(`${apiUrl2}/${id}`)
}

export function getRentalEventByVehicleId(id){
    return axios.get(`${apiUrl3}/${id}`)
}