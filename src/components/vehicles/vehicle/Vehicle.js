import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, ListGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicleById } from "../../../utils/http-utils/vehicles-requests";
import { deleteVehicle } from "../../../utils/http-utils/vehicles-requests";
import './Vehicle.scss'
import { formatDate, isAfter, isAfterNow } from '../../../utils/ui-utils/date-formatter'
import { getLoggedUser } from "../../../utils/http-utils/user-requests";
import { getAllRentalEvents } from "../../../utils/http-utils/rental-events-requests";

export function Vehicle(){

    const params = useParams();
    const [vehicle, setVehicle] = useState(null);

    const navigate = useNavigate();

    const loggedUser = getLoggedUser();

    useEffect(() => {
        if (params.id) {
            getVehicleById(params.id).then(response => {
                let v = response.data;

                getAllRentalEvents().then(response2 => {
                    let rentalEvents = response2.data;
    
                    let rentalEvent = rentalEvents.find( rentalEvent => rentalEvent.vehicle_id == v.id && isAfterNow(rentalEvent.end_time));
                    
                    if(rentalEvent){
                        v.rented = true;
                        v.rented_until = rentalEvent.end_time; 
                    }

                    setVehicle(v);
                })
            });
        }
    }, [params.id]);

    const rentVehicleHandler = (e) => {
        e.stopPropagation() 
        
        navigate(`/vehicle/${vehicle.id}/rent`);
    }

    const editVehicleHandler = (e) => {
        e.stopPropagation() 
        
        navigate(`/vehicle/${vehicle.id}/edit`);
    }

    const deleteVehicleHandler = (id, e) => {
        e.stopPropagation();

        deleteVehicle(id).then(
            navigate(`/vehicles`)
        );
    }

    if(!vehicle)
        return null;

    return (
        <div>
            <Row className="text-start justify-content-center">
                <Col xxl='8' xs='10'>
                    <small className="text-muted">Last updated {formatDate(vehicle.updated_at)}</small>
                </Col>
            </Row>
            <Row className="text-start justify-content-center mt-4">
                <Col xxl='8' xs='10'>
                    <h1><b>{vehicle.brand} {vehicle.model}</b></h1>
                </Col>
            </Row>
            <Row className="mt-4 justify-content-center">
                <Col xxl={{ span: '4', order: 'first' }} xs={{ span: '10', order: 'second' }}>
                    <ListGroup as="ul" className="bg-light shadow rounded-0">
                        <ListGroup.Item as="li" active>
                            <h3><b>${vehicle.price_per_day} per day</b></h3>
                        </ListGroup.Item>
                        <ListGroup.Item as="li"><b>Brand:</b> {vehicle.brand}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Model:</b> {vehicle.model}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Type:</b> {vehicle.type}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Fuel type:</b> {vehicle.fuel_type}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Seats:</b> {vehicle.seats}</ListGroup.Item>
                        <ListGroup.Item as="li">        
                            { loggedUser?.role === 'admin' ? 
                                (
                                    vehicle.rented ?
                                    (
                                        <ButtonGroup>
                                            <Button variant="outline-dark" disabled onClick={ (e) => rentVehicleHandler(e) }>RENTED</Button>
                                            <Button variant="dark" onClick={(e) => editVehicleHandler(e) }>Edit</Button>
                                            <Button variant="danger" onClick={(e) => deleteVehicle(vehicle.id, e)}>Delete</Button>
                                        </ButtonGroup>
                                    ) :
                                    (
                                        <ButtonGroup>
                                            <Button variant="outline-primary" disabled onClick={ (e) => rentVehicleHandler(e) }>FOR RENT</Button>
                                            <Button variant="dark" onClick={(e) => editVehicleHandler(e) }>Edit</Button>
                                            <Button variant="danger" onClick={(e) => deleteVehicle(vehicle.id, e)}>Delete</Button>
                                        </ButtonGroup>
                                    )
                                ) :
                                (
                                    vehicle.rented ?
                                    (
                                        <Button variant="outline-primary" disabled onClick={ (e) => rentVehicleHandler(e) }>RENTED UNTIL {vehicle.rented_until}</Button>
                                    ) :
                                    (
                                        <Button variant="primary" onClick={ (e) => rentVehicleHandler(e) }>Rent Vehicle</Button>
                                    )
                                )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col xxl={{ span: '4', order: 'second' }}  xs={{ span: '10', order: 'first' }}>
                    <img className="shadow" src={vehicle.picture} style={{width: '100%', height: '250px', objectFit: 'cover'}}></img>
                </Col>
            </Row>
        </div>
    )
}