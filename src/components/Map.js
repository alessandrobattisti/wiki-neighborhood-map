import React from 'react';
import {loadJS, displayError} from './../utils/utils.js'
import {SideBar} from './Sidebar'
import {JsonExport} from './JsonExport'
import {google_key} from './../keys'
import {style} from './../gm_styles'
import marker_nor from './../img/marker-icon-48_white.png'
import marker_sel from './../img/marker-icon-48_purple.png'
import wiki from './../img/wikipedia-48.png'
import wiki_selected from './../img/wikipedia-48_sel.png'
import { Route, Switch} from 'react-router-dom'
import { NoMatch } from './NoMatch'
import { Info } from './Info'
import {fetch_wiki, fetch_det_wiki} from './../utils/wikipedia_api'
class Map extends React.Component {

  state = {
    map: null,
    locations: [], //will store initials map markers
    markers: [], //will store markers info as collected from server
    filtered_markers: [], //will store only filtered markers to allow show/hide on map and sidebar
    active: '', //the active marker
    search_results: [], //will store search results markers info as collected from server
    filtered_results: [], //will store search results map markers
    results_locations: [] //will store only filtered markers to allow show/hide on map and sidebar
  }

  componentDidMount() {
    //https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap.bind(this);
    window.gm_authFailure = this.gm_authFailure;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadJS(`https://maps.googleapis.com/maps/api/js?key=${google_key}&callback=initMap&libraries=geometry`)
  }

 /*return a google map icon given logo image and size*/
 createIcon(type){
   const t = {
     wiki: {img: wiki, size:25},
     wiki_sel: {img:wiki_selected, size:25},
     locations: {img:marker_nor, size:35},
     locations_sel: {img:marker_sel, size:35}
   }
   return {
     url: t[type].img,
     scaledSize: new window.google.maps.Size(t[type].size, t[type].size), // scaled size
   };
 }

 /*fit map to visibile markers*/
 fit_to_visible_markers() {
     if(this.state.filtered_markers.length>1){
       var bounds = new window.google.maps.LatLngBounds();
       this.state.locations.forEach(function(marker){
         if(marker.getVisible()) {
           bounds.extend( marker.getPosition() );
         }
       })
       this.state.map.fitBounds(bounds);
     }
 }

 /*create markers add them to map then add a click event listener*/
 create_marker(location, type){
   const marker = new window.google.maps.Marker({
       map: this.state.map,
       position: new window.google.maps.LatLng({lat:location.lat, lng:location.lon}),
       animation: window.google.maps.Animation.DROP,
       title: location.title,
       id: location.id,
       icon: this.createIcon(type),
       lang: location.lang
   });
   marker.addListener("click", function () {
       this.open_info_window(type, marker)
   }.bind(this));
   return marker
 }

 /*init google map and add markers to arrays in state*/
 initMap() {
    const mapArea = document.getElementById('map');
    const map = new window.google.maps.Map(mapArea, {
        center: {lat: 45.434599, lng: 12.338923},
        zoom: 13,
        mapTypeControl: true,
        styles: style
    });
    this.setState({map:map, info_window: new window.google.maps.InfoWindow({})})
    const locations = []
    const markers = []
    const filtered_markers = []
    this.props.markers.forEach(function (location) {
      location.id = 'w_' + location.pageid
      markers.push(location)
      filtered_markers.push(location)
      const marker = this.create_marker(location, "locations")
      locations.push(marker)
    }.bind(this));

    this.setState({
      "locations": locations,
      "filtered_markers": filtered_markers,
      "markers": markers
    }, ()=>{this.fit_to_visible_markers()});
  }

  select_icon(type, id){
    let this_type_locations = "locations"
    let other_type_locations = "results_locations"
    let selected_marker = this.createIcon("locations_sel")
    let normal_marker = this.createIcon("locations")
    const unselected_marker = {
      'locations': this.createIcon("wiki"),
      'wiki': this.createIcon("locations")
    }
    if(type==="wiki"){
      this_type_locations = "results_locations"
      other_type_locations = "locations"
      selected_marker = this.createIcon("wiki_sel")
      normal_marker = this.createIcon("wiki")
    }

    this.setState(prevState => {
      prevState[this_type_locations] = prevState[this_type_locations].map(
        location => {
          //location.setVisible(true);
          if(location.id !== id){
            location.setIcon( normal_marker )
            return location
          }else{
            location.setIcon( selected_marker )
            return location//.setVisible(false)
          }
        }
      )
      prevState[other_type_locations] = prevState[other_type_locations].map(
        location => {
          location.setIcon( unselected_marker[type] )
          return location
        }
      )
      return prevState
    })
  }

  /*Close current info window*/
  close_info_window(){
    this.state.info_window.close();
  }

  open_info_window(type, marker){
    this.close_info_window()
    //set active in sidebar list and in callback scroll to that active <li>
    this.setState({active:marker.id}, () => {
      const sidebar_bottom = document.querySelector('#sidebar').getBoundingClientRect().bottom
      const hedear_height = document.querySelector('header').getBoundingClientRect().bottom
      const sidebar_scrolltop = document.querySelector('#sidebar').scrollTop
      let active_top = document.querySelector('.active')
      if(active_top){
        active_top = active_top.offsetTop
      }else{
        active_top = 0
      }
      if(sidebar_bottom + sidebar_scrolltop - hedear_height < active_top || sidebar_scrolltop > active_top){
        document.querySelector('#sidebar').scrollTop = active_top
      }
    })
    this.select_icon(type, marker.id)
    this.setState({
      info_window: new window.google.maps.InfoWindow({
        maxWidth: window.innerWidth-50,
        content: `
          <h2>${marker.title}</h2>
          <div id="infowindow-text">
            <button id="get-more-info" data-id="${marker.id}" data-type="${type}" data-lang="${marker.lang}">
              Get more info
            </button>
          </div>`

      })
    }, ()=>{
      this.state.info_window.open(this.state.map, marker)

      const button = document.getElementById('get-more-info')
      button.addEventListener('click', function(e){
        fetch_det_wiki(e.target.getAttribute("data-id"), e.target.getAttribute("data-lang"))
        .then(function(data){
          let test = document.getElementById("infowindow-text")
          test.innerHTML = data.parse.text['*']
          document.querySelectorAll('#infowindow-text a').forEach(function(a){a.removeAttribute("href")})
        })
        .catch(function(err){
          displayError("We were unable to download data from wikipedia api. Check developer console for more information.")
          console.log(err)
        })
      })
    })

  }

  get_marker_by_id(type, id){
    if(type==='locations'){
      const a = this.state.locations.filter(
        loc => loc.id === id
      )
      return a[0]
    }else if(type==="wiki"){
      const a = this.state.results_locations.filter(
        loc => loc.id === id
      )
      return a[0]
    }
  }

  delete_marker(id){
    this.setState(function(prevState){
      prevState.markers = prevState.markers.filter(loc => loc.id !== id)
      prevState.filtered_markers = prevState.markers.slice() //copy array
      prevState.locations = prevState.locations.map(loc => {
        if(loc.id === id){
          loc.setMap(null)
        }
        return loc
      })
      prevState.locations = prevState.locations.filter(loc => loc.id !== id)
      return prevState
    }, this.remove_filter())
  }
  /* Remove every filter. Each marker will be visible.
  *  Close info windows and remove active class from sidebar list.
  */
  remove_filter(){
    this.select_icon('locations','')
    document.getElementById('filter-form').value = ''
    this.setState(function(prevState){
      prevState.filtered_markers = prevState.markers.slice() //copy array
      prevState.locations.forEach(function(loc){
        loc.setVisible(true);
      })
      return prevState
    }, () => {
        //this needs to be in a callback of setState since we have to update sytles
        //after render() has finished updating the UI
        this.fit_to_visible_markers()
        this.close_info_window()
        document.querySelectorAll('.sidebar-el').forEach(function(el){
          el.classList.remove("active")
        });
      }
    );
  }

  click_filter(id, title){
    this.close_info_window()
    this.select_icon("locations",id)
    this.open_info_window("locations",this.get_marker_by_id('locations',id))
    this.state.map.panTo(this.get_marker_by_id('locations',id).getPosition())
  }

  form_filter(e){
    this.close_info_window()
    const m = new RegExp(e.target.value, 'i')
    this.setState(prevState => {
      prevState.locations.map(
        location => {
          location.setVisible(true);
          if(location.title.match(m)){
            return location
          }else{
            location.setVisible(false)
            return location
          }}
      );
      prevState.filtered_markers = prevState.markers.filter(location => location.title.match(m)) ;
      return prevState
    }, ()=>{ this.fit_to_visible_markers() })
  }
  get_wiki_lang(){
    const lang = document.getElementById('wiki-lang-select')
    return lang.options[lang.selectedIndex].value
  }
  searchWikipedia(e){
    e.preventDefault()
    document.querySelector('.search-results').style.display = 'block'
    const lang = this.get_wiki_lang()

    const loader = document.getElementById('searching')
    loader.style.display = "block";

    const center = this.state.map.getCenter()
    const radius = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(
          this.state.map.getBounds().f.f,
          this.state.map.getBounds().b.b
        ),
        center
    )

    const form = {
      "origin": "*",
    	"action": "query",
    	"format": "json",
    	"list": "geosearch",
    	"gscoord": `${center.lat()}|${center.lng()}`,
    	"gsradius": `${radius}`,
    	"gslimit": "50"
    }

    fetch_wiki(form, lang)
      .then(function(res){
        if(res.query.geosearch.length > 0){
          loader.style.display = "none";
        }
        this.update_results(res.query.geosearch)
      }.bind(this) )
      .catch(function(err){
        displayError("We were unable to download data from wikipedia api. Check developer console for more information.")
        document.querySelector('#searching').style.display = "none"
        document.querySelector('.search-results').style.display = "none"
      })
  }

  empty_results(){
    this.state.results_locations.forEach(
      function(el){
        el.setMap(null)
      }
    )
    this.setState({'results_locations':[]})
  }

  update_results(res){
    this.empty_results();

    let results_locations = [];
    let search_results = [];
    let filtered_results = [];
    const locations_id = this.state.locations.map(loc => loc.id)
    res.forEach(function(location){
      if(!locations_id.includes('w_'+location.pageid)){
        search_results.push( {id: location.pageid, title: location.title, lang: this.get_wiki_lang(), lat:location.lat, lon:location.lon} )
        filtered_results.push( {id: location.pageid, title: location.title, lang: this.get_wiki_lang()} )
        location.id = location.pageid
        location.lang = this.get_wiki_lang()
        let marker = this.create_marker(location, 'wiki')
        results_locations.push(marker)
      }
    }.bind(this))

    this.setState({results_locations:results_locations, search_results:search_results, filtered_results:filtered_results})

  }
  empty_search_results(){
    document.querySelector('.search-results').style.display = 'none'
    this.setState(prevState => {

      prevState.results_locations.map(loc=>loc.setMap(null))
      prevState.results_locations = []
      prevState.search_results = []
      prevState.filtered_results = []
      return prevState
    })
  }
  click_res_filter(id, title){
    this.close_info_window()
    this.select_icon("wiki", id)
    this.open_info_window("wiki",this.get_marker_by_id('wiki',id))
    this.state.map.panTo(this.get_marker_by_id('wiki',id).getPosition())
  }

  res_form_filter(e){
    this.select_icon('wiki','')
    this.close_info_window()
    const m = new RegExp(e.target.value, 'i')
    this.setState(prevState => {
      prevState.results_locations.map(
        location => {
          location.setVisible(true);
          if(location.title.match(m)){
            return location
          }else{
            location.setVisible(false)
            return location
          }}
      );
      prevState.filtered_results = prevState.search_results.filter(location => location.title.match(m)) ;
      return prevState
    }, ()=>{
      document.querySelectorAll('.sidebar-el').forEach(function(el){
        el.classList.remove("active")
      });

    })
  }

  /* Save a place to myplaces, then remove it from search results */
  save_new_place(id){
    let loc = this.state.search_results.filter(l => l.id === id)[0]
    const locations_id = this.state.locations.map(loc => loc.id)
    this.close_info_window()

    if(locations_id.includes("w_"+loc.id)){
      displayError('This place is already in <b>my places</b>!')
    }else{
      this.setState(prevState => {
        //create marker and save in my places arrays
        let copy_loc = Object.assign({}, loc);
        copy_loc.id = "w_" + copy_loc.id
        const loc2 = this.create_marker(copy_loc, "locations")
        prevState.locations.push(loc2)
        loc = {
          'id':loc2.id,
          'title':loc.title,
          'lang':loc.lang,
          'lat':loc.lat,
          'lon':loc.lon
        }
        prevState.markers.push(loc)
        prevState.filtered_markers.push(loc)
        //remove saved marker from search results arrays
        prevState.search_results = prevState.search_results.filter(loc => loc.id !== id)
        prevState.results_locations = prevState.results_locations.filter(loc => {
          if(loc.id === id){
            loc.setMap(null)
          }
          return loc
        })
        prevState.results_locations = prevState.results_locations.filter(loc => loc.id !== id)
        prevState.filtered_results = prevState.filtered_results.filter(loc => loc.id !== id)
        return prevState
      })
    }
  }

  /* Save json information of current "my places" to json section */
  export_json(){
    const el = document.getElementById('json-sec')
    el.innerHTML = JSON.stringify(this.state.markers);
  }

  render() {
    return (
      <div className="container">
        <SideBar
          active={this.state.active}
          markers={this.state.filtered_markers}
          remove_filter={this.remove_filter.bind(this)}
          click_filter={this.click_filter.bind(this)}
          form_filter={this.form_filter.bind(this)}
          delete_marker={this.delete_marker.bind(this)}
          searchWikipedia={this.searchWikipedia.bind(this)}
          search_results={this.state.filtered_results}
          click_res_filter={this.click_res_filter.bind(this)}
          save_new_place={this.save_new_place.bind(this)}
          res_form_filter={this.res_form_filter.bind(this)}
          empty_search_results={this.empty_search_results.bind(this)}
          export_json={this.export_json.bind(this)}
          />
        <Route path='/' render = {() => (
            <section id="map-container" className="map-container" aria-label="Wiki Map" role="application" >
              <div id="map" aria-label="Wiki Map" role="application"></div>
            </section>
          )}
        />
        <Route exact path='/json' render = {() => (
          <JsonExport markers={this.state.markers} />
          )}
        />
      <Route exact path='/info' component={Info} />

      {/* This switch handle 404 pages */}
      <Switch>
        <Route exact path='/' />
        <Route exact path='/json' />
        <Route exact path='/info' />
        <Route component={NoMatch} />
      </Switch>

      </div>
    )
  }
}

export {Map}
