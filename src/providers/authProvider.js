import React, { createContext, useEffect, useState } from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
import * as firebase from '../utilities/firebase';

export const AuthContext = createContext({user: null});

const AuthProvider = (props) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        firebase.auth.onAuthStateChanged((user) => {
            setUser(user);
        });
    });

    return(
        <AuthContext.Provider value={user}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;