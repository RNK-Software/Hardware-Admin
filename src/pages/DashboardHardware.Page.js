import React from 'react';

import Hardwares from "../Components/Hardwares.Component";



const Dashboard = (props) => {

    const handleMapClick = (event) => {
        console.log(event.latLng.lat());
    }
    
    return (
        <React.Fragment>
            <Hardwares />
        </React.Fragment>

    );
};

export default Dashboard;