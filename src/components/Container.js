import React from 'react';
import {Map} from './Map'

class Container extends React.Component {
  constructor(props){
    super(props)
    this.loadJson()
  }

  state = {
    map: null,
    markers: []
  }

  /*
   * fetch initial data from simple json file. This file should be replaced by a
   * api request to get
  */
  loadJson() {
    fetch('/locations.json').then(function(response){
      return response.json()
    }).then(function(json){
        this.setState( {markers: json} )
    }.bind(this))
    .catch(
      err => console.log(err)
    )
  }


  render() {
    return (
        <Map markers={this.state.markers} />
    )
  }
}



export {Container}
