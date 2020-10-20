import React, { useState, useEffect } from "react";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Spinner, Row, Col, Alert, Form, FormGroup, Label, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import * as firebase from '../utilities/firebase';
import ImageUploader from 'react-images-upload';
import {
    CHeader,
    CToggler,
    CHeaderBrand,
    CHeaderNav,
    CHeaderNavItem,
    CHeaderNavLink,
    CSubheader,
    CLink
} from '@coreui/react';

function Items() {
    const [products, setProducts] = useState([]);
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [product, setProduct] = useState('');
    const [searchString, setSearchString] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(0);
    const [alertMsg, setAlertMsg] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [picture, setPicture] = useState([]);

    const [done, setDone] = useState(false);
    //for pagination
    const [firstItem, setFirstItem] = useState(null);
    const [lastItem, setLastItem] = useState(null);
    const [disableForward, setDisableForward] = useState(false);
    const [disableBackward, setDisableBackward] = useState(false);
    //Let the user set this if you want 
    const [itemsPerPage, setItemsPerPage] = useState(5);
    //for searching
    const [allProducts, setAllProducts] = useState(null);

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
            toggle2();
            toggle();
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
            toggle();
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
        db.collection('products').orderBy('name').limit(itemsPerPage).get().then((snapshot) => {
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
            if (snapshot.docs.length > 0) {
                setFirstItem(snapshot.docs[0]);
                setLastItem(snapshot.docs[snapshot.docs.length - 1]);
                setProducts(data);

            }
        });
    }, [product, done, itemsPerPage]);

    const togglePaginationForward = () => {
        if (!lastItem) {
            return;
        }
        if (disableBackward)
            setDisableBackward(false);
        let data = [];
        const db = firebase.firestore;
        db.collection('products').orderBy('name').startAfter(lastItem).limit(itemsPerPage).get().then((snapshot) => {
            if (snapshot.docs.length === 0) {
                setDisableForward(true);
                return;
            }
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


            setFirstItem(snapshot.docs[0]);
            setLastItem(snapshot.docs[snapshot.docs.length - 1]);
            setProducts(data);


        });
    };

    const togglePaginationBackward = () => {
        if (!firstItem) {
            return;
        }
        if (disableForward)
            setDisableForward(false);
        let data = [];
        const db = firebase.firestore;
        db.collection('products').orderBy('name').endBefore(firstItem).limit(itemsPerPage).get().then((snapshot) => {
            if (snapshot.docs.length === 0) {
                setDisableBackward(true);
                return;
            }
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
            console.log(data);

            setFirstItem(snapshot.docs[0]);
            setLastItem(snapshot.docs[snapshot.docs.length - 1]);
            setProducts(data);


        });
    }

    const toggle = () => setModal(!modal);
    const toggle2 = () => setModal2(!modal2);

    const onEdit = (id) => {
        setProduct(products.find(product => product.id === id));
        toggle();
    }

    const onSearch = () => {
        let data = [];
        const db = firebase.firestore;
        if (searchString.length === 0) {
            db.collection('products').orderBy('name').limit(itemsPerPage).get().then((snapshot) => {
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
                if (snapshot.docs.length > 0) {
                    setFirstItem(snapshot.docs[0]);
                    setLastItem(snapshot.docs[snapshot.docs.length - 1]);
                    setProducts(data);
                    setDisableBackward(false);
                    setDisableForward(false);

                }
            });
        } else {
            if(allProducts) {
                const filtered = allProducts.filter((product) => product.name.toLowerCase().includes(searchString.toLowerCase()))
                setProducts(filtered);
                setDisableBackward(true);
                setDisableForward(true);
            } else {
                db.collection('products').orderBy('name').get().then((snapshot) => {
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
                    const filtered = data.filter((product) => product.name.toLowerCase().includes(searchString.toLowerCase()))
                    setProducts(filtered);
                    setDisableBackward(true);
                    setDisableForward(true);
                    setAllProducts(data);
    
                });
            }
            
        }
    }

    if(products.length == 0){
        return (
            <div className="center">
                <center>
                    <Spinner animation="border" className="spinner2" alignItems="center" />
                </center>
            </div>
        );
    }

    return (

        <React.Fragment>
            <CSubheader>
                
                <Form className="form-inline">
                    <Row>
                        <Pagination >
                            
                            <Col style={{ padding: '5px' }}></Col>
                                <PaginationItem disabled={disableBackward}>
                                    <PaginationLink onClick={togglePaginationBackward} previous />
                                </PaginationItem>
                                <Input type="select" name="select" id="exampleSelect" onChange={e => setItemsPerPage(parseInt(e.target.value))}>
                                    <option>5</option>
                                    <option>10</option>
                                    <option>20</option>
                                    <option>30</option>
                                    <option>50</option>
                                </Input>
                                <PaginationItem disabled={disableForward}>
                                    <PaginationLink onClick={togglePaginationForward} next />
                                </PaginationItem> 
                            </Pagination>
                        <Col style={{ padding: '15px' }}></Col>
                    </Row>

                    <Col style={{ padding: '5px' }}></Col>
                    <Input size="sm" placeholder="search here" onChange={e => setSearchString(e.target.value)} />
                    <Col style={{ padding: '5px' }}></Col>
                    <Col style={{ padding: '5px' }}></Col>
                    <Button size="sm" onClick={onSearch}>Search</Button>
                    <Col style={{ padding: '10px' }}></Col>
                  
               
                </Form>
               
                
            </CSubheader>
            
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
                        <Col xs="12" sm="2"></Col>
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
                        {products.map((data, index) => {
                            // if (searchString === "") {
                            return (
                                <tr key={data.id}>
                                    <td xs="8" sm="8">{data.name}</td>
                                    <td align="right"><Button onClick={() => { onEdit(data.id) }}>Edit</Button></td>
                                </tr>
                            );
                            // }
                            // else {
                            //     if (data.name.toLowerCase().includes(searchString.toLowerCase())) {
                            //         return (
                            //             <tr key={data.id}>
                            //                 <td xs="8" sm="8">{data.name}</td>
                            //                 <td align="right"><Button onClick={() => { onEdit(data.id) }}>Edit</Button></td>
                            //             </tr>
                            //         );
                            //     }
                            //     else {
                            //         return null;
                            //     }
                            // }
                        })}
                    </tbody>
                </Table>
            </Container>
            
        </React.Fragment>
    );
}

export default Items;