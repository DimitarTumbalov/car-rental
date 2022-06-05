import './RentalEventsList.scss'
import { useEffect, useState } from "react";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { deleteRentalEvent, getAllRentalEvents } from "../../../utils/http-utils/rental-events-requests"
import { getLoggedUser } from '../../../utils/http-utils/user-requests';
import { RentalEventCard } from '../rental-event-card/RentalEventCard';
import { getAllVehicles } from '../../../utils/http-utils/vehicles-requests';
import { isAfter, isAfterNow } from '../../../utils/ui-utils/date-formatter';

export function RentalEventsList(){
    const [rentalEvents, setRentalEvents] = useState([]);
    const [sort, setSort] = useState('');
    const loggedUser = getLoggedUser();
    
    useEffect(() => {
        getAllRentalEvents().then(response => {
            const allRentalEvents = response.data;

            getAllVehicles().then(response2 => {
                let allVehicles = response2.data;

                allRentalEvents.forEach(rentalEvent => {
                    let picture = allVehicles.find( v => v.id == rentalEvent?.vehicle_id).picture
                    rentalEvent.picture = picture;

                    if(isAfterNow(rentalEvent.end_time))
                        rentalEvent.expired = false;
                    else
                        rentalEvent.expired = true;
                });

                // default sort by active
                allRentalEvents.sort((a, b) => { return a.expired - b.expired});

                setRentalEvents(allRentalEvents);
            })
        });
    
    }, [])

    useEffect(() => {
        sortRentalEvents();
    }, [sort])

    const deleteRentalEventHandler = async (id, e) => {
        e.stopPropagation();

        await deleteRentalEvent(id);
        setRentalEvents(prevState => {
            return prevState.filter(rentalEvent => rentalEvent.id !==id)
        });
    }

    const onSortChange = (e) => {
        setSort(e.target.value)
    }

    const sortRentalEvents = () => {
        console.log(sort);

        if(sort == 'price asc'){
            setRentalEvents( rentalEvents.slice().sort((a,b) => { return a.price - b.price }));
        }else if(sort == 'price desc'){
            setRentalEvents( rentalEvents.slice().sort((a,b) => { return b.price - a.price }));
        }else{
            setRentalEvents( rentalEvents.slice().sort((a,b) => {  return a.expired - b.expired }));
        }
    }

    return (
        <div>
            <Row className="text-start text-center">
                <Col>
                    <h3><b>{loggedUser.role != 'admin' ? 'My ' : '' }Rented vehicels{rentalEvents?.length ? ` (${rentalEvents?.length})` : ''}</b></h3>
                </Col>
            </Row>
            <Row className="justify-content-center mt-2">
                <Col xs='auto'>
                    <Form.Select size="sm" onChange={onSortChange} defaultValue=''>
                        <option value='' disabled>Sort by</option>
                        <option value='active'>Active</option>
                        <option value='price desc'>Price Descending</option>
                        <option value='price asc'>Price Ascending</option>
                    </Form.Select>
                </Col>
            </Row>
            <Stack direction="horizontal" gap={2} className="d-flex flex-wrap justify-content-center mt-3">
                { (loggedUser.role === 'admin') ? (
                    rentalEvents
                    ?.map(rentalEvent => <RentalEventCard key={rentalEvent.id} rentalEvent={rentalEvent} deleteRentalEvent={deleteRentalEventHandler} /> )
                ) : (
                    rentalEvents
                    ?.filter( rentalEvent => rentalEvent.user_id == loggedUser.id)
                    ?.map(rentalEvent => <RentalEventCard key={rentalEvent.id} rentalEvent={rentalEvent} deleteRentalEvent={deleteRentalEventHandler} /> )
                )}
            </Stack>
        </div>
    )
}