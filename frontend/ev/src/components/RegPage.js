import React from "react";
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import Menu from "./SelectorMenu";
import { useHistory } from 'react-router-dom';
import { useState } from "react";


const inivals = {
    username:"",
    email:"",
    password:"",
    maxslots:"",
    location:"",
    state:"",
    type:""
}

function Register(){
    const [loginData,setLoginData] = useState(
        localStorage.getItem('loginData')
        ? JSON.parse(localStorage.getItem('loginData'))
        : null);
    const [values,setvalues] = useState(inivals);
    const history = useHistory();

    const registerHandler = async(e) =>{
          e.preventDefault();
          console.log('entered register handler');
          console.log(values);
          const res = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({
              username:values.username,
              email: values.email ,
              password:values.password,
              maxslots:values.maxslots,
              location:values.location,
              state:values.state,
            //   type:values.type
            }),
            headers: {
                'Content-Type': 'application/json',
              }
          });
          console.log(res);
          console.log('ended fetch request');
          const data = await res.json();
          setLoginData(data);

          localStorage.setItem('loginData', JSON.stringify(data));
            console.log('set the local storage:done ');
            console.log('localstorgae is : ',localStorage.getItem('loginData'));
            history.push(`/user/${loginData._id}`);
    }

    const handleChange = (evt) => {
        const { name, value } = evt.target;
            setvalues({
            ...values,
            [name]: value,
            });
    }

    return(
        <div className="container">
            <Form onSubmit={registerHandler} className="col-12">
                <Form.Group className="mb-3" controlId="formBasicNamel">
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="username" type="text" placeholder="Enter Full Name" value={values.username} onChange={handleChange} />
                </Form.Group>
                <Form.Group>
                <Form.Label>Email address</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Enter Email" value={values.email} onChange={handleChange} />
                    </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Password" value={values.password} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLocation">
                    <Form.Label>Location</Form.Label>
                    <Form.Control name="location" type="text" placeholder="Location" value={values.location} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSlots">
                    <Form.Label>Max Slots</Form.Label>
                    <Form.Control name="maxslots" type="number" placeholder="Slot Capacity" value={values.maxslots} onChange={handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicState">
                    <Form.Label>State</Form.Label>
                    <Form.Control name="state" type="text" placeholder="State" value={values.state} onChange={handleChange}/>
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </div>
    )
}

export default Register;