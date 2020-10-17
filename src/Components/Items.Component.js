import React, { useState, useEffect } from "react";
import { Table,CardDeck, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Container, Spinner, Row, Col, Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import * as firebase from '../utilities/firebase';

function Items() { 
    const [products, setProducts] = useState([]);
    useEffect(() => { 
        let data = [];    
        const db =  firebase.firestore;
        db.settings({ timestampsInSnapshots: true});
        db.collection('products').get().then((snapshot) => {    
            snapshot.docs.forEach(doc => {
                let items = doc.data();
                items = JSON.stringify(items);
                data.push({
                    name: doc.data().name,
                    description: doc.data().description,
                    price: doc.data().price,
                    pictureUrl: doc.data().pictureUrl
                  });
            });
            setProducts(data);
            console.log(products); 
        }, []);        
    });

    return (
        <React.Fragment>
            <Container>
                <Table>
                    <tbody>
                        { products.map(data => (
                            <tr>
                                <td xs="8" sm="8">{data.name}</td>
    
                                <td align ="right"><Button>Edit</Button></td>
                            </tr>   
                        ))}
                    </tbody>  
                </Table>
            </Container>
        </React.Fragment>
    );

}

export default Items;