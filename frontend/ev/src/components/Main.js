import React from "react";
import {Route} from 'react-router-dom';
import LoginAdmin from './LoginAdmin';
import LoginUser from './LoginUser';
import Register from './RegPage';
import {Link} from 'react-router-dom';
import Map from './Mapp';

const mainPage = ()=>{
    return(
        <>
        <Route path="/user/login">
      <LoginUser />
    </Route>
    <Route path="/admin/login">
      <LoginAdmin />
    </Route>
    <Route path="/register">
     <Register/>
   </Route>
   <Route path="/map">
     <Map />
   </Route>
   </>
    );
};

export default mainPage;