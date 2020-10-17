import React, { useState } from "react";
import { Container, Spinner, Row, Col, Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import ImageUploader from 'react-images-upload';
import * as firebase from '../utilities/firebase';
function AddForm() {

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(0);
    const [alertMsg, setAlertMsg] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [picture, setPicture] = useState([]);

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

    const reset = (evt) => {
        evt.preventDefault();
        document.getElementById("form").reset();
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const error = validate();
        setLoading(true);
        setAlert(0);
        if (!error) {
            
            
            picture.map((pic) => {
                var ref = firebase.storage.ref('products/' + pic.name);
                ref.put(pic).then((res) => {
                    res.ref.getDownloadURL().then((url) => {
                        const obj = {
                            name: name,
                            price: price,
                            description: description,
                            type: "Hardware",
                            pictureUrl: url
                        };
                        firebase.firestore.collection('products').doc().set(obj).then(() => {
                            console.log("success");
                            setLoading(false);

                        }
                        ).catch(e => console.log(e));
                    })
                }).catch(err => console.log(err));
            })
            //console.log(picture);
        }
        else {
            setAlert(1);
            setLoading(false);
        }
    }

    return (
        <React.Fragment>

            <Container>
                <Row>
                    <Col xs="12" sm="2">
                    </Col>
                    <Col xs="12" sm="8">
                        <div className="center2">
                            <Form id="form" onSubmit={handleSubmit}>
                                <br /><br />
                                <Row>
                                    <Col xs="12" sm="12">
                                        <FormGroup>
                                            <Label for="name">ITEM NAME</Label>
                                            <Input type="text" name="name" id="name" placeholder="Input the item name here" onChange={e => setName(e.target.value)} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="12">
                                        <FormGroup>
                                            <Label for="name">ITEM DESCRIPTION</Label>
                                            <Input type="textarea" style={{ height: 150 }} name="name" id="name" placeholder="Input the item description here" onChange={e => setDescription(e.target.value)} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs="12" sm="12">
                                        <FormGroup>
                                            <Label for="name">PRICE</Label>
                                            <Input type="number" name="name" id="name" placeholder="Input the price here" onChange={e => setPrice(e.target.value)} />
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
                                        <Button outline color="dark" onClick={reset} block>Reset</Button>
                                    </Col>
                                    <Col xs="6" sm="6">
                                        <Button outline color="dark" type="submit" length="100" block>Add</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                    <Col xs="12" sm="2">
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    );

}

export default AddForm;