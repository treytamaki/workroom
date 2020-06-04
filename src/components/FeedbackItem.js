import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addFeedback} from '../actions';

import { storage } from '../config/firebase';

import MicRecorder from 'mic-recorder-to-mp3';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class FeedbackItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
      variant: "light",
      textColor: "black"
    };
  }
  
  componentDidMount() {
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    );
  }


  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true});
        }).catch((e) => console.error(e));
    }
  };

  stop = () => {
    const {addFeedback} = this.props;    
    

    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        this.setState({ blobURL, isRecording: false });
        
        const audioFileName = this.props.username + "-" + this.props.todo.title + "-" + this.props.todo.className + "-" + this.props.todo.timestamp;

        const uploadTask = storage.ref(`audios/${audioFileName}`).put(blob);
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.setState({progress});
          }, 
          (error) => {
            console.log(error);
          }, 
        () => {
          storage.ref('audios').child(audioFileName).getDownloadURL().then(url => {
            const time = new Date() + "";
            
            addFeedback({
              instructor: this.props.username, 
              student: this.props.todo.title,
              className: this.props.todo.className, 
              audioUrl: url, 
              timestamp: time,
            });

            this.setState({
              isRecording: false,
              blobURL: '',
              isBlocked: false,
              variant: "success",
              textColor: "white"
            });
          })  
        });

      }).catch((e) => console.log(e));
  };


  render() {
    const{ todoId, todo } = this.props;
    const {textColor} = this.state;
    return (
      <Card bg={this.state.variant} style={{"color":textColor}} >

        <Card.Img variant="top" src={todo.photoUrl} />
        <Card.Body>
          <Card.Title>{todo.title}</Card.Title>
          <Button variant="danger" onClick={this.start} disabled={this.state.isRecording}>Record</Button>
          <Button variant="dark" onClick={this.stop} disabled={!this.state.isRecording}>Stop</Button> 
        </Card.Body>
      </Card>
    );
  }
}



export default connect(null, {addFeedback})(FeedbackItem);