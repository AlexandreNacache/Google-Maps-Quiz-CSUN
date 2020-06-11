var numcorect = 0;
var numIncorect = 0;
var rectangle = [];
var map;
var infoWindow;
var datee = new Date();
var now_time = (new Date()).getTime();
var total_time = now_time;
var quest = ['&nbsp;&nbsp;&nbsp;&nbsp;Where is live oak?', '&nbsp;&nbsp;&nbsp;&nbsp;Where is sierra hall?', '&nbsp;&nbsp;&nbsp;&nbsp;where is the library?', '&nbsp;&nbsp;&nbsp;&nbsp;Where is admission and records?', '&nbsp;&nbsp;&nbsp;&nbsp;Where is Santa Susana hall?', '&nbsp;&nbsp;&nbsp;&nbsp;Where is Jeanne Chisholm Hall?'];
var q = 0;
var bounds = [{
  north: 34.2384349994959,
  south: 34.23813670141812,
  east: -118.52759140700242,
  west: -118.52885279600741
}, {
  north: 34.23848821686623,
  south: 34.2380613098187,
  east: -118.53002387262846,
  west: -118.53146765184647
}, {
  north: 34.24046341447913,
  south: 34.239705885222754,
  east: -118.52856288969816,
  west: -118.53007938653947
}, {
  north: 34.24072490266103,
  south: 34.239909724617995,
  east: -118.53013466418089,
  west: -118.53146340639115
}, {
  north: 34.23795368614722,
  south: 34.23726659912975,
  east: -118.5290427078162,
  west: -118.52952506394332
}, {
  north: 34.23779632442708,
  south: 34.237331088895274,
  east: -118.52578402480754,
  west: -118.52643973303167
}];

/*---------------------StopWatch code starts here----------------*/
var startTimerButton = document.getElementById('startTimer');
var pauseTimerButton = document.getElementById('pauseTimer');
var timerDisplay = document.getElementById('timer');
var startTime;
var updatedTime;
var difference;
var tInterval;
var savedTime;
var paused = 0;
var running = 0;
function startTimer(){
  if(!running){
    startTime = new Date().getTime();
    tInterval = setInterval(getShowTime, 1);
// change 1 to 1000 above to run script every second instead of every millisecond. 
//one other change will be needed in the getShowTime() function below for this to work.
    //see comment there.   
 
    paused = 0;
    running = 1;
timerDisplay.style.background = "#FF0000";              
    timerDisplay.style.cursor = "auto";
    timerDisplay.style.color = "yellow";
    startTimerButton.classList.add('lighter');
    pauseTimerButton.classList.remove('lighter');
    startTimerButton.style.cursor = "auto";
    pauseTimerButton.style.cursor = "pointer";
  }
}
function pauseTimer(){
  if (!difference){
    // if timer never started, don't allow pause button to do anything
  } else if (!paused) {
    clearInterval(tInterval);
    savedTime = difference;
    paused = 1;
    running = 0;
    timerDisplay.style.background = "#A90000";
    timerDisplay.style.color = "#690000";
    timerDisplay.style.cursor = "pointer";
    startTimerButton.classList.remove('lighter');
    pauseTimerButton.classList.add('lighter');
    startTimerButton.style.cursor = "pointer";
    pauseTimerButton.style.cursor = "auto";
  } else {
// if the timer was already paused, when they click pause again, start the timer again
startTimer();
  }
}
function resetTimer(){
  clearInterval(tInterval);
  savedTime = 0;
  difference = 0;
  paused = 0;
  running = 0;
  timerDisplay.innerHTML = 'Start Timer!';
  timerDisplay.style.background = "#A90000";
  timerDisplay.style.color = "#fff";
  timerDisplay.style.cursor = "pointer";
  startTimerButton.classList.remove('lighter');
  pauseTimerButton.classList.remove('lighter');
  startTimerButton.style.cursor = "pointer";
  pauseTimerButton.style.cursor = "auto";
}
function getShowTime(){                       
  updatedTime = new Date().getTime();
  if (savedTime){
    difference = (updatedTime - startTime) + savedTime;
  } else {
    difference =  updatedTime - startTime;
  }
         // this is were the variables get updated.
  var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((difference % (1000 * 60)) / 1000);
  var milliseconds = Math.floor((difference % (1000 * 60)) / 100);
  hours = (hours < 10) ? "0" + hours : hours;                          // this is where the timer gets outputed on the screen
  minutes = (minutes < 10) ? "0" + minutes : minutes;                                
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;
  document.getElementById('timer').innerHTML = hours + ':' + minutes + ':' + seconds ;
}
/*--------------------------StopWatch Code Ends here-----------*/

function getParameterByName(name, url) {                       // This is where the difficulty level gets chosen
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');                // I got this code snippet from Stack Overflow https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript?rq=1
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function initMap() {
  if(getParameterByName('mode')==1||getParameterByName('mode')==2){
    document.getElementById('player_mode').style.display = "none";
  }
  if ((quest[q] != undefined && q<5 &&getParameterByName('mode')==1)||(quest[q] != undefined && q<6 &&getParameterByName('mode')==2))document.getElementById('answer').innerHTML = '<h4>' + quest[q] + '</h4>';
  var myLatlng = {
    lat: 34.239,
    lng: -118.529
  };
  if (getParameterByName('mode') == 1)
    map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 16.3,
        center: myLatlng,
        gestureHandling: 'none',
        mapTypeControl: false,     
        streetViewControl: false, // disables pegman aka streetview
        zoomControl: false,  // disables zoom
        styles: [{
          "elementType": "labels",
          "stylers": [{
            "visibility": "on"
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "administrative.neighborhood",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "poi",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "transit",
          "stylers": [{
            "visibility": "off"
          }]
        }]
      });
  else
    map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 16.3,
        center: myLatlng,
        gestureHandling: 'none', // disable pan and zoom
        zoomControl: false,
        streetViewControl: false, // disables pegman aka streetview
        mapTypeControl: false, // removes the satelite/map button
        styles: [{
          "elementType": "labels",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "administrative.neighborhood",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "poi",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "transit",
          "stylers": [{
            "visibility": "off"
          }]
        }]
      });

  for (var i in bounds) {
    rectangle[i] = new google.maps.Rectangle({
      bounds: bounds[i],
      strokeColor: '#00FF00',
      strokeOpacity: 0,
      strokeWeight: 0,
      fillColor: '#00FF00',
      fillOpacity: 0,
      rect_id: i,
      map: map
    });
    rectangle[i].addListener('dblclick', function(mapsMouseEvent) {
      if (q == this.rect_id) {                                               // This code outputs Your answer is correct if he chooses the right bounds
        if ((quest[q] != undefined && q<5 &&getParameterByName('mode')==1)||(quest[q] != undefined && q<6 &&getParameterByName('mode')==2)) {
          document.getElementById('answer').innerHTML += '<h4><green>&nbsp;&nbsp;&nbsp;&nbsp;Your answer is Correct!!!</green> : time taken: ' + (((new Date()).getTime()) - now_time) / 1000 + ' sec </h4>';
          numcorect++;
          document.getElementById('stat').innerHTML = '<h3><table><tr><td>Write Answers</td><td>' + numcorect + '</td></tr><tr><td>Wrong Answers</td><td>' + numIncorect + '</td></tr></table></h3>';
          document.getElementById('stick').innerHTML = '<iframe src="https://giphy.com/embed/l41lUjUgLLwWrz20w" width="100" height="100" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cool-ok-sure-l41lUjUgLLwWrz20w">via GIPHY</a></p>';
          now_time = (new Date()).getTime();
        }

        rectangle[q] = new google.maps.Rectangle({
          bounds: bounds[q],
          strokeColor: '#00FF00',  // green
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#00FF00',
          fillOpacity: 0.35,
          rect_id: i,
          map: map
        });

      } else {         // This code outputs: Sorry wrong location if the user chose a wrong location
        if ((quest[q] != undefined && q<5 &&getParameterByName('mode')==1)||(quest[q] != undefined && q<6 &&getParameterByName('mode')==2)) {
          document.getElementById('answer').innerHTML += '<h4><red>&nbsp;&nbsp;&nbsp;&nbsp;Sorry Wrong Location</red> : time taken: ' + (((new Date()).getTime()) - now_time) / 1000 + ' sec </h4>';
          numIncorect++;
          document.getElementById('stat').innerHTML = '<h3><table><tr><td>Write Answers</td><td>' + numcorect + '</td></tr><tr><td>Wrong Answers</td><td>' + numIncorect + '</td></tr></table></h3>';
          document.getElementById('stick').innerHTML = '<iframe src="https://giphy.com/embed/Uovh2D0VZpQeHEitjU" width="100" height="100" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/skeptical-physicsgirl-diannacowern-Uovh2D0VZpQeHEitjU">via GIPHY</a></p>';
          now_time = (new Date()).getTime();
        }
        rectangle[q] = new google.maps.Rectangle({
          bounds: bounds[q],
          strokeColor: '#FF0000', // red
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          rect_id: i,
          map: map
        });

      }
      q = q + 1;
      if ((quest[q] != undefined && q<5 &&getParameterByName('mode')==1)||(quest[q] != undefined && q<6 &&getParameterByName('mode')==2)) document.getElementById('answer').innerHTML += '<h4>' + quest[q] + '</h4>';
      if ((q > 5 && getParameterByName('mode')==1)||(q > 6 && getParameterByName('mode')==2)) window.location = "index.html"; // I changed 6 to 5 for > and ==
      if ((q == 5 && getParameterByName('mode')==1)||(q == 6 && getParameterByName('mode')==2)) {
        document.getElementById('answer').innerHTML += '<h3>Double click on map to restart test. : Total time taken: ' + (((new Date()).getTime()) - total_time) / 1000 + ' sec </h3>';
        pauseTimer();
      }
    });
  }



  map.addListener('dblclick', function(mapsMouseEvent) {

    
    if ((quest[q] != undefined && q<5 &&getParameterByName('mode')==1)||(quest[q] != undefined && q<6 &&getParameterByName('mode')==2)) {
      document.getElementById('answer').innerHTML += '<h4><red>&nbsp;&nbsp;&nbsp;&nbsp;Sorry Wrong Location</red> : time taken: ' + (((new Date()).getTime()) - now_time) / 1000 + ' sec </h4>';
      numIncorect++;
      document.getElementById('stat').innerHTML = '<h3><table><tr><td>Write Answers</td><td>' + numcorect + '</td></tr><tr><td>Wrong Answers</td><td>' + numIncorect + '</td></tr></table></h3>';
      document.getElementById('stick').innerHTML = '<iframe src="https://giphy.com/embed/Uovh2D0VZpQeHEitjU" width="100" height="100" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/skeptical-physicsgirl-diannacowern-Uovh2D0VZpQeHEitjU">via GIPHY</a></p>';
      now_time = (new Date()).getTime();
      rectangle[q] = new google.maps.Rectangle({
      bounds: bounds[q],
      strokeColor: '#FF0000',  //red
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      rect_id: i,
      map: map
    });
    }
    q = q + 1;
    if ((quest[q] != undefined && q<5 &&getParameterByName('mode')==1)||(quest[q] != undefined && q<6 &&getParameterByName('mode')==2)) document.getElementById('answer').innerHTML += '<h4>' + quest[q] + '</h4>';
    if ((q > 5 && getParameterByName('mode')==1)||(q > 6 && getParameterByName('mode')==2)) window.location = "index.html"; 
    if ((q == 5 && getParameterByName('mode')==1)||(q == 6 && getParameterByName('mode')==2)) {
      document.getElementById('answer').innerHTML += '<h3>Double click on map to restart test. : Total time taken: ' + (((new Date()).getTime()) - total_time) / 1000 + ' sec </h3>';
      pauseTimer();
    }
    var bubble = new google.maps.InfoWindow({
      content: buildBubbleContent(param1, param2)
    });
    bubble.open(map, marker);
    google.maps.event.addListenerOnce(marker, "visible_changed", function() {
      bubble.close();
    });
  });
}

if(getParameterByName('mode')==1||getParameterByName('mode')==2){    //This starts the timer as soon as a level is chosen easy/hard.
  startTimer();
  datee = new Date();
  now_time = (new Date()).getTime();
  total_time = now_time;
}