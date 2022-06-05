import { useEffect, useState } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { getAllRentalEvents } from "../../../utils/http-utils/rental-events-requests";
import { deleteVehicle, getAllVehicles } from "../../../utils/http-utils/vehicles-requests";
import { convertStringToDateObject, isAfterNow } from "../../../utils/ui-utils/date-formatter";
import { VehicleCard } from "../vehicle-card/VehicleCard";
import './VehiclesList.scss'

export function VehiclesList(){

    const [vehicles, setVehicles] = useState([]);
    const [showRentedVehicles, setShowRentedVehicles] = useState(false);
    const [sort, setSort] = useState('');

    useEffect(() => {
        getAllVehicles().then(response => {

            const allVehicles = response.data;

            getAllRentalEvents().then(response2 => {
                let rentalEvents = response2.data;

                allVehicles.forEach(v => {
                    let rentalEvent = rentalEvents.find( rentalEvent => rentalEvent.vehicleId == v.id && isAfterNow(rentalEvent.endTime));
                    if(rentalEvent){
                        v.rented = true;
                        v.rentedUntil = rentalEvent.endTime; 
                    }
                });
                
                // default sort by newest
                allVehicles.sort((a, b) => {
                    let aDate = convertStringToDateObject(a.updatedAt).valueOf();
                    let bDate = convertStringToDateObject(b.updatedAt).valueOf();

                    return bDate - aDate;
                });

                setVehicles(allVehicles);
            })

        });
 
    }, [])

    useEffect(() => {
        sortVehicles();
    }, [sort])

    const deleteVehicleHandler = async (id, e) => {
        e.stopPropagation();

       await deleteVehicle(id);
       setVehicles(prevState => {
           return prevState.filter(vehicle => vehicle.id !==id)
       });
    }

    const onShowRentedVehiclesChange = (e) => {
        if(e.target.checked)
            setShowRentedVehicles(true);
        else
            setShowRentedVehicles(false);
    }

    const onSortChange = (e) => {
        setSort(e.target.value)
    }

    const sortVehicles = () => {
        console.log(sort);

        switch(sort){
            case 'price asc': {
                setVehicles( vehicles.slice().sort((a,b) => { return a.pricePerDay - b.pricePerDay }));
            } break;
            case 'price desc': {
                setVehicles( vehicles.slice().sort((a,b) => { return b.pricePerDay - a.pricePerDay }));
            } break;
            default: {
                setVehicles(
                    vehicles.slice().sort((a,b) => {
                        let aDate = convertStringToDateObject(a.updatedAt).valueOf();
                        let bDate = convertStringToDateObject(b.updatedAt).valueOf();
                        return bDate - aDate;
                     })
                );
            }
        }
    }

    return (
        <div>
            <Row className="text-start text-center">
                <Col>
                    <h3><b>Available vehicles{vehicles?.length ? ` (${vehicles?.filter( vehicle => !vehicle.rented).length})` : ''}
                    { showRentedVehicles && `, Rented (${vehicles?.filter( vehicle => vehicle.rented).length})` }</b></h3>
                </Col>
            </Row>
            <Row className="justify-content-center mt-2">
                <Col xs='auto' className="my-auto">
                    <Form.Check type='checkbox' id='default-checkbox' label='Show rented vehicles' onChange={onShowRentedVehiclesChange}/>
                </Col>
                <Col xs='auto'>
                    <Form.Select size="sm" onChange={onSortChange} defaultValue=''>
                        <option value='' disabled>Sort by</option>
                        <option value='newest'>Newest</option>
                        <option value='price asc'>Price Ascending</option>
                        <option value='price desc'>Price Descending</option>
                    </Form.Select>
                </Col>
            </Row>
            <Stack direction="horizontal" gap={2} className="d-flex flex-wrap justify-content-center mt-3">
                { (showRentedVehicles) ? (
                    vehicles
                    ?.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} deleteVehicle={deleteVehicleHandler} /> )
                ) : (
                    vehicles
                    ?.filter( vehicle => !vehicle.rented)
                    ?.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} deleteVehicle={deleteVehicleHandler} />)
                )}
            </Stack>
        </div>
    )
}