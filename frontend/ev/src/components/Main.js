import React from "react";
import {useHistory} from 'react-router-dom';

function MainPage(){
    const history = useHistory();

    const Redirectuser =  ()=> {
        history.push('/user/login');
    }

    const Redirectstation = ()=> {
      history.push('/admin');
    }

    return(
        <div>
          <button onClick={Redirectuser}>User</button>
          <button onClick={Redirectstation}>Charging Station</button>
        </div>
    );
};

export default MainPage;