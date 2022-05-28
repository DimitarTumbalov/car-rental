import axios from 'axios';

const apiUrl = 'http://localhost:3005/vehicles'

export function deleteVehicle(id) {
    return axios.delete(`${apiUrl}/${id}`);
}

export function saveVehicle(vehicle) {

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