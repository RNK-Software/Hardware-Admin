import React, { useState, useEffect } from "react";
import { Table, Container, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import * as firebase from '../utilities/firebase';

function Items() {
    const [products, setProducts] = useState([]);
    const [modal, setModal] = useState(false);
    const [id, setId]  = useState('');

    useEffect(() => {
        let data = [];
        const db = firebase.firestore;
        db.collection('products').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                let items = doc.data();
                items = JSON.stringify(items);
                data.push({
                    id: doc.id,
                    name: doc.data().name,
                    description: doc.data().description,
                    price: doc.data().price,
                    pictureUrl: doc.data().pictureUrl
                });
            });
            setProducts(data);
        });
    }, []);

    const toggle = () => setModal(!modal);

    const onEdit = (id) => {
        setId(id);
        toggle();
    }

    return (
        <React.Fragment>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                    product id : {id}
        </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <Container>
                <Table>
                    <tbody>
                        {products.map(data => (
                            <tr key={data.id}>
                                <td xs="8" sm="8">{data.name}</td>

                                <td align="right"><Button onClick={() => { onEdit(data.id) }}>Edit</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </React.Fragment>
    );

}

export default Items;