//https://stackoverflow.com/questions/14525178/is-there-any-native-function-to-convert-json-to-url-parameters/14525299#14525299
function par_to_url(data){
  const url = Object.keys(data).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  }).join('&');
  return url
}

var fetch_wiki = function(data, lang){
  return new Promise(function(resolve, reject) {
    const api_url = `https://${lang}.wikipedia.org/w/api.php?`
    fetch(api_url + par_to_url(data))
      .then(function(response){
        return response.json()
      })
      .then(
        function(resp){
          resolve(resp)
        }
      )
      .catch(
        function(err){
          /*console.log(err);*/
          reject(Error("It broke"));
        }
      )
  });
}

var fetch_det_wiki = function(id, lang){
  id = id.replace('w_','')
  return new Promise(function(resolve, reject) {
    fetch(`https://${lang}.wikipedia.org/w/api.php?action=parse&prop=text&pageid=${id}&format=json&origin=*`)
      .then(function(response){
        return response.json()
      })
      .then(
        function(resp){
          resolve(resp)
        }
      )
      .catch(
        function(err){
          /*console.log(err);*/
          reject(Error("It broke"));
        }
      )
  });
}


export {fetch_wiki, fetch_det_wiki}
