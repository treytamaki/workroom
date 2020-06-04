import React, {Component, createRef} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import ListItem from './ListItem';
import FeedbackItem from './FeedbackItem';

import * as actions from '../actions';

import "./style.css";
import Webcam from "react-webcam";


import { storage } from '../config/firebase';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


const APP_NAME = "";


class List extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showForm: true,
      formValue: "",
      photoValue: null
    };
    this.handleChange = this.handleChangeImage.bind(this);
    
  }

  inputChange = event => {
    this.setState({formValue: event.target.value});
  };

  handleChangeImage = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState({imageTest: image});
    }
  }


  formSubmit = (photo) => {
    const {addToDo} = this.props;    

    const {formValue} = this.state;
    // const photo = this.state.screenshot;
    const time = new Date() + "";

    const uploadTask = storage.ref(`images/${time}`).putString(photo, 'data_url');
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({progress});
      }, 
      (error) => {
      }, 
    () => {
      storage.ref('images').child(time).getDownloadURL().then(url => {
        addToDo({
          title: this.props.username, 
          className: this.props.chosenClass, 
          photoUrl: url, 
          comments: formValue
        });
        this.setState({formValue: "", imageTest: "", showForm: false});
      })  
    });
  };

  renderForm = () => {
    const webcamRef = createRef();
    const {formValue} = this.state;
    return (
      <div>
        <div width="100%"height="50em">

          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"style={{"height":"20em"}}
          />
        </div>
        <div className="centerInsides">
          <Button variant="primary" onClick={() => {this.formSubmit(webcamRef.current.getScreenshot())}}  style={{"margin-top": "3em"}}>
            Take Screenshot
          </Button>
        </div>
      </div>
    );
  };

  renderToDo() {
    
    const {data} = this.props;
    const username = this.props.username;

    const toDos =[];
    _.forEach(data, (value, key) => {
      
      let isInstructor = this.props.userType === "instructor";
      let isStudentAndNamed = !isInstructor && value.title === this.props.username;
      let classIsEqual = this.props.chosenClass === value.className;
      if ((isStudentAndNamed) && classIsEqual) {
        toDos.push(
          <ListItem key={key} todoId={key} todo={value} audioUrl={this.props.audioUrl} instructor={this.props.instructor}/>
        );
      } else if (isInstructor && classIsEqual) {
        toDos.push(
          <div className="column">
            <FeedbackItem username={username} key={key} todoId={key} todo={value} />
          </div>
        );
      }
    });

    if (!_.isEmpty(toDos)) {
      return toDos;
    } else  {
      return (
        <div>
          {this.renderForm()}
        </div>
      );
    }
  }

  componentWillMount() {
    this.props.fetchToDos();
  }

  render() {
    let {username, chosenClass, userType} = this.props;
    // GRID
    if (userType === "instructor") {
      return (
        <div className="row">
          {this.renderToDo()}
        </div>
      );
    } else {
      return (
        <div className="centerInsides" style={{"margin-top": "3em"}}>
          {this.renderToDo()}
        </div>
      );
    }
  }
}

const mapStateToProps = ({data}) => {
  return {
    data
  }
}

export default connect(mapStateToProps, actions)(List);