import React, { Component } from 'react';
import {Container} from './components/Container'
import './App.css';
import { Link } from 'react-router-dom'

class App extends Component {

  openNav() {
    const sidebar = document.getElementById('sidebar')
    if(sidebar){
      sidebar.classList.toggle("sidebar-close")
    }

    const map_container = document.getElementById('map-container')
    if(map_container){
      map_container.classList.toggle("map-container-full")
    }

    const json_container = document.getElementById('json-sec')
    if(json_container){
      json_container.classList.toggle("json-sec-full")
    }

    const help_container = document.getElementById('help-page')
    if(help_container){
      help_container.classList.toggle("help-page-full")
    }
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button aria-label="Show or hide sidebar" onClick={this.openNav.bind(this)} className="mdi mdi-menu mdi-36px"></button>
          <h1 className="title">Neighborhood Map</h1>
            <Link to="/info" id="help-link" >Help</Link>
        </header>
        <Container />
      </div>
    );
  }
}

export default App;


//setTimeout(function(){   map_container.classList.toggle("map-container-full") }, 500);
//this.setState(prevState => prevState.markers.pop(0))
