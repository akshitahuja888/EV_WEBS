import React from "react";
// import Main from './components/Main';
// import Navbar from "./components/Navbar";
import {Route,Switch  } from 'react-router-dom';
import LoginAdmin from "./components/LoginAdmin";
import Register from "./components/RegPage";
import Mapp from "./components/Mapp";
import GoogleAuthLogin from "./googleauth";
import MainPage from "./components/Main";

const App = () =>{
  return (
    <div>
      <Switch >
          <Route exact path = "/"><MainPage /></Route>
          <Route exact path="/admin/"></Route>
          <Route exact path="/user/login"><GoogleAuthLogin /></Route>
          <Route exact path="/admin/login"><LoginAdmin /></Route>
          <Route exact path="/admin/register"><Register/></Route>
          <Route exact path="/user/:id" render={routeProps => (<Mapp {...routeProps} />)}></Route>
      </Switch >
      {/* <Navbar /> */}
      {/* <Main /> */}
    </div>
  );
}
export default App;
