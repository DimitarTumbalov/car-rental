import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, ListGroup, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicleById } from "../../../utils/http-utils/vehicles-requests";
import { deleteVehicle } from "../../../utils/http-utils/vehicles-requests";
import './Vehicle.scss'

export function Vehicle(){

    const params = useParams();
    const [vehicle, setVehicle] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (params.id) {
            getVehicleById(params.id).then((response) => {
                setVehicle(response.data);
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
            <Row>
                <Col><h1><b>{vehicle.brand}</b> {vehicle.model}</h1></Col>
            </Row>
            <Row className="mt-2 justify-content-center">
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
                            <ButtonGroup>
                                <Button variant="primary" onClick={ (e) => rentVehicleHandler(e) }>Rent</Button>
                                <Button variant="dark" onClick={ (e) => editVehicleHandler(e) }>Edit</Button> 
                                <Button variant="danger" onClick={(e) => deleteVehicleHandler(vehicle.id, e)}>Delete</Button>
                            </ButtonGroup>
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