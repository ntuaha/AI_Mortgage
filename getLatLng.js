const request = require('request');

function findLatLng(address){
  return new Promise(function(resolve,reject){
    request({
      "method":"GET",
      "url":'https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURI(address)+'&sensor=false&region=tw',
      "content-type":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
    }, (error, response, body) => {
      if (error) {
        console.error('upload failed:', error);
        reject(error);
      }
      //console.log('Upload successful!  Server responded with:', body);
      var location = JSON.parse(body).results[0].geometry.location;
      console.log(location);
      resovle(location);
    });
  });  
}

//findLatLng("新北市新莊區後港一路65巷11弄4號三樓");
function findAddress(lat,lng){
  return new Promise(function(resolve,reject){
    request({
      "method":"GET",
      "url":'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false&region=tw'      
    }, (error, response, body) => {
      if (error) {
        console.error('upload failed:', error);
        reject(error);
      }
      //console.log('Upload successful!  Server responded with:', body);
      var address_components = JSON.parse(body).results[0].address_components;
      for(var c in address_components){
        if(address_components[c].types.indexOf("administrative_area_level_3")>=0){
          resolve(address_components[c].long_name);
        }
      }
      //console.log(location);
      //resovle(location);
    });
  });  
}

//{ lat: 25.027379, lng: 121.426 }
// https://maps.googleapis.com/maps/api/geocode/json?latlng=25.027379,121.426&region=tw
findAddress(25.027379,121.426).then(function(data){
  console.log(data);
});

//http://maps.googleapis.com/maps/api/geocode/json?address=新北市新莊區後港一路65巷11弄4號三樓&sensor=false&region=tw
