import axios from 'axios';
import DateObject from 'react-date-object';
import { formatter } from '../ui-utils/date-formatter';

const apiUrl = 'http://localhost:3005/vehicles'

export function deleteVehicle(id) {
    return axios.delete(`${apiUrl}/${id}`);
}

export function saveVehicle(vehicle) {
    let now = new DateObject(Date.now());
    vehicle.updatedAt = now.format(formatter);

    if (vehicle.id) {
        return axios.put(`${apiUrl}/${vehicle.id}`, vehicle);
    }

    return axios.post(`${apiUrl}`, vehicle);
}

export function getAllVehicles(){
    return axios.get(apiUrl);
}

export function getVehicleById(id){
    return axios.get(`${apiUrl}/${id}`)
}