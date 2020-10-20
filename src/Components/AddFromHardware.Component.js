import React, { useState } from "react";
import { Container, Spinner, Row, Col, Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import * as firebase from '../utilities/firebase';

function AddFormHardware() {

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(0);
    const [alertMsg, setAlertMsg] = useState("");
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");

    const validate = () => {
        let error = false;
        let alertMsg = "";
        if (name.length < 1) {
            error = true;
            alertMsg = "Name can not be empty";
        }
        else if (number < 0) {
            error = true;
            alertMsg = "Please enter a valid mobile number";
        }
        else if (number.length !== 10) {
            error = true;
            alertMsg = "Please enter a valid mobile number";
        }
        else if (number[0] !== "0") {
            error = true;
            alertMsg = "Please enter a valid mobile number";
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
                number: number,
                type: "Hardware"
            };
            firebase.firestore.collection('hardwares').doc().set(obj).then(() => {
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
            <React.Fragment>
                <div className="middle">
                    <Spinner color="dark" style={{ width: '100', height: '100' }}/>
                </div>
            </React.Fragment>
        )
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
                                            <Label for="name">HARDWARE NAME</Label>
                                            <Input type="text" name="name" id="name" placeholder="Input the hardware name here" onChange={e => setName(e.target.value)} />
                                        </FormGroup>
                                    </Col>
                                </Row>
            
                                <Row>
                                    <Col xs="12" sm="12">
                                        <FormGroup>
                                            <Label for="name">HARDWARE CONTACT NUMBER </Label>
                                            <Input type="number" name="name" id="name" placeholder="Input the contact number here (ex: 0713456789)" onChange={e => setNumber(e.target.value)} />
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

export default AddFormHardware;