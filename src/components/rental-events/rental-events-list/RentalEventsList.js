import './RentalEventsList.scss'
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { deleteRentalEvent, getAllRentalEvents } from "../../../utils/http-utils/rental-events-requests"
import { getLoggedUser } from '../../../utils/http-utils/user-requests';
import { RentalEventCard } from '../rental-event-card/RentalEventCard';
import { getAllVehicles } from '../../../utils/http-utils/vehicles-requests';
import { isAfterNow } from '../../../utils/ui-utils/date-formatter';

export function RentalEventsList(){
    const [rentalEvents, setRentalEvents] = useState([]);
    const [sort, setSort] = useState('');
    const loggedUser = getLoggedUser();
    const [deleteModal, setDeleteModal] = useState({show: false, id: null});
    
    useEffect(() => {
        getAllRentalEvents().then(response => {
            const allRentalEvents = response.data;

            getAllVehicles().then(response2 => {
                let allVehicles = response2.data;

                allRentalEvents.forEach(rentalEvent => {
                    let picture = allVehicles.find( v => v.id == rentalEvent?.vehicleId)?.picture
                    rentalEvent.picture = picture;

                    if(isAfterNow(rentalEvent.endTime))
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

    const showDeleteModalHandler = (id, e) => {
        e.stopPropagation();
        
        setDeleteModal({
            show: true,
            id: id
        });
    }

    const closeDeleteModalHandler = (confirmed) => {
        if(confirmed)
            deleteRentalEventHandler(deleteModal.id);
        else
            setDeleteModal({show: false,  id: null });
    }

    const deleteRentalEventHandler = async () => {
        await deleteRentalEvent(deleteModal.id);

        setRentalEvents(prevState => {
            return prevState.filter(rentalEvent => rentalEvent.id !== deleteModal.id)
        });

       setDeleteModal({show: false,  id: null });
    }

    const onSortChange = (e) => {
        setSort(e.target.value)
    }

    const sortRentalEvents = () => {
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
                    <h3><b>
                        { loggedUser.role === 'admin' ? 
                            (
                                rentalEvents.length ?
                                    (
                                        `Rented vehicles (${rentalEvents?.filter( rentalEvent => !rentalEvent.expired ).length})`
                                    )
                                    : 
                                    (
                                        'Rented vehicles'
                                    )

                            ) :
                            (
                                rentalEvents.length ?
                                    (
                                        `My rented vehicles (${rentalEvents?.filter( rentalEvent => rentalEvent.userId == loggedUser.id && !rentalEvent.expired ).length})`
                                    )
                                    : 
                                    (
                                        'My rented vehicles'
                                    )
                            )
                            
                        }
                    </b></h3>
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
                    ?.map(rentalEvent => <RentalEventCard key={rentalEvent.id} rentalEvent={rentalEvent} deleteRentalEvent={ showDeleteModalHandler } /> )
                ) : (
                    rentalEvents
                    ?.filter( rentalEvent => rentalEvent.userId == loggedUser.id)
                    ?.map(rentalEvent => <RentalEventCard key={rentalEvent.id} rentalEvent={rentalEvent} deleteRentalEvent={ showDeleteModalHandler } /> )
                )}
            </Stack>
            <Modal show={deleteModal.show} onHide={() => closeDeleteModalHandler(false)} centered>
                <Modal.Header closeButton>
                <Modal.Title>Cancel rental event</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to cancel this rental event?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => closeDeleteModalHandler(false)}>
                    Abort
                </Button>
                <Button variant="danger" onClick={() => closeDeleteModalHandler(true)}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}