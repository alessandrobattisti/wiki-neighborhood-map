import React from 'react';

class NoMatch extends React.Component {
  render() {
    return (
      <section id="json-sec">
        <h2>Page Not Found</h2>
        <p>Sorry, but the page you were trying to view does not exist.</p>
        <p><a title="Back to main page" href="/">Back to main page</a></p>
      </section>
    )
  }
}

export {NoMatch}
