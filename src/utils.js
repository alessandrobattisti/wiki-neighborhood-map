function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = () => {
        document.write("Error: Google Maps cannot be loaded at this time. Check your internet connection and try again.");
    };
    ref.parentNode.insertBefore(script, ref);
}


var loadJson = function(url){
  return new Promise(function(resolve, reject) {
    fetch('/desc.json')
    .then(
      function(response){
        return response.json()
      }
    )
    .then(
      function(json){
        resolve(json);
      }
    )
    .catch(
      function(err){
        console.log(err);
        reject(Error("It broke"));
      }
    )
  });
}


export {loadJS, loadJson}
