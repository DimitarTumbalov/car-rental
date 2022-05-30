import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { deleteVehicle, getAllVehicles } from "../../../utils/http-utils/vehicles-requests";
import { VehicleCard } from "../vehicle-card/VehicleCard";
import './VehiclesList.scss'

export function VehiclesList(){

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        getAllVehicles().then(response => {
            setVehicles(response.data);
        });
 
    }, [])

    const deleteVehicleHandler = async (id, e) => {
        e.stopPropagation();

       await deleteVehicle(id);
       setVehicles(prevState => {
           return prevState.filter(vehicle => vehicle.id !==id)
       });
    }

    return (
        <Stack direction="horizontal" gap={2} className="d-flex flex-wrap justify-content-center">
            { vehicles.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} deleteVehicle={deleteVehicleHandler} /> )}
        </Stack>
    )
}