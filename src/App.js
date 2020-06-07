import React, {Component} from 'react';
import {connect} from 'react-redux';
import List from './components/List';
import Header from './components/Header';

import 'bootstrap/dist/css/bootstrap.min.css';

import "./components/style.css";

import "./App.css";
import _ from 'lodash';

import { databaseRef } from './config/firebase';
import * as actions from './actions';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/cse441-group1.appspot.com/o/images%2Flogo.png?alt=media&token=5b9c0427-a6ed-4978-8b80-5feafae093cc";
const PROFILE_ICON_URL = "https://firebasestorage.googleapis.com/v0/b/cse441-group1.appspot.com/o/images%2Fcircle-cropped.png?alt=media&token=222e65c0-f673-4914-bc0d-9d68dc1a5441";

const IMAGE_CLASS_URLS = [
  "https://www.verywellfit.com/thmb/UWC6eL4g74LwJQF33TyTn1C6h7w=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/yoga-class-stretching-640630209-57f3b8263df78c690f28580c.jpg",
  "https://themmaguru.com/wp-content/uploads/2018/04/martial-arts-1.jpg",
  "https://sanfranciscoparksalliance.org/wp-content/uploads/2019/09/screen_3x-1.jpg"
];

const userType = ["instructor", "student"];
const classNames = ["Intermediate Yoga", "Experienced Martial Arts", "Beginner Tai Chi"]
const classInstructors = ["Kevin Tran", "Yun Liao", "Sharon Konami"]

const classTimes = [
  "March 3 - May 15, Sat 10:00 am - 11:00 am",
  "March 3 - May 22, Sat 10:30 am - 11:30 am",
  "March 10 - May 8, Sat 10:00 am - 11:15 am",
];

const classIdForYoga = "M8opR64rBwetB1_u2Sw";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homePageClicked: false, // false
      name: "",           // ""
      chosenClass: "",    // ""
      chosenInstructor: "",
      chosenUserType: "", // "" 

      // homePageClicked: true, // false
      // name: "Trey",           // ""
      // chosenClass: "Intermediate Yoga",    // ""
      // chosenUserType: "student", // "" 
      // chosenInstructor:"Kevin Tran",
      movementStatus: [],
    };
  }

  componentWillMount() {
    let yogaStarts = databaseRef.child("starts").child("-" + classIdForYoga);
    yogaStarts.on("value", snapshot => {
      this.setState({movementStatus: snapshot.val()})
    });

    let audioRef = databaseRef.child("audios");
    audioRef.on("value", snapshot => {
      // this.setState({movementStatus: snapshot.val()})
      this.setState({audios: snapshot.val()})
    });
  }
  
  setName() {
    this.setState({ 
      name: document.getElementById("name").value
    });
  }

  startMovement() {
    const {addStart, fetchStarts} = this.props;
    fetchStarts();
    const {data} = this.props;
    let firebaseStatus = false;    
    _.forEach(data, (value, key) => {      
      if (this.state.chosenClass === value.class) {
        firebaseStatus = value.status;
      }
    });
    addStart({
      classId: classIdForYoga,
      class: this.state.chosenClass,
      status: firebaseStatus,
    });
  }

  getStatusMovement() {
    return this.state.movementStatus.status;
  }

  getAudioFeedback() {
    if (!(this.state.chosenUserType === "student") || !this.state.audios) {
      return false;
    }
    let audios = this.state.audios;
    let currentName = this.state.name;
    let currentClass = this.state.chosenClass;
    let audioUrl = null;
    Object.keys(audios).forEach( function (key) { 
      let fbStudentName = audios[key].student;
      let fbClassName = audios[key].className;
      if (fbStudentName === currentName && fbClassName === currentClass) {
        audioUrl = audios[key].audioUrl;
      }
    });
    return audioUrl;
  }

  checkMovement() {
    const {data} = this.props;
    const {addStart} = this.props;   
    let firebaseStatus = false;
    _.forEach(data, (value, key) => {
      if (this.state.chosenClass === value.class) {
        firebaseStatus = value.status;
      }
    });
    return firebaseStatus;
  }

  render() {
    

    // LOADING PAGE
    if (!this.state.homePageClicked) {
      return(
        <div onClick={() => {this.setState({ homePageClicked: true})}} className="homePageParent">
          <img src={LOGO_URL} id="img" style={{"margin-bottom":"3em"}}/>  
          <h3>Exercise Together. </h3>
          <h6>Click to continue.</h6>
        </div>
      )
    }

    // TYPE SELECT
    if (!this.state.chosenUserType) {
      return (
        <div>
          <div className="homePageParent" style={{"width":"50%"}}>
            <h3 style={{"margin-bottom":"2em"}}>I am a(n):</h3>
            <Button variant="outline-primary" size="lg" onClick={() => {this.setState({chosenUserType: "instructor"})}} block>Instructor</Button>
            <br/>
            <Button variant="outline-primary" size="lg"  onClick={() => {this.setState({chosenUserType: "student"})}} block>Student</Button>
          </div>
        </div>
      );
    }

    // NAME SELECT
    if (!this.state.name) {
      return (
        <div className="homePageParent" style={{"width":"50%"}}>          
          <h3 >UW NetId Login</h3>
          <Form.Group controlId="name">
            <Form.Control type="email" placeholder="Username" />
          </Form.Group>

          <Form.Group controlId="password"> 
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button onClick={() => { this.setName()}}>Login</Button>
        </div>
      );
    }

    // CLASS SELECT
    if (!this.state.chosenClass) {
      let classes = [];
      for (let i = 0; i< classNames.length; i++) {
          classes.push(<div onClick={() => { this.setState({ chosenClass: classNames[i], chosenInstructor: classInstructors[i] })}} className="textBlack" >
            <Card>
              <Card.Img variant="top" src={IMAGE_CLASS_URLS[i]} />
              <Card.Body>
                <Card.Title>{classNames[i]} with {classInstructors[i]}</Card.Title>
                <Card.Text>
                  {classTimes[i]}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        );
      }
      return (
        <div>
          <div id="classProfileBackground">
            <img src={PROFILE_ICON_URL} height="70%" style={{"padding-bottom":"1em", "padding-top":"5em"}}/>
            <h3>Welcome back, {this.state.name}!</h3>
          </div>
          {/*  <h3>{this.state.chosenUserType === "instructor" && " (Instructor)"}</h3>  */}
          <div className="dark" id="classList">
            <h3 style={{"color":"white", "padding-bottom":".5em"}}>My Classes</h3>
            <div id="classChooseBG">
              {classes}
            </div>
          </div>
        </div>
      )
    }

    // STREAM
    if (this.getStatusMovement()) {
      if (this.state.chosenUserType === "instructor") {
        return (
          <div className="dark" >
            <div className="viewVideoHeader">
              <h2>{this.state.chosenClass}</h2>
            </div>
            <div width="100%"height="50em">
              <iframe src="https://treytamaki.github.io/roomvideo" allow="camera"  width="100%"style={{"height":"20em"}}></iframe>
            </div>
            <div className="centerInsides">
              <h5 style={{"margin-top":"3em","margin-bottom":"3em"}}>Detailed instructions make better performance!</h5>
              <Button variant="primary" onClick={() => {this.startMovement()}}>
                See Submitted Photos
              </Button>
            </div>
            <div className="viewVideoHeader"/>
          </div>
        );
      } else if (this.state.chosenUserType === "student") {
        return (
          <div className="dark" >
            <div className="viewVideoHeader">
              <h2>{this.state.chosenClass}</h2>
              <h4>with {this.state.chosenInstructor}</h4>
            </div>
            <div width="100%"height="50em">
              <iframe src="https://treytamaki.github.io/roomvideo" allow="camera"  width="100%"style={{"height":"20em"}}></iframe>
            </div>
            <div className="centerInsides">
              <h5 style={{"margin-top":"3em","margin-bottom":"3em"}}><br/><br/></h5>
              {/* <Button variant="primary" onClick={() => {this.startMovement()}}>
                See Submitted Photos
              </Button> */}
            </div>
            <div className="viewVideoHeader"/>
          </div>
        );
      }
    } else {
      // SEE ALL VIDEOS USER AND INSTRUCTOR
      if (this.state.chosenUserType === "instructor") {
        return (
          <div>
            <div className="dark border" >
              <h3>Submissions</h3>
              {<List username={this.state.name} chosenClass={this.state.chosenClass} userType={this.state.chosenUserType} audioUrl={this.getAudioFeedback()}/>}
              <div className="centerInsides">
                <Button variant="primary" onClick={() => {this.startMovement()}}>
                  End Submissions
                </Button>
              </div>
              <div className="viewVideoHeader"/>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div className="dark border">
              <h3>Your Submission</h3>
              {<List username={this.state.name} chosenClass={this.state.chosenClass} userType={this.state.chosenUserType} audioUrl={this.getAudioFeedback()} instructor={this.state.chosenInstructor}/>}
              <div className="viewVideoHeader"/>
              <div className="viewVideoHeader"/>
              <div className="viewVideoHeader"/>
            </div>
          </div>
        );
      }
    }
  }
}

const mapStateToProps = ({data}) => {
  return {
    data
  }
}

export default connect(mapStateToProps, actions)(App);

