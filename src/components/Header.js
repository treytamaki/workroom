import React, {Component} from 'react';
import "./styles/Header.css";

const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/cse441-group1.appspot.com/o/images%2Flogo.png?alt=media&token=5b9c0427-a6ed-4978-8b80-5feafae093cc";


class Header extends Component {

  render() {
    
    return (
      <div id="container">
        <img src={LOGO_URL} id="imageheader"/>
      </div>
    );
  }
}

export default (Header);