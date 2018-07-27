import React from 'react';
import { Link } from 'react-router-dom'

function update_json(markers){
  const sec = document.getElementById('code')
  let cleaned_json = []
  markers.forEach(function(loc){
    cleaned_json.push(
      {
        title: loc.title,
        url: `https://${loc.lang}.wikipedia.org/wiki/${loc.title.replace(/ /g, '_')}`,
        lat: loc.lat,
        lon: loc.lon,
        id: loc.id.replace('w_', ''),
        lang: loc.lang,
      }
  )
  sec.innerHTML = JSON.stringify(cleaned_json, null, 4)
  })
}

class JsonExport extends React.Component {
  componentDidMount() {
    update_json(this.props.markers)
  }
  componentWillReceiveProps(nextProps) {
    update_json(nextProps.markers)
  }

  render() {
    return (

      <section id="json-sec">
        <Link to="/" id="back-to-map"> <span className="mdi mdi-arrow-left mdi-18px"></span> <span>Back to map</span></Link>
        <h2>Json</h2>
        <pre id="code"></pre>
      </section>

    )
  }
}

export {JsonExport}
