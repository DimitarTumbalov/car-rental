import { useEffect, useState } from 'react';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { saveRentalEvent } from '../../../utils/http-utils/rental-events-requests';
import { getVehicleById } from '../../../utils/http-utils/vehicles-requests';
import './RentalEventForm.scss'
import Datetime from 'react-datetime';
import moment from 'moment';
import { timeMilliesToDate } from '../../../utils/ui-utils/date-formatter';
import { getLoggedUser } from '../../../utils/http-utils/user-requests';

export function RentalEventForm(){
    const navigate = useNavigate();
    const params = useParams();

    const vehicle_id = params.id;

    const [rental_event, setRentalEvent] = useState({
        start_time: '',
        end_time: '',
        user_id: getLoggedUser()?.id,
        vehicle_id: vehicle_id
    });

    const [vehicle, setVehicle] = useState(null);

    useEffect(() => {
        if (vehicle_id) {
            getVehicleById(vehicle_id).then((response) => {
                setVehicle(response.data);
            });
        }

    }, [vehicle_id]);

    const onInputChange = (dateTime, target) => {
        let time = timeMilliesToDate(dateTime.getTime());

        setRentalEvent((prevState) => ({
            ...prevState,
            [target]: time
        }));
    }

    const onRentaEventSubmit = (event) => {
        event.preventDefault();

        saveRentalEvent(rental_event).then(() => {
            navigate('/rental-events');
        })
    }

    const valid = (current) => {
        let yesterday = moment().subtract( 1, 'day' );
        return current.isAfter( yesterday );
    };

    let inputPropsStartTime = {
        placeholder: 'Start time'
    };

    let inputPropsEndTime = {
        placeholder: 'End time'
    };

    if(!vehicle)
        return null;

    return (
        <div>
            <Row className="login-wrapper-container justify-content-center align-content-center">
                <Col xs='auto' sm='10' xxl='8'>
                    <Form className="bg-light p-4 shadow" onSubmit={ onRentaEventSubmit } >
                    <h3 className="mb-3">{rental_event.id ? 'Edit rental event' : 'Rent vehicle'}</h3>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail" className='text-start'>
                                <Form.Label>Start time</Form.Label>
                                <Datetime utc='true' locale="bg" isValidDate={ valid }
                                 inputProps={ inputPropsStartTime } onChange={ (m) => onInputChange(m.toDate(), 'start_time') } />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword" className='text-start'>
                                <Form.Label>End time</Form.Label>
                                <Datetime utc='true' locale="bg" isValidDate={ valid }
                                 inputProps={ inputPropsEndTime } onChange={ (m) => onInputChange(m.toDate(), 'end_time') }></Datetime>
                            </Form.Group>
                        </Row>

                        <Button size='lg' variant="primary" className="mt-4" type="submit">{rental_event.id ? 'Save changes' : 'Rent'}</Button>

                    </Form>
                </Col>
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
                    </ListGroup>
                </Col>

                <Col xxl={{ span: '4', order: 'second' }}  xs={{ span: '10', order: 'first' }}>
                    <img className="shadow" src={vehicle.picture} style={{width: '100%', height: '250px', objectFit: 'cover'}}></img>
                </Col>
            </Row>
        </div>

    );
}