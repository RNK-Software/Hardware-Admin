import React from 'react';
import AddFormHardware from '../Components/AddFromHardware.Component';
import Hardwares from "../Components/Hardwares.Component";

const HardwarePage = (props) => {
    return(
        <React.Fragment>
        <Hardwares/>
        <AddFormHardware/>
        </React.Fragment>
    );
};

export default HardwarePage;