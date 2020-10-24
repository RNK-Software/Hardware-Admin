import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import API_KEY from '../utilities/maps';




const Map = (props) => {
    const [width, setWidth] = useState(window.innerWidth);


    

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });


  

    const containerStyle = {
        width: props.width ? props.width : width,
        height: props.height
    };
    
    const center = {
        lat: props.marker ? props.marker.lat : props.lat,
        lng: props.marker ? props.marker.lng : props.lan
    };
    
    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap onClick={props.onClick} mapContainerStyle={containerStyle} center={center} zoom={10}>
                {props.markers ? ( props.markers.length >= 1 ? props.markers.map(marker => <Marker label={marker.name} position={marker} />) : <Marker position={props.markers}/> ): null}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;