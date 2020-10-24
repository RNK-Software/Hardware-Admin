import React, { useState } from "react";
import { Container, Spinner, Row, Col, Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as firebase from '../utilities/firebase';

function AddFormCategory() {

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(0);
    const [alertMsg, setAlertMsg] = useState("");
    const [name, setName] = useState("");

    const validate = () => {
        let error = false;
        let alertMsg = "";
        if (name.length < 1) {
            error = true;
            alertMsg = "Name can not be empty";
        }
        setAlertMsg(alertMsg);
        return error;
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
            const obj = {
                name: name,
                type: "Hardware"
            };
            firebase.firestore.collection('categories').doc().set(obj).then(() => {
                console.log("success");
                setLoading(false);
                reset();
            }
            ).catch(e => console.log(e));
        }
        else {
            setAlert(1);
            setLoading(false);
        }
    }

    if(loading){
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
            <Container>
                <Row>
                    <Col xs="12" sm="2">
                    </Col>
                    <Col xs="12" sm="8">
                        <div className="center2">
                            <Form id="form" onSubmit={handleSubmit}>
                                <br />
                                <Row>
                                    <Col xs="12" sm="12">
                                        <FormGroup>
                                            <Label for="name">CATEGORY NAME</Label>
                                            <Input type="text" name="name" id="name" placeholder="Input the category name here" onChange={e => setName(e.target.value)} />
                                        </FormGroup>
                                    </Col>
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
                                <br/><br/>
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

export default AddFormCategory;