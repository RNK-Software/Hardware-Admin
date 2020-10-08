import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Spinner,
  Row,
  Col,
  Alert,
  Button,
  Form,
  FormGroup,
  Input,
} from "reactstrap";

import * as firebase from "./utilities/firebase";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      loading: false,
      alert: 0,
      alertMsg: "",
      Email: "",
      Password: "",
      redirect: null
    };
  }

  // static propTypes = {
  //     isAuthenticated: PropTypes.bool,
  //     error: PropTypes.object.isRequired,
  //     login: PropTypes.func.isRequired,
  //     clearErrors: PropTypes.func.isRequired
  // };

  // componentDidUpdate(prevProps) {
  //     const { error } = this.props;
  //     if(error !== prevProps.error) {
  //       //Check login errors
  //       if(error.id === 'LOGIN_FAIL') {
  //         this.setState({
  //             alertMsg: error.msg.message,
  //             alert: 1
  //         });
  //       }
  //       else {
  //         this.setState({ alertMsg: null });
  //       }
  //     }
  // }

  // closeAlert = () => {
  //     this.setState({ alert: 0 });
  // };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // reset = e => {
  //     this.setState({
  //         alert: 0,
  //         alertMsg: "",
  //         email: "",
  //         password: "",
  //     });
  //     document.getElementById("form").reset();
  // };

  // validate = () => {
  //     let error = false;
  //     let alertMsg = "";
  //     if (this.state.email.length < 1) {
  //         error = true;
  //         alertMsg = "Enter Email";
  //     }
  //     if (this.state.password.length < 1) {
  //         error = true;
  //         alertMsg = "Enter Password";
  //     }

  //     this.setState({alertMsg: alertMsg});
  //     return error;
  // }

  onSubmit(e) {
    e.preventDefault();

    let db = firebase.firestore;

    var docRef = db
      .collection("admin")
      .where("email", "==", this.state.Email)
      .get()
      .then((querySnapshot) => {
          if(querySnapshot.size > 0) {
            firebase.auth.signInWithEmailAndPassword(this.state.Email, this.state.Password).then((res) => {
                console.log(res);
                this.setState({redirect: <Redirect to="/dashboard"/>});
            }).catch((err) => {
                alert(err.message);
            })
          } else {
            alert("User dosent exist");
          }
      })
      .catch((err) => {
        console.log(err);
      });

    

    // const error = this.validate();
    // this.setState({
    //     loading: true,
    //     alert: 0
    // });
    // if(!error){
    //     this.setState({
    //         loading: false
    //     });
    //     const { email, password } = this.state;
    //     const user = {
    //         email,
    //         password
    //     };
    //     this.props.login(user);
    //         setTimeout(() => {
    //             window.location.reload(false);
    //             }, 2000);
    // }
    // else{
    //     this.setState({
    //         alert: 1,
    //         loading: false
    //     });
    // }
  }

  render() {
    return (
      <section>
        {this.state.redirect}
        <React.Fragment>
          <Container>
            <Row>
              <Col xs="0" sm="4"></Col>

              <Col xs="12" sm="4">
                <br />
                <br />
                <br />
                <br />
                <div className="center">
                  <Form id="form" onSubmit={this.onSubmit}>
                    <FormGroup>
                      <Input
                        type="text"
                        name="Email"
                        placeholder="Contact Number"
                        id="number"
                        onChange={this.onChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        type="password"
                        name="Password"
                        placeholder="Password"
                        id="password"
                        onChange={this.onChange}
                      />
                    </FormGroup>

                    <Row xs="12" sm="12">
                      <center>
                        {this.state.loading ? (
                          <Spinner
                            animation="border"
                            className="spinner2"
                            alignItems="center"
                          />
                        ) : null}
                      </center>
                    </Row>

                    {this.state.alert === 1 ? (
                      <Alert color="info" status={this.state.alert}>
                        {this.state.alertMsg}
                      </Alert>
                    ) : null}
                    <Row>
                      <Col xs="12" sm="12">
                        <Button
                          outline
                          color="info"
                          type="submit"
                          length="100"
                          block
                        >
                          Log In
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Col>
              <Col xs="0" sm="4"></Col>
            </Row>
          </Container>
        </React.Fragment>
      </section>
    );
  }
}
