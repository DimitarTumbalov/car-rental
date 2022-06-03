import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { getAllRentalEvents } from "../../../utils/http-utils/rental-events-requests";
import { deleteVehicle, getAllVehicles } from "../../../utils/http-utils/vehicles-requests";
import { isAfter, isNotBefore } from "../../../utils/ui-utils/date-formatter";
import { VehicleCard } from "../vehicle-card/VehicleCard";
import './VehiclesList.scss'

export function VehiclesList(){

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        getAllVehicles().then(response => {

            const allVehicles = response.data;

            getAllRentalEvents().then(response2 => {
                
                const rentalEvents = response2.data;



                // Only display the available vehicles
                setVehicles(allVehicles.filter(vehicle => !rentalEvents.some( rentalEvent => rentalEvent.vehicle_id == vehicle.id && isAfter(rentalEvent.end_time)) ));

            })

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