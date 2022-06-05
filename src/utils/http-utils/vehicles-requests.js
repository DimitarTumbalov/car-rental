import axios from 'axios';
import DateObject from 'react-date-object';

const apiUrl = 'http://localhost:3005/vehicles'

export function deleteVehicle(id) {
    return axios.delete(`${apiUrl}/${id}`);
}

export function saveVehicle(vehicle) {
    let now = new DateObject(Date.now());
    vehicle.updatedAt = now.format("hh:mm A DD.MM.YY");

    if (!vehicle.picture)
        vehicle.picture = `https://picsum.photos/320/180?random=${Math.random()}`;

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