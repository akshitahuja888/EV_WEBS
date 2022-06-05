import React from "react";
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';

const fn=() => {
    const registerHandler = (event) =>{
        event.preventDefault();
        // console.log(event);
    }
    const emailChangeHandler = (event) =>{
        console.log(event.target.value);
    }
    const nameChangeHandler = (event) =>{
        console.log(event.target.value);
    }
    const passChangeHandler = (event) =>{
        console.log(event.target.value);
    }
    const lChangeHandler = (event) =>{
        console.log(event.target.value);
    }
    const slotsChangeHandler = (event) =>{
        console.log(event.target.value);
    }
    const stateChangeHandler = (event) =>{
        console.log(event.target.value);
    }

    return(
        <div className="container">
        <Form onSubmit={registerHandler} className="col-12">
        <Form.Group className="mb-3" controlId="formBasicNamel">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Full Name" onChange={nameChangeHandler} />
        </Form.Group>
        <Form.Group>
        <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter Email" onChange={emailChangeHandler} />
            </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={passChangeHandler} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" placeholder="Location" onChange={lChangeHandler} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicSlots">
            <Form.Label>Max Slots</Form.Label>
            <Form.Control type="number" placeholder="Slot Capacity" onChange={slotsChangeHandler}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicState">
            <Form.Label>State</Form.Label>
            <Form.Control type="text" placeholder="State" onChange={stateChangeHandler}/>
        </Form.Group>
        <Button variant="primary" type="submit">
            Submit
        </Button>
    </Form>
    </div>
    )
}

export default fn;