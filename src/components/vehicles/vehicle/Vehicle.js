import './Vehicle.scss'
import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, ListGroup, Modal, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicleById } from "../../../utils/http-utils/vehicles-requests";
import { deleteVehicle } from "../../../utils/http-utils/vehicles-requests";
import { formatDate, isAfter, isAfterNow } from '../../../utils/ui-utils/date-formatter'
import { getLoggedUser } from "../../../utils/http-utils/user-requests";
import { getAllRentalEvents } from "../../../utils/http-utils/rental-events-requests";
import defaultImage from '../../../images/default_image.png';

export function Vehicle(){

    const params = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const loggedUser = getLoggedUser();

    useEffect(() => {
        if (params.id) {
            getVehicleById(params.id).then(response => {
                let v = response.data;

                getAllRentalEvents().then(response2 => {
                    let rentalEvents = response2.data;
    
                    let rentalEvent = rentalEvents.find( rentalEvent => rentalEvent.vehicleId == v.id && isAfterNow(rentalEvent.endTime));
                    
                    if(rentalEvent){
                        v.rented = true;
                        v.rentedUntil = rentalEvent.endTime; 
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

    const showDeleteModalHandler = (e) => {
        e.stopPropagation();
        
        setShowDeleteModal(true);
    }

    const closeDeleteModalHandler = (confirmed) => {
        setShowDeleteModal(false);

        if(confirmed)
            deleteVehicleHandler();
    }

    const deleteVehicleHandler = async () => {
        deleteVehicle(vehicle.id).then(
            navigate(`/vehicles`)
        )   
    }

    if(!vehicle)
        return null;

    return (
        <div>
            <Row className="text-start justify-content-center">
                <Col xxl='8' xs='10'>
                    <small className="text-muted">Last updated {formatDate(vehicle.updatedAt)}</small>
                </Col>
            </Row>
            <Row className="text-start justify-content-center mt-4">
                <Col xxl='8' xs='10'>
                    <h1><b>{vehicle.brand} {vehicle.model}</b></h1>
                </Col>
            </Row>
            <Row className="mt-4 justify-content-center">
                <Col xxl={{ span: '4', order: 'first' }} lg={{ span: '5', order: 'first' }} xs={{ span: '10', order: 'second' }}>
                    <ListGroup as="ul" className="bg-light shadow rounded-0">
                        <ListGroup.Item as="li" active>
                            <h3><b>${vehicle.pricePerDay} per day</b></h3>
                        </ListGroup.Item>
                        <ListGroup.Item as="li"><b>Brand:</b> {vehicle.brand}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Model:</b> {vehicle.model}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Construction year:</b> {vehicle.constructionYear}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Type:</b> {vehicle.type}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Fuel type:</b> {vehicle.fuelType}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Seats:</b> {vehicle.seats}</ListGroup.Item>
                        <ListGroup.Item as="li">        
                            { loggedUser?.role === 'admin' ? 
                                (
                                    <ButtonGroup>
                                        { vehicle.rented ? 
                                            (
                                                <Button variant="outline-dark" disabled>RENTED</Button>
                                            ) : 
                                            (
                                                <Button variant="outline-dark" disabled>FOR RENT</Button>
                                            )
                                        }
                                        <Button variant="dark" onClick={(e) => editVehicleHandler(e) }>Edit</Button>
                                        <Button variant="danger" onClick={(e) => showDeleteModalHandler(e)}>Delete</Button>
                                    </ButtonGroup>
                                ) :
                                (
                                    vehicle.rented ?
                                    (
                                        <Button variant="outline-primary" disabled onClick={ (e) => rentVehicleHandler(e) }>RENTED UNTIL {vehicle.rentedUntil}</Button>
                                    ) :
                                    (
                                        <Button variant="primary" onClick={ (e) => rentVehicleHandler(e) }>Rent Vehicle</Button>
                                    )
                                )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col xxl={{ span: '4', order: 'second' }} lg={{ span: '5', order: 'second' }} xs={{ span: '10', order: 'first' }}>
                    <img className="shadow" src={vehicle.picture ? vehicle.picture : defaultImage} style={{width: '100%', height: '250px', objectFit: 'cover'}}></img>
                </Col>
            </Row>

            <Modal show={showDeleteModal} onHide={() => closeDeleteModalHandler(false)} centered>
                <Modal.Header closeButton>
                <Modal.Title>Delete vehicle</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this vehicle?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => closeDeleteModalHandler(false)}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={() => closeDeleteModalHandler(true)}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}