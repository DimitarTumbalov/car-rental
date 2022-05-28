import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import { useNavigate, useParams } from "react-router-dom";
import './VehicleForm.scss';
import { getVehicleById, saveVehicle } from "../../../utils/http-utils/vehicles-requests";
import { Col, Row } from "react-bootstrap";

export function VehicleForm() {
    const navigate = useNavigate();
    const params = useParams();

    const [vehicle, setVehicle] = useState({
        brand: '',
        model: '',
        type: '',
        picture: '',
        fuel_type: '',
        price_per_day: 0,
        seats: ''
    });

    useEffect(() => {
        if (params.id) {
            getVehicleById(params.id).then((response) => {
                setVehicle(response.data);
            });
        }
    }, [params.id]);

    const onInputChange = (event) => {

        console.log(event.target.name + ": " + event.target.value)

        setVehicle((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }

    const onVehicleSubmit = (event) => {
        event.preventDefault();

        saveVehicle(vehicle).then(() => {
            navigate('/vehicles-list');
        });
    }

    return (
        <Row className="login-wrapper-container justify-content-center align-content-center">
            <Col md="auto">
                <Form onSubmit={onVehicleSubmit} className="bg-light p-4 shadow">
                <h3 className="mb-3">Create vehicle</h3>

                    <Form.Group className="mt-2 text-start" controlId="formBasicBrand">
                        <Form.Label>Brand</Form.Label>
                        <Form.Select name="brand" value={vehicle.brand} onChange={onInputChange}>
                            <option>Select brand</option>
                            <option value="opel">Opel</option>
                            <option value="bmw">BMW</option>
                            <option value="ford">Ford</option>
                            <option value="toyota">Toyota</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicModel">
                        <Form.Label>Model</Form.Label>
                        <Form.Control value={vehicle.model} onChange={onInputChange} name="model" type="text" placeholder="Enter model" />
                    </Form.Group>


                    <Form.Group className="mt-2 text-start" controlId="formBasicType">
                        <Form.Label>Type</Form.Label>
                        <Form.Select name="type" value={vehicle.type} onChange={onInputChange}>
                            <option>Select type</option>
                            <option value="economy">Economy</option>
                            <option value="estate">Estate</option>
                            <option value="luxury">Luxury</option>
                            <option value="suv">Suv</option>
                            <option value="cargo">Cargo</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPictureURL">
                        <Form.Label>Picture URL</Form.Label>
                        <Form.Control value={vehicle.picture} onChange={onInputChange} name="picture" type="text" placeholder="Enter picture URL" />
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicFuelType">
                        <Form.Label>Fuel type</Form.Label>
                        <Form.Select name="fuel_type" value={vehicle.fuel_type} onChange={onInputChange}>
                            <option>Select fuel type</option>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="electric">Electric</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicSeats">
                        <Form.Label>Number of seats</Form.Label>
                        <Form.Select name="seats" value={vehicle.seats} onChange={onInputChange}>
                            <option>Select number of seats</option>
                            <option value={2}>2</option>
                            <option value={4}>4</option>
                            <option value={6}>6</option>
                            <option value={8}>8</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPricePerDay">
                        <Form.Label>Price per day</Form.Label>
                        <Form.Control name="price_per_day" type="number" min="0.00" step="0.01" placeholder="Enter price per day" value={vehicle.price_per_day} onChange={onInputChange} />
                    </Form.Group>

                    <Button variant="primary" className="mt-4" type="submit">{vehicle.id ? 'Edit' : 'Create'}</Button>

                </Form>
            </Col>
        </Row>
    );
}