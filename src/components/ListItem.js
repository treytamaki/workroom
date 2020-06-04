import React, {Component} from 'react';
import {connect} from 'react-redux';
import {completeToDo, fetchAudios} from '../actions';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import "./styles/Header.css";

class ListItem extends Component {
  completeClick = completeTodoId => {
    const {completeToDo} = this.props;
    completeToDo(completeTodoId);
  };

  render() {
    
    const{todoId, todo} = this.props;
    return (
      <Card bg={"light"} style={{"color":"black"}} >
        <div className="parent">
          <Card.Img variant="top" src={todo.photoUrl} />
          {!this.props.audioUrl && 
            <div className="child">
              <h4 id="reviewText">
              {this.props.instructor} is reviewing the submitted picture
              <br/><br/>
              Please wait
              </h4>
            </div>
          }
        </div>
        <Card.Body>
          <Button onClick={() => this.completeClick(todoId)}>Retake Photo</Button>
          {this.props.audioUrl && 
          <Card.Text>
            <h5 style={{"padding-bottom": "2em"}}>Your feedback has been received:</h5>
            <audio src={this.props.audioUrl} controls="controls" autoplay /> 
          </Card.Text>}
        </Card.Body>
      </Card>
    );
  }
}

export default connect(null, {completeToDo})(ListItem);