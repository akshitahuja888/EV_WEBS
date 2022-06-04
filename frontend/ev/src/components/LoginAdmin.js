import React from "react";
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
const fn=() => {

    const loginHandler = (event) =>{
        event.preventDefault();
        // console.log(event);
    }
    const emailChangeHandler = (event) =>{
        console.log(event.target.value);
    }
    const passChangeHandler = (event) =>{
        console.log(event.target.value);
    }

    return(
        <div className="container">
    <Form onSubmit={loginHandler} className="col-12">
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange={emailChangeHandler} />
            <Form.Text className="text-muted">
            We'll never share your email with anyone else.
            </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={passChangeHandler} />
        </Form.Group>
        <Button variant="primary" type="submit">
            Submit
        </Button>
    </Form>
    </div>
    )
}

export default fn;