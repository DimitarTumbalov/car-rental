import { useEffect, useState } from 'react';
import { Button, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllRentalEvents, getRentalEventByuserId, saveRentalEvent } from '../../../utils/http-utils/rental-events-requests';
import { getVehicleById } from '../../../utils/http-utils/vehicles-requests';
import './RentalEventForm.scss'
import Datetime from 'react-datetime';
import moment from 'moment';
import { convertStringToDate, formatter, formatter2, formatter3, getDaysBetween, isAfter, isAfterNow, timeMilliesToDateObject } from '../../../utils/ui-utils/date-formatter';
import { getLoggedUser } from '../../../utils/http-utils/user-requests';

export function RentalEventForm(){
    const navigate = useNavigate();
    const params = useParams();
    const loggedUser = getLoggedUser();
    const vehicleId = params.id;

    const [rentalEvent, setRentalEvent] = useState({
        startTime: '',
        endTime: '',
        userId: getLoggedUser()?.id,
        vehicleId: vehicleId
    });
    const [vehicle, setVehicle] = useState(null);
    const [rent_value, setRentValue] = useState('Rent');
    const [form_message, setFormMessage] = useState('');
    const [rentedCount, setRentedCount] = useState(0);

    useEffect(() => {
        if(loggedUser.role != 'user')
            return navigate(`/vehicles`);

        getAllRentalEvents().then(response => {
            let allRentalEvents = response.data;
            
            let now = new Date();
            
            // Get the number of recent rental events for this user
            let recentRentalEvents = allRentalEvents.filter( rE => rE.userId == loggedUser.id
                 && ((getDaysBetween(now, convertStringToDate(rE.startTime)) < 60) || getDaysBetween(now, convertStringToDate(rE.endTime)) < 60)) ;

            setRentedCount(recentRentalEvents.length) 
        })

    }, [])

    useEffect(() => {
        if (vehicleId) {
            getVehicleById(vehicleId).then((response) => {
                setVehicle(response.data);
            });
        }

    }, [vehicleId]);

    useEffect(() => {
        if(rentalEvent.startTime != '' && rentalEvent.endTime != '' && isAfterNow(rentalEvent.startTime) && isAfter(rentalEvent.endTime, rentalEvent.startTime)){
            let startDate = convertStringToDate(rentalEvent.startTime);
            let endDate = convertStringToDate(rentalEvent.endTime);

            let days = getDaysBetween(startDate, endDate) + 1;

            // More than 3 days - 5% discount
            // More than 5 days - 7% discount
            // More than 10 days - 10% discount
            // If a customer has rented a vehicle more than 3 times in the last 60 days, they would be designated as 
            // VIP customers and get a discount of 15%

            let discount = 0;

            if(rentedCount > 3){
                discount = 15
                setFormMessage('15% discount appplied');
            }else{
                    
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
            }

            let price = days * vehicle.pricePerDay;

            if(discount > 0) 
                price = price - (price * discount) / 100;

            setRentValue(`Rent for $${price.toFixed(2)}`);
        }else {
            if(rentalEvent.startTime != '' && rentalEvent.endTime != '')
                setFormMessage('Please choose a valid period in the future');    
            else
                setFormMessage('');

            setRentValue('Rent');
        }

    }, [rentalEvent]);

    const onInputChange = (dateTime, target) => {
        let time = timeMilliesToDateObject(dateTime.getTime());
        
        setRentalEvent((prevState) => ({
            ...prevState,
            [target]: time
        }));
    }

    const onRentaEventSubmit = (event) => {
        event.preventDefault();

        saveRentalEvent(rentalEvent, vehicle.pricePerDay, rentedCount).then(() => {
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

    let inputPropsendTime = {
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
                    <h3 className="mb-3">{rentalEvent.id ? 'Edit rental event' : 'Rent vehicle'}</h3>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail" className='text-start'>
                                <Form.Label>Start time</Form.Label>
                                <Datetime dateFormat={ formatter3 } timeFormat={ formatter2 } closeOnSelect={ true } isValidDate={ validTime }
                                 inputProps={ inputPropsStartTime } onChange={ (m) => onInputChange(m.toDate(), 'startTime') } />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword" className='text-start'>
                                <Form.Label>End time</Form.Label>
                                <Datetime dateFormat={ formatter3 } timeFormat={ formatter2 } closeOnSelect={ true } isValidDate={ validTime }
                                 inputProps={ inputPropsendTime } onChange={ (m) => onInputChange(m.toDate(), 'endTime') }></Datetime>
                            </Form.Group>
                        </Row>

                        { form_message != '' &&
                            <Form.Control className='text-center' plaintext readOnly value={ form_message }/>
                        }

                        <Button size='lg' variant="primary" className="mt-3" type="submit" 
                            disabled={ rentalEvent.startTime === '' || rentalEvent.endTime === '' || !isAfterNow(rentalEvent.startTime) || !isAfter(rentalEvent.endTime, rentalEvent.startTime) }>
                            { rent_value }
                        </Button>

                    </Form>
                </Col>
            </Row>

            <Row className="mt-2 justify-content-center">
                <Col xxl={{ span: '4', order: 'first' }} xs={{ span: '10', order: 'second' }}>
                    <ListGroup as="ul" className="bg-light shadow rounded-0">
                        <ListGroup.Item as="li" active>
                            <h3><b>${vehicle.pricePerDay} per day</b></h3>
                        </ListGroup.Item>
                        <ListGroup.Item as="li"><b>Brand:</b> {vehicle.brand}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Model:</b> {vehicle.model}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Type:</b> {vehicle.type}</ListGroup.Item>
                        <ListGroup.Item as="li"><b>Fuel type:</b> {vehicle.fuelType}</ListGroup.Item>
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