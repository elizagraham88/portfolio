$(document).ready(function() {

	//load the datepicker UI
  $( "#res-date" ).datepicker();

  //load the timepicker UI
  //$('#res-time').timepicker();

  $('#res-time, #res-endTime').timepicker({
});

 	//run the google map functionality
	initMap();

  // call the function to get all reservations in the DB
  getReservations();


  //call the function
  callOpenWeatherMap();
    
});


//Reservation Data 

// Step 1 - Initialize Firebase
  var config = {
    apiKey: "AIzaSyCLHJ1NgpsrbTKyACqXDd2THPaEDWy6dkU",
    authDomain: "reservation-site-62e9b.firebaseapp.com",
    databaseURL: "https://reservation-site-62e9b.firebaseio.com",
    projectId: "reservation-site-62e9b",
    storageBucket: "reservation-site-62e9b.appspot.com",
    messagingSenderId: "632269588203"
  };

firebase.initializeApp(config);

var database = firebase.database();

//Step 2 - Create an blank object
var reservationData = {};

//Step 3 - get the name/date/time data using an on change event
$("#res-date, #res-time").change(function() {

  
  reservationData.date = $('#res-date').val();
  reservationData.time = $('#res-time').val();
});


//Step 4 - on submit event w/ validation
$('.make-res').on('submit', function(e) {
  e.preventDefault();

  reservationData.name = $('#res-name').val();
  reservationData.endTime = $('#res-endTime').val();
  

  //form field validation
  var formFields = ['#res-name', '#res-name', '#res-date', '#res-time', '#res-endTime'];

  for(var i = 0; i < formFields.length; i++){

      if($(formFields[i]).val() === "" || $(formFields[i]).val() === undefined){
        $(formFields[i]).addClass("error-input");
        $('.error-text').show();
      }else{
        $(formFields[i]).removeClass("error-input").addClass("valid-input");
        $('.error-text').hide();
      }
  }



  //Step 5 - if all fields are valid, post to data to the Firebase DB
  if(reservationData.name && reservationData.date && reservationData.time !== ""){

    var reservationsReference = database.ref('reservations');
    reservationsReference.push(reservationData);

    //reset the form
    $('input[type=text]').val("").removeClass();
    $('.error-text').hide();

  }

  
  
});

var closedTimes = [];

//Step 6 - create function declaration
function getReservations() {

  // use reference to database to listen for changes in reservations data
  database.ref('reservations').on('value', function(results) {

    //listen for any changes to the DB
    var allReservations = results.val();
  

    // remove all reservations from table DOM 
    $('.reservations').empty();

    // Step 7 - for loop thru the object data from the DB
    for (var reservation in allReservations) {

    // create object
      var context = {
        name: allReservations[reservation].name,
        date: allReservations[reservation].date,
        time: allReservations[reservation].time,
        endTime: allReservations[reservation].endTime,
        reservationId: reservation
      };

      //add the confirmed reservation times to the blank array
      closedTimes.push([allReservations[reservation].time, allReservations[reservation].endTime]);
      //console.log(closedTimes);

   
    //Step 8 - inject handlebars HTML w/ the results data object
      
     var source = $("#reservation-template").html();

     var template = Handlebars.compile(source);

     var reservationListItem = template(context);

     $('.reservations').append(reservationListItem);

    }

  });


  //$('#res-time').timepicker({
  //  'disableTimeRanges': closedTimes
  //});

}




//Cancel a reservation from DB

$('.reservations').on('click', '.cancel', function (e) {
    e.preventDefault();

    var removeRes = $(e.target).parent().parent().data('id');

    database.ref('reservations').child(removeRes).remove();
    $(this).parent().parent().remove();
});


//Google Maps
function initMap() {

    // create object to store the coord values
    var resLocation = {

      lat: 40.7703983,
      lng: -73.9675101
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
 	  title: $('h1').text()
    });
  
}




//OpenWeatherMap API 

var OPEN_WEATHER_MAP_API = "https://circuits-api.generalassemb.ly/8737fcf3-6a39-4548-a324-209d535e59fd?q=";

//"http://api.openweathermap.org/data/2.5/weather?appid=921b68e67acb87e6b28adfca929e3b51&q=";
//var API_KEY = "921b68e67acb87e6b28adfca929e3b51";
var city = "NY,NY";
var resultElement = $(".cur-weather");

function callOpenWeatherMap(){
 
    $.get(OPEN_WEATHER_MAP_API + city, function(searchResult) {
      //console.log(searchResult.main.temp);
       
      var Ftemp =  Math.round(1.8 * (searchResult.main.temp - 273) + 32);
      //console.log(Ftemp);
      resultElement.html(Ftemp);
     });

}







