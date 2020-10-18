import React, { useState, useEffect } from "react";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Spinner, Row, Col, Alert, Form, FormGroup, Label, Input } from 'reactstrap';
import * as firebase from '../utilities/firebase';
import ImageUploader from 'react-images-upload';

function Items() {
    const [products, setProducts] = useState([]);
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [product, setProduct] = useState('');

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(0);
    const [alertMsg, setAlertMsg] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [picture, setPicture] = useState([]);

    const [done, setDone] = useState(false);



    const validate = () => {
        let error = false;
        let alertMsg = "";
        if (name.length < 1) {
            error = true;
            alertMsg = "Name can not be empty";
        }
        else if (price < 0) {
            error = true;
            alertMsg = "Price can not be negative";
        }
        else if (price.length < 1) {
            error = true;
            alertMsg = "Price can't be empty";
        }
        else if (description.length < 10) {
            error = true;
            alertMsg = "Description should be longer than 10 characters";
        }
        setAlertMsg(alertMsg);
        return error;
    }

    const onDrop = (picture) => {
        setPicture(picture);
    }

    const onDelete = (evt) => {
        evt.preventDefault();

        var deleteRef = firebase.storage.ref('products/' + product.pictureName);
        deleteRef.delete().then(() => {
            console.log("deleted in delete");
        }).catch(err => console.log(err));

        firebase.firestore.collection('products').doc(product.id).delete().then(() => {
            console.log("deleted");
            setDone(!done);
        }).catch(err => console.log(err));
    }

    const Edit = (evt) => {
        evt.preventDefault();
        console.log(product);
        const error = validate();
        setLoading(true);
        setAlert(0);
        if (!error) {
            if (picture) {
                //deleting existing picture from storage
                var deleteRef = firebase.storage.ref('products/' + product.pictureName);
                deleteRef.delete().then(() => {
                    console.log("deleted in edit");
                }).catch(err => console.log(err));

                //uploading the new picture
                var addRef = firebase.storage.ref('products/' + picture[0].name);
                addRef.put(picture[0]).then((res) => {
                    res.ref.getDownloadURL().then((url) => {
                        const updatedProduct = {
                            name: name,
                            price: price,
                            description: description,
                            pictureUrl: url,
                            pictureName: picture[0].name
                        };
                        firebase.firestore.collection('products').doc(product.id).set(updatedProduct).then(() => {
                            console.log("Updated with image url");
                            setLoading(false);
                            setDone(!done);

                        }
                        ).catch(e => console.log(e));
                    })
                }).catch(err => console.log(err));

            } else {
                const updatedProduct = {
                    name: name,
                    description: description,
                    pictureUrl: product.pictureUrl,
                    price: price,
                    pictureName: product.pictureName
                }
                firebase.firestore.collection('products').doc(product.id).set(updatedProduct).then((res) => {
                    setLoading(false);
                    console.log("Updating done");
                    setDone(!done);
                }).catch(err => console.log(err));
            }

            //Update firebase

            // picture.map((pic) => {
            //     var ref = firebase.storage.ref('products/' + pic.name);
            //     ref.put(pic).then((res) => {
            //         res.ref.getDownloadURL().then((url) => {
            //             const obj = {
            //                 name: name,
            //                 price: price,
            //                 description: description,
            //                 type: "Hardware",
            //                 pictureUrl: url
            //             };
            //             firebase.firestore.collection('products').doc().set(obj).then(() => {
            //                 console.log("success");
            //                 setLoading(false);

            //             }
            //             ).catch(e => console.log(e));
            //         })
            //     }).catch(err => console.log(err));
            // })
            //console.log(picture);
        }
        else {
            setAlert(1);
            setLoading(false);
        }
    }

    useEffect(() => {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setPicture(product.picture);

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
                    pictureUrl: doc.data().pictureUrl,
                    pictureName: doc.data().pictureName
                });
            });
            setProducts(data);
        });
    }, [product, done]);

    const toggle = () => setModal(!modal);
    const toggle2 = () => setModal2(!modal2);

    const onEdit = (id) => {
        setProduct(products.find(product => product.id === id));
        toggle();
    }

    return (
        <React.Fragment>
            <Modal isOpen={modal2} toggle={toggle2}>
                <ModalHeader toggle={toggle2}>Are you sure?</ModalHeader>
                <ModalBody>

                </ModalBody>
                <ModalFooter>
                    <Button outline color="danger" onClick={onDelete} block>Yes</Button>

                    <Button outline color="dark" onClick={toggle2} block>Cancel</Button>
                </ModalFooter>
            </Modal>


            <Modal isOpen={modal} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>Edit your product here</ModalHeader>
                <ModalBody>
                    <center><img src={product.pictureUrl} alt="image" style={{ width: 200, height: 200 }} /></center>
                    <Row>
                        <Col xs="12" sm="2">
                        </Col>
                        <Col xs="12" sm="8">
                            <div className="center2">
                                <Form id="form" >
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <FormGroup>
                                                <Label for="name">ITEM NAME</Label>
                                                <Input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <FormGroup>
                                                <Label for="name">ITEM DESCRIPTION</Label>
                                                <Input type="textarea" style={{ height: 150 }} name="name" value={description} id="name" placeholder="Input the item description here" onChange={e => setDescription(e.target.value)} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs="12" sm="12">
                                            <FormGroup>
                                                <Label for="name">PRICE</Label>
                                                <Input type="number" name="name" id="name" value={price} placeholder="Input the price here" onChange={e => setPrice(e.target.value)} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <ImageUploader
                                        withIcon={true}
                                        withPreview={true}
                                        buttonText='Choose a image'
                                        onChange={onDrop}
                                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                        maxFileSize={5242880}
                                        label="Upload a Image here"
                                    />
                                    <br />
                                    <Row xs="12" sm="12">
                                        <center>
                                            {loading ?
                                                <Spinner animation="border" className="spinner2" alignItems="center" />
                                                : null}
                                        </center>
                                    </Row>
                                    {alert === 1 ?
                                        <Alert color="danger" status={alert}>
                                            {alertMsg}
                                        </Alert>
                                        : null}
                                    <Row>
                                        <Col xs="6" sm="6">

                                        </Col>
                                        <Col xs="6" sm="6">

                                        </Col>
                                    </Row>
                                    <br /><br />
                                </Form>
                            </div>
                        </Col>
                        <Col xs="12" sm="2">
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button outline color="danger" onClick={toggle2} block>Delete</Button>
                    <Button outline color="primary" onClick={Edit} block>Edit</Button>
                    <Button outline color="dark" onClick={toggle} block>Cancel</Button>
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