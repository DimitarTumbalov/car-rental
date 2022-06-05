import { useEffect, useState } from 'react';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { saveRentalEvent } from '../../../utils/http-utils/rental-events-requests';
import { getVehicleById } from '../../../utils/http-utils/vehicles-requests';
import './RentalEventForm.scss'
import Datetime from 'react-datetime';
import moment from 'moment';
import { convertStringToDate, getDaysBetween, isAfter, timeMilliesToDate } from '../../../utils/ui-utils/date-formatter';
import { getLoggedUser } from '../../../utils/http-utils/user-requests';

export function RentalEventForm(){
    const navigate = useNavigate();
    const params = useParams();
    const loggedUser = getLoggedUser();
    const vehicle_id = params.id;

    const [rental_event, setRentalEvent] = useState({
        start_time: '',
        end_time: '',
        user_id: getLoggedUser()?.id,
        vehicle_id: vehicle_id
    });

    const [vehicle, setVehicle] = useState(null);

    const [rent_value, setRentValue] = useState('Rent');
    const [form_message, setFormMessage] = useState('');

    useEffect(() => {
        if(loggedUser.role != 'user')
            return navigate(`/vehicles`);
    }, [])

    useEffect(() => {
        if (vehicle_id) {
            getVehicleById(vehicle_id).then((response) => {
                setVehicle(response.data);
            });
        }

    }, [vehicle_id]);

    useEffect(() => {
        if(rental_event.start_time != '' && rental_event.end_time != '' && !isAfter(rental_event.start_time, rental_event.end_time)){
            let startDate = convertStringToDate(rental_event.start_time);
            let endDate = convertStringToDate(rental_event.end_time);

            let days = getDaysBetween(startDate, endDate) + 1;

            // More than 3 days - 5% discount
            // More than 5 days - 7% discount
            // More than 10 days - 10% discount
            // If a customer has rented a vehicle more than 3 times in the last 60 days, they would be designated as 
            // VIP customers and get a discount of 15%

            var discount = 0;

            if(days > 10){
                discount = 10;
                setFormMessage('10% discount appplied');
            }else if (days > 5){
                discount = 7;
                setFormMessage('7% discount applied');
            }else if (days > 3){
                discount = 5;
                setFormMessage('5% discount applied');
            }else {
                setFormMessage('');
            }

            var price = days * vehicle.price_per_day;

            if(discount > 0) 
                price = price - (price * discount) / 100;

            setRentValue(`Rent for $${price.toFixed(2)}`);
            
        }else {
            if(rental_event.start_time != '' && rental_event.end_time != '')
                setFormMessage('Please choose a valid period');    
            else
                setFormMessage('');

            setRentValue('Rent');
        }

    }, [rental_event]);

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

    const validTime = (current) => {
        let yesterday = moment().subtract( 1, 'day' );
        return current.isAfter( yesterday );
    };

    let inputPropsStartTime = {
        placeholder: 'Choose start time',
        readOnly: true
    };

    let inputPropsEndTime = {
        placeholder: 'Choose End time',
        readOnly: true
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
                                <Datetime dateFormat={ 'DD.MM.YY' } timeFormat={ false } closeOnSelect={ true } utc={ true } locale="bg" isValidDate={ validTime }
                                 inputProps={ inputPropsStartTime } onChange={ (m) => onInputChange(m.toDate(), 'start_time') } />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword" className='text-start'>
                                <Form.Label>End time</Form.Label>
                                <Datetime dateFormat={ 'DD.MM.YY' } timeFormat={ false } closeOnSelect={ true } utc={ true } locale="bg" isValidDate={ validTime }
                                 inputProps={ inputPropsEndTime } onChange={ (m) => onInputChange(m.toDate(), 'end_time') }></Datetime>
                            </Form.Group>
                        </Row>

                        { form_message != '' &&
                            <Form.Control className='text-center' plaintext readOnly value={ form_message }/>
                        }

                        <Button size='lg' variant="primary" className="mt-3" type="submit" 
                            disabled={ rental_event.start_time === '' || rental_event.end_time === '' || isAfter(rental_event.start_time, rental_event.end_time) }>
                            { rent_value }
                        </Button>

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