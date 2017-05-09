$(document).ready(function() {

	//load datepicker UI
    $( "#datepicker" ).datepicker();


 	//run the google map function
	initMap();
    
});


// google map function
function initMap() {

    // create object to store the coord values
    var resLocation = {

      lat: 40.8054491,
      lng: -73.9654415
    };
     

	//map constructor method
    var map = new google.maps.Map(document.getElementById('map'), {
      center: resLocation,
      zoom: 16,  //level of map zoom
      scrollwheel: false  
    });
    
	//marker constuctor method
    var marker = new google.maps.Marker({
    position: resLocation,
    map: map,
 	title: "Monk's Cafe" 
    });
  
}