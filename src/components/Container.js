import React from 'react';
import {Map} from './Map'
import {displayError} from './../utils/utils'
import {locations} from './../locations'
class Container extends React.Component {
  state = {
    map: null,
    markers: []
  }
  componentDidMount(){
    this.setState( {markers: locations} )
    //this.loadJson()
  }

  /*
  * fetch initial data from simple json file. This call could be replaced by a
  * new one to an external api
  */

  //loadJson() {
  //  fetch('/locations.json').then(function(response){
  //    return response.json()
  //  }).then(function(json){
  //      this.setState( {markers: json} )
  //  }.bind(this))
  //  .catch(
  //    err => {
  //      console.log(err);
  //      displayError("We were unable to download initial data. Check developer console for more information.")
  //    }
  //  )
  //}

  /*close error modal*/
  close(e){
    const modal = document.getElementById('modal');
    if(e.target.id==='modal'){
      modal.style.display = 'none';
    }
  }

  /*close error modal*/
  close2(){
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  }

  render() {
    return (
      <div>
        <div id="modal" onClick={(e)=>this.close(e)}>
          <div id="error-message">
            <span
              tabIndex="1"
              role="button"
              aria-label="close error message"
              className="mdi mdi-close mdi-24px"
              id="modal-close"
              onClick={(e)=>this.close2(e)}
              onKeyPress={(e)=>this.close2(e)}
              >
            </span>
            <h3>An error occurred</h3>
            <p id="error-message-text"></p>
        </div>
        </div>
        <Map markers={this.state.markers} />
      </div>
    )
  }
}



export {Container}
