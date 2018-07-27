import React from 'react';
import loader from './../img/loader.gif'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class SideBar_n extends React.Component {
  activate(e){
    const els = document.querySelectorAll('.sidebar-el')
    els.forEach(function(el){
      el.classList.remove("active2")
    })
    e.target.classList.toggle("active2")
  }
  render(){
    return (
      <section id="sidebar" className="sidebar">
        <div className="my-places">
          {this.props.location.pathname==='/' &&
          <Link to="/json" id="json-link" >Json</Link>
          }
          {this.props.location.pathname==='/json' &&
          <Link to="/" id="json-link" >Map</Link>
          }
          {this.props.location.pathname==='/info' &&
          <Link to="/" id="json-link" >Map</Link>
          }

          <h2>My Places</h2>
          <div className="filter-div">
            <input aria-label="filter places" className="filter-form" id="filter-form" type="text" onChange={(e) => {this.props.form_filter(e)}}/>
            <span
              role="button"
              aria-label="Remove filter"
              tabIndex="0"
              onClick={() => this.props.remove_filter()}
              onKeyPress={() => this.props.remove_filter()}
              className="mdi mdi-filter-remove mdi-24px"
              title="Remove filters">
            </span>
          </div>
          <ul className="sidebar-list">
            {this.props.markers.map(function(el){
              return (
                <li key={el.id}>
                  <div
                    tabIndex="0"
                    aria-label={el.title}
                    role="button"
                    className={"sidebar-el " + (this.props.active===el.id ? 'active' : '')}
                    onClick={(e) => { this.props.click_filter(el.id, el.title)}}
                    onKeyPress={(e) => { this.props.click_filter(el.id, el.title)}}
                    >

                    <i className="mdi mdi-map-marker"></i>
                    {el.title}
                  </div>
                  <span
                    role="button"
                    aria-label="Delete this place"
                    tabIndex="0"
                    className="mdi mdi-delete"
                    title="Delete this place"
                    onClick={()=>this.props.delete_marker(el.id)}
                    onKeyPress={()=>this.props.delete_marker(el.id)}
                    >
                  </span>
                </li>
              )
            }.bind(this))}
            {this.props.markers.length === 0 && <li className="sidebar-el">No results</li>}
          </ul>
        </div>
        <div className="search-new-places">
          <h2>Search for new places</h2>
          <div className="search-div">
            <h3>Wikipedia</h3>
            <form onSubmit={(e) => this.props.searchWikipedia(e)}>
              <select className="search-form" name="lang-list" id="wiki-lang-select" aria-label="Select language">
                <option value="en">English</option>
                <option value="it">Italiano</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              <button
                className="button-search"
                aria-label="Search for wikipedia places in this area"
                title="Search for wikipedia places in this area"
                >
                <i className="mdi mdi-magnify mdi-24px"></i>
              </button>
            </form>
          </div>
          <div id="searching">
            <img alt="loader" className="loader" src={loader}/>
            <span>Searching...</span>
          </div>
          <div className="search-results">
          <h2>Search Results:
            <span
              role="button"
              tabIndex="0"
              aria-label="Delete search results"
              title="Delete search results"
              id="remove-search-results"
              onClick={()=> this.props.empty_search_results()}
              onKeyPress={()=> this.props.empty_search_results()}
              className="mdi mdi-playlist-remove mdi-24px">
            </span>
          </h2>
          <div className="filter-div">
            <input
              aria-label="filter search results"
              title="Filter search results"
              className="filter-form"
              id="filter-form2"
              type="text"
              onChange={(e) => {this.props.res_form_filter(e)}}
              />
            <i
              role="button"
              tabIndex="0"
              aria-label="Remove filter"
              title="Remove filter"
              onKeyPress={(e) => {document.getElementById("filter-form2").value='';this.props.res_form_filter(e)}}
              onClick={(e) => {document.getElementById("filter-form2").value='';this.props.res_form_filter(e)}}
              className="mdi mdi-filter-remove mdi-24px"
              >
            </i>
          </div>
          <ul className="sidebar-list">
            {this.props.search_results.map(function(el){
              return (
                  <li key={el.id} >
                    <div
                      className={"sidebar-el " + (this.props.active===el.id ? 'active' : '')}
                      onClick={(e) => { this.props.click_res_filter(el.id, el.title)}}
                      onKeyPress={(e) => { this.props.click_res_filter(el.id, el.title)}}
                      tabIndex="0"
                      aria-label={el.title}
                      role="button"
                      >
                      {el.title}
                    </div>
                    <i
                      role="button"
                      aria-label="Save this place"
                      tabIndex="0"
                      className="mdi mdi-content-save"
                      title="Save this place"
                      onClick={()=>this.props.save_new_place(el.id)}
                      onKeyPress={()=>this.props.save_new_place(el.id)}
                      >
                    </i>
                  </li>
                )
              }.bind(this))
            }
          {this.props.search_results.length===0 && <li>No results</li>}
         </ul>
        </div>
      </div>

      </section>
    )
  }

}
const SideBar = withRouter(SideBar_n)

export {SideBar}
//<div className="search-div">
//  <h3>Foursquare</h3>
//  <form  onSubmit={(e) => this.props.searchFourSquare(e)}>
//    <input className="search-form" type="text"/>
//    <button className="button-search"><i className="mdi mdi-magnify mdi-24px" title="Search"></i></button>
//  </form>
//</div>
