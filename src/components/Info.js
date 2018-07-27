import React from 'react';
import { Link } from 'react-router-dom'

class Info extends React.Component {
  componentDidMount(){
      const sidebar = document.getElementById('sidebar')
      const help_container = document.getElementById('help-page')
      if(sidebar.classList.contains('sidebar-close')){
        help_container.classList.add("help-page-full")
      }
  }
  render() {
    return (
      <section id="help-page">
        <Link to="/" id="back-to-map"> <span className="mdi mdi-arrow-left mdi-18px"></span> <span>Back to map</span></Link>
        <div className="info-text">
          <h2>About this app</h2>
          <br />
            <p> This webapp has been developed as capstone project of Front End Web Developer Nanodegree(Google scholarship).
              A single page web application written from scratch using React and integrating external APIs.
            </p>
            <p>
              This app is composed of two parts:
            </p>
            <ul>
              <li>A full-screen map using the Google Maps API</li>
              <li>A sidebar that list the places marked on the map</li>
            </ul>
            <p>
            From the sidebar you can select, filter and delete the default places.When a place is selected on the map or in the sidebar an info - window will open on the map that will let you get more information about that place using Wikipidia api.</p> < p > Using the sidebar “Search for new places” section it’s also possible to find new places from wikipedia api that are inside the map extension.Once you have found an interesting place you can save it to “my places” using the corresponding save button in the sidebar.When you have finished searching for new places you can export all “my places” to a JSON file.
            </p>
        </div>

      </section>
    )
  }
}

export {Info}
