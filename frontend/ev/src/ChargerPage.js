import React from "react";
import {useHistory} from 'react-router-dom';
// import { FaUserLock,FaChargingStation } from "react-icons/fa";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import './Main.css';

function ChargerPage(){
    const history = useHistory();

    const Redirectuser =  ()=> {
        history.push('/admin/login');
    }

    const Redirectstation = ()=> {
      history.push('/admin/register');
    }

    return(
      <div className="rt">
        <Container fluid className="h-100">
          <Row className="h-auto">
            <Col sm={0} md={3}></Col>
            <Col sm={12} md={6} className="d-flex align-items-center justify-content-center" >
              <button onClick={Redirectuser} className="m-2 p-4" style={{"backgroundColor":"#066764","opacity":"90%","border":"none" }} >
                {/* <FaUserLock style={{fontSize: '200px',color:"white"}} /> */}
                {/* <br></br> */}
                <p style={{'color':"white"}}> User Login </p>
              </button>
              <button onClick={Redirectstation} className="m-2 p-4" style={{"backgroundColor":"#066764","opacity":"90%","border":"none" }}>
                {/* <FaChargingStation style={{fontSize: '200px',color:"white"}}/> */}
                {/* <br></br> */}
                <p style={{'color':"white"}} > User Register </p>
              </button>
            </Col>
            <Col sm={0} md={3}></Col>
          </Row>
        </Container>
      </div>
    );
};

export default ChargerPage;