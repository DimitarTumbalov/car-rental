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
        constructionYear: '1990',
        type: '',
        picture: '',
        fuelType: '',
        pricePerDay: '100',
        seats: '',
        updatedAt: ''
    });
    const [maxConstructionYear, setMaxConstructionYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (params.id) {
            getVehicleById(params.id).then((response) => {
                setVehicle(response.data);
            });
        }
    }, [params.id]);

    const onInputChange = (event) => {
        setVehicle((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }

    const onVehicleSubmit = (event) => {
        event.preventDefault();

        saveVehicle(vehicle).then(() => {
            navigate('/vehicles');
        })
    }

    if(!vehicle)
        return null;

    return (
        <Row className="login-wrapper-container justify-content-center align-content-center">
            <Col xs='10' sm='8' md='6' lg='4' xxl='3'>
                <Form onSubmit={onVehicleSubmit} className="bg-light p-4 shadow">
                <h3 className="mb-3">{vehicle.id ? 'Edit vehicle' : 'Create vehicle'}</h3>

                    <Form.Group className="mt-2 text-start" controlId="formBasicBrand">
                        <Form.Label>Brand*</Form.Label>
                        <Form.Select name="brand" value={vehicle.brand} onChange={onInputChange} required>
                            <option value="" disabled>Select brand</option>
                            <option value="Audi">Audi</option>
                            <option value="BMW">BMW</option>
                            <option value="Ford">Ford</option>
                            <option value="Mercedes-Benz">Mercedes-Benz</option>
                            <option value="Nissan">Nissan</option>
                            <option value="Subaru">Subaru</option>
                            <option value="Tesla">Tesla</option>
                            <option value="Toyota">Toyota</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicModel">
                        <Form.Label>Model*</Form.Label>
                        <Form.Control maxLength={20} value={vehicle.model} onChange={onInputChange} name="model" type="text" placeholder="Enter model" required />
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPricePerDay">
                        <Form.Label>Construction year*</Form.Label>
                        <Form.Control name="constructionYear" type="number" min="1990" step='1' max={maxConstructionYear} placeholder="Enter construction year"
                        value={vehicle.constructionYear} onChange={onInputChange} required />
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicType">
                        <Form.Label>Type*</Form.Label>
                        <Form.Select name="type" value={vehicle.type} onChange={onInputChange} required>
                            <option value="" disabled>Select type</option>
                            <option value="Economy">Economy</option>
                            <option value="Estate">Estate</option>
                            <option value="Luxury">Luxury</option>
                            <option value="SUV">SUV</option>
                            <option value="Cargo">Cargo</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPictureURL">
                        <Form.Label>Picture URL</Form.Label>
                        <Form.Control value={vehicle.picture} onChange={onInputChange} name="picture" type="text" placeholder="Enter picture URL" />
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicFuelType">
                        <Form.Label>Fuel type*</Form.Label>
                        <Form.Select name="fuelType" value={vehicle.fuelType} onChange={onInputChange} required>
                            <option value="" disabled>Select fuel type</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Electric">Electric</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicSeats">
                        <Form.Label>Number of seats*</Form.Label>
                        <Form.Select name="seats" value={vehicle.seats} onChange={onInputChange} required>
                            <option value='' disabled>Select number of seats</option>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='6'>6</option>
                            <option value='8'>8</option>
                            <option value='12'>12</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mt-2 text-start" controlId="formBasicPricePerDay">
                        <Form.Label>Price per day*</Form.Label>
                        <Form.Control name="pricePerDay" type="number" min="1.00" step="0.01" max="1000000" placeholder="Enter price per day" value={vehicle.pricePerDay} onChange={onInputChange} required />
                    </Form.Group>

                    <Button size="lg" variant="primary" className="mt-4" type="submit">{vehicle.id ? 'Save changes' : 'Create vehicle'}</Button>

                </Form>
            </Col>
        </Row>
    );
}