var temp = [];
var cityNameTemp = [];
var locCity = [];
var responseForVenues = [];
var responseOfExhibition = [];
var lattitude;
var longttitude;
var currentDate;
var distance="";
var distanceEx="";
var distanceVe="";
var distanceMap="";
var distanceMerged="";
var distanceMerShow="";
var mergedData = [];
var venTemp = [];
var exhibTemp = [];
var allTypes = [];
var uniqueTypes = [];
var numberOfVenues = [];
var numberOfExhibition = [];
var unTypes = [];
var eventExh = [];
var eventVen = [];
var adVen = [];
var adExh = [];
var freeAdmission = [];
var userLang;

function search() {
	var cityName = document.getElementById('searchCity').value;
	var startDate = document.getElementById('startDate').value;
	var endDate = document.getElementById('endDate').value;
	locCity = cityName;
	cityNameTemp = [];
	cityNameTemp = cityName;
	
	responseForVenues = [];
	$('.result-box').remove();
	$("h2").remove();

	$.ajax({
		type : "GET",
		url : "/weather"
	}).success(
			function(data) {
				$("#temperature").empty();
				data['date'][1]--;
				$("#temperature").append(
						' <div class="place pull-left"><span>'
								+ moment(data['date']).lang(userLang).format('dddd, Do MMMM')
								+ '</span><br><span>' + locCity
								+ '</span></div>');

				document.getElementById("footerDate").innerHTML = moment(
						data['date']).lang(userLang).format('dddd, Do MMMM')
						+ '</span><br><span>' + locCity;

			});

	$.ajax(
			
			{
				type : "GET",
				url : "getDataFromSite?urlData=" + cityName + ","
						+ startDate.replace("From", " ") + ","
						+ endDate.replace("To", " ")
			}).success(function(data) {
		responseForVenues = data;
		getDataFromEvent();
	});
}
function getDataFromEvent() {
	var cityName = document.getElementById('searchCity').value;
	var startDate = document.getElementById('startDate').value;
	var endDate = document.getElementById('endDate').value;
	responseOfExhibition = [];
	$.ajax(
			{
				type : "GET",
				url : "getDataFromEvent?urlData=" + cityName + ","
						+ startDate.replace("From", " ") + ","
						+ endDate.replace("To", " ")
			}).success(function(data) {
		responseOfExhibition = data;
		mergeArray();
	});
}
// commented by sandeep

// function init(requested){
// $('.result-box').remove();
// $("h2").remove();
// $.ajax({
// type : "GET",
// url : "getDataFromSite?urlData="+requested
// }).success(function(data) {
// responseForVenues=data;
// mergeArray();
// });
// $.ajax({
// type : "GET",
// url : "getDataFromEvent?urlData="+requested
// }).success(function(data) {
// responseOfExhibition=data;
// });
// }

function mergeArray() {
	var m="";
	mergedData = responseForVenues.concat(responseOfExhibition);
	temp = mergedData;

	if (mergedData != "") {

		if ($('#noResult').show()) {
			$('#noResult').hide();
		}
		if (responseForVenues.length == 0) {

			$('#venueD').hide();
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ' : '
							+ responseOfExhibition.length
							+ ' Exhibitions</h2></div>');
		}
		if (responseOfExhibition.length == 0) {

			$('#exhibD').hide();
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ' : '
							+ responseForVenues.length + ' Venues </h2></div>');
		}
		if(responseForVenues.length != 0 && responseOfExhibition.length != 0) {
			
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ' : '
							+ responseForVenues.length + ' Venues / '+ responseOfExhibition.length + ' Exhibitions</h2></div>');
		}

		for ( var key in mergedData) {
			if (mergedData[key].free) {
				long=mergedData[key].location.x;
				lat=mergedData[key].location.y;
		
				function distanceCalculationMerged(lat, long, lattitude, longttitude)
				{
					
					 var radlat1 = Math.PI * lattitude/180
				     var radlat2 = Math.PI * lat/180
				     var radlon1 = Math.PI * long/180
				     var radlon2 = Math.PI * longttitude/180
				     var theta = long-longttitude
				     var radtheta = Math.PI * theta/180
				     var unit="K";
					 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					 dist = Math.acos(dist)
					 dist = dist * 180/Math.PI
				     dist = dist * 60 * 1.1515
				     if (unit=="K") { dist = dist * 1.609344 }
				     if (unit=="N") { dist = dist * 0.8684 }
				 	return dist;
					
				}

				distanceMerged = distanceCalculationMerged(lat, long, lattitude, longttitude);
				
				if(Math.round(distanceMerged)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distanceMerged);
			
					}
				
				
				$("#searchResult")
						.append(
								'<a target="_blank" href ='
										+ mergedData[key].website
										+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
										+ mergedData[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ mergedData[key].name
										+ '</h4><div class="venue-add">'
										+ mergedData[key].address.city
										+ '</div><div class="venue-description">'
										+ mergedData[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ mergedData[key].displaySchedules + '<br>' + mergedData[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			} else {
				$("#searchResult")
						.append(
								'<a target="_blank" href ='
										+ mergedData[key].website
										+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
										+ mergedData[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ mergedData[key].name
										+ '</h4><div class="venue-add">'
										+ mergedData[key].address.city
										+ '</div><div class="venue-description">'
										+ mergedData[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ mergedData[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			}
		}
		GetVenueTypes(mergedData);
		GetPrefTypes(mergedData);

	} else {
		$("#totalNumberOfRecords").append($('#noResult').show());
	}
	getCordinate();

}


function getCordinate() {
$('#largeModal').on('shown.bs.modal',function() {
var key = [];
for (key in temp) {
}
						var map = new google.maps.Map(document.getElementById('map-t'),
								{
									zoom : 13,
									center : new google.maps.LatLng(
											temp[key].location.y,
											temp[key].location.x),
									// center: new google.maps.LatLng(lattitude,
									// longttitude),
									mapTypeId : google.maps.MapTypeId.ROADMAP,
									zoomControl : true,
									disableDefaultUI : true
															});
						
						var infowindow = new google.maps.InfoWindow();
						var marker, i;
						$.each(temp,function(index, value) {
						var longAdd=value.location.x;
						var latAdd=value.location.y;
						
						function distanceCalculationMap(longAdd, latAdd, lattitude, longttitude)
						{
							
							 var radlat1 = Math.PI * lattitude/180
						     var radlat2 = Math.PI * latAdd/180
						     var radlon1 = Math.PI * longAdd/180
						     var radlon2 = Math.PI * longttitude/180
						     var theta = longAdd-longttitude
						     var radtheta = Math.PI * theta/180
						     var unit="K";
							 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							 dist = Math.acos(dist)
							 dist = dist * 180/Math.PI
						     dist = dist * 60 * 1.1515
						     if (unit=="K") { dist = dist * 1.609344 }
						     if (unit=="N") { dist = dist * 0.8684 }
						 	return dist;
							
						}

						distanceMap = distanceCalculationMap(longAdd, latAdd, lattitude, longttitude);
						if(distanceMap<30)
							{
					    marker = new google.maps.Marker(
					    		
					    		{position : new google.maps.LatLng(
																value.location.y,
																value.location.x),
														map : map,
														icon : 'img/red-pin.png'
														
													});
												
					   
					    	
											google.maps.event.addListener(marker,'mouseover',(function(marker, i) {
																return function() {marker.setIcon('img/blue-pin.png');
																}
															})(marker, i));
											google.maps.event.addListener(marker,'mouseout',(function(marker, i) {return function() {
																	marker.setIcon('img/red-pin.png');
																}
															})(marker, i));

											google.maps.event
													.addListener(
															marker,
															'mouseover',
															(function(marker, i) {
																return function() {

																	// infowindow.setContent(value.address.street);
																	infowindow.setContent('<img src='
																					+ value.displayImageUrl
																					+ ' style="width:80px;height:50px;"/>'
																					+ '<br>'
																					+ value.address.street
																					+ '<br>'
																					+ value.address.city);
																	infowindow
																			.open(
																					map,
																					marker);
																}
															})(marker, i));
											
										}});
						
					});
	 
}

function temperature() {
	$('.temp').remove();
	$('.place').remove();
	$('.climate').remove();
	$.ajax({
		type : "GET",
		url : "/weather"
	}).success(
			function(data) {
				// cityNameTemp = data['city'];
				data['date'][1];
				$("#temperature").append(
						' <div class="place pull-left"><span>'
								+ moment(data['date']).lang(userLang).format('dddd, Do MMMM')
								+ '</span><br><span>' + data['city']
								+ '</span></div>');
				$("#cityWithDate").append(
						' <div class="temp pull-right"><span>'
								+ data['temperature'] + "°C"
								+ '</span><br><span>' + data['description']
								+ '</span></div>');
				$("#climateImage").append(
						' <div class="climate"><img src= /img/weather/'
								+ data['icon'] + '.png></div> ');
				geoCordinates();
				document.getElementById("footerDate").innerHTML = moment(
						data['date']).lang(userLang).format('dddd, Do MMMM')
						+ '</span><br><span>' + data['city'];

			});
}
function findCity() {
	var results = [];
	var QUERY = document.getElementById("searchCity").value;
	$.ajax({
		type : "GET",
		url : '/search/cities?query=' + QUERY
	}).success(
			function(response) {
				$('#city').html('');
				$.each(response['cities'], function(index, city) {
					city.name = city.name.split('|')[0];
					$('#city').css("display", "block");
					$('#city').append(
							'<li onClick="selectCity(\'' + city.name + '\')" >'
									+ city.name + '  ' + city.postalCode
									+ ' </li>');
				});
			});
	if (QUERY == "") {
		$('#city').css("display", "none");
	}
}

function selectCity(val) {
	
	$('#searchCity').val(val);
	$('#city').css("display", "none");
	geoCordinatesCity(val);
}

function selectType(val) {

	$("#selValue").html(val);
	$('#liContainer').removeClass('displayValue');
	filterOnVenAndExh(val);
}

function selectPref(val) {

	$(".prefContainer").html(val);
	$('#liPrefContainer').removeClass('displayValuePref');
	filterOnVenAndExh(val);
}

function selTypeSection() {

	$('#liContainer').addClass('displayValue');
	$('#liPrefContainer').addClass('displayValuePref');
}

function selType() {

	if ($('#liContainer').hasClass('displayValue')) {

		$('#liContainer').removeClass('displayValue');
	} else {
		$('#liContainer').addClass('displayValue');
	}
}

function selPref() {

	if ($('#liPrefContainer').hasClass('displayValuePref')) {

		$('#liPrefContainer').removeClass('displayValuePref');
	} else {
		$('#liPrefContainer').addClass('displayValuePref');
	}
}

function filterOnMap() {
	var venuesCheckBoxOnMap = document.getElementById('r1').checked;
	var exhibitionCheckBoxOnMap = document.getElementById('r2').checked;
	var freeAdmissionCheckBoxOnMap = document.getElementById('cc1').checked;
	var forkidsCheckBoxOnMap = document.getElementById('cc2').checked;
	var prefrenceType = document.getElementById("preferenceInMap").value;
	var venuesType = document.getElementById("typesInMap").value;
	var destination = document.getElementById('destination').checked;
	var tempArray = [];
	var venues = [];
	var exhibition = [];
	var freeAdmission = [];
	var exhibitionLocal = [];
	var afterSplit = venuesType.split(" ");
	venuesType = afterSplit[0];
	for (var i = 1; i < afterSplit.length; i++) {
		venuesType += "_" + afterSplit[i];
	}
	venuesType = venuesType.toUpperCase().replace(' ', '_')
	if (destination == true) {
		if (venuesCheckBoxOnMap == true) {
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == false && venuesType == "ALL") {
				if (responseForVenues != '') {
					temp = responseForVenues;
					mapData();
				}
			}
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == false && venuesType != "ALL") {
				for (value in responseForVenues) {
					if (responseForVenues[value].type == venuesType) {
						tempArray.push(responseForVenues[value]);
					}
				}
				if (tempArray != '') {
					temp = tempArray;
					mapData();
				}
			}
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == true
					&& forkidsCheckBoxOnMap == false && venuesType == "ALL") {
				for (key in responseForVenues) {
					if (responseForVenues[key].free) {
						venues.push(responseForVenues[key]);
					}
				}
				if (venues != '') {
					temp = venues;
					mapData();
				}
			}
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == true && venuesType == "ALL") {
				for (key in responseForVenues) {
					if ((responseForVenues[key].tags)
							.indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
						venues.push(responseForVenues[key]);
					}
				}
				if (venues != '') {
					temp = venues;
					mapData();
				}
			}
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == true
					&& forkidsCheckBoxOnMap == true && venuesType == "ALL") {
				for (key in responseForVenues) {
					if ((responseForVenues[key].tags)
							.indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
						venues.push(responseForVenues[key]);
					}
				}
				for (key in responseForVenues) {
					if (responseForVenues[key].free) {
						freeAdmission.push(responseForVenues[key]);
					}
				}
				var local = freeAdmission.concat(venues);
				if (local != '') {
					temp = local;
					mapData();
				}
			}
		} else {
			if (exhibitionCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == false) {
				if (responseOfExhibition != '') {
					temp = responseOfExhibition;
					mapData();
				}
			}
			if (exhibitionCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == true
					&& forkidsCheckBoxOnMap == false) {
				for (key in responseOfExhibition) {
					if (responseOfExhibition[key].free) {
						exhibition.push(responseOfExhibition[key]);
					}
				}
				if (exhibition != '') {
					temp = exhibition;
					mapData();
				}
			}
			if (exhibitionCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == true) {
				for (key in responseOfExhibition) {
					if ((responseOfExhibition[key].tags)
							.indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
						exhibition.push(responseOfExhibition[key]);
					}
				}
				if (exhibition != '') {
					temp = exhibition;
					mapData();
				}
			}
			if (exhibitionCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == true
					&& forkidsCheckBoxOnMap == true) {
				for (key in responseOfExhibition) {
					if ((responseOfExhibition[key].tags)
							.indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
						exhibition.push(responseOfExhibition[key]);
					}
				}
				for (key in responseOfExhibition) {
					if (responseOfExhibition[key].free) {
						exhibitionLocal.push(responseOfExhibition[key]);
					}
				}
				var local = exhibitionLocal.concat(exhibition);
				if (local != '') {
					temp = local;
					mapData();
				}
			}
		}
	} else {
		var afterSplit = prefrenceType.split(" ");
		prefrenceType = afterSplit[0];
		for (var i = 1; i < afterSplit.length; i++) {
			prefrenceType += "_" + afterSplit[i];
		}
		prefrenceType = prefrenceType.toUpperCase().replace(' ', '_')
		if (venuesCheckBoxOnMap == true) {
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == false && prefrenceType == "ALL") {
				if (responseForVenues != '') {
					temp = responseForVenues;
					mapData();
				}
			}
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == true
					&& forkidsCheckBoxOnMap == false && prefrenceType == "ALL") {
				for (key in responseForVenues) {
					if (responseForVenues[key].free) {
						venues.push(responseForVenues[key]);
					}
				}
				if (venues != '') {
					temp = venues;
					mapData();
				}
			}
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == true && prefrenceType == "ALL") {
				for (key in responseForVenues) {
					if ((responseForVenues[key].tags)
							.indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
						venues.push(responseForVenues[key]);
					}
				}
				if (venues != '') {
					temp = venues;
					mapData();
				}
			}
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == true
					&& forkidsCheckBoxOnMap == true && prefrenceType == "ALL") {
				for (key in responseForVenues) {
					if ((responseForVenues[key].tags)
							.indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
						venues.push(responseForVenues[key]);
					}
				}
				for (key in responseForVenues) {
					if (responseForVenues[key].free) {
						freeAdmission.push(responseForVenues[key]);
					}
				}
				var local = freeAdmission.concat(venues);
				if (local != '') {
					temp = local;
					mapData();
				}
			}
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == false && prefrenceType != "ALL") {
				for (value in responseForVenues) {
					if ((responseForVenues[value].tags).indexOf(prefrenceType) > -1) {
						tempArray.push(responseForVenues[value]);
					}
				}
				if (tempArray != '') {
					temp = tempArray;
					mapData();
				}
			}
			if (venuesCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == true
					&& forkidsCheckBoxOnMap == true && prefrenceType != "ALL") {
				for (value in responseForVenues) {
					if ((responseForVenues[value].tags).indexOf(prefrenceType) > -1) {
						tempArray.push(responseForVenues[value]);
					}
				}
				if (tempArray != '') {
					temp = tempArray;
					mapData();
				}
			}

		} else {
			if (exhibitionCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == false && prefrenceType == "ALL") {
				if (responseOfExhibition != '') {
					temp = responseOfExhibition;
					mapData();
				}
			}
			if (exhibitionCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == true
					&& forkidsCheckBoxOnMap == false && prefrenceType == "ALL") {
				for (key in responseOfExhibition) {
					if (responseOfExhibition[key].free) {
						exhibition.push(responseOfExhibition[key]);
					}
				}
				if (exhibition != '') {
					temp = exhibition;
					mapData();
				}
			}
			if (exhibitionCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == true && prefrenceType == "ALL") {
				for (key in responseOfExhibition) {
					if ((responseOfExhibition[key].tags)
							.indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
						exhibition.push(responseOfExhibition[key]);
					}
				}
				if (exhibition != '') {
					temp = exhibition;
					mapData();
				}
			}
			if (exhibitionCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == true
					&& forkidsCheckBoxOnMap == true && prefrenceType == "ALL") {
				for (key in responseOfExhibition) {
					if ((responseOfExhibition[key].tags)
							.indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
						exhibition.push(responseOfExhibition[key]);
					}
				}
				for (key in responseOfExhibition) {
					if (responseOfExhibition[key].free) {
						freeAdmission.push(responseOfExhibition[key]);
					}
				}
				var local = freeAdmission.concat(exhibition);
				if (local != '') {
					temp = local;
					mapData();
				}
			}
			if (exhibitionCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == false
					&& forkidsCheckBoxOnMap == false && prefrenceType != "ALL") {
				for (value in responseOfExhibition) {

					if ((responseOfExhibition[value].tags)
							.indexOf(prefrenceType) > -1) {
						tempArray.push(responseOfExhibition[value]);
					}
				}
				if (tempArray != '') {
					temp = tempArray;
					mapData();
				}
			}
			if (exhibitionCheckBoxOnMap == true
					&& freeAdmissionCheckBoxOnMap == true
					&& forkidsCheckBoxOnMap == true && prefrenceType != "ALL") {
				for (value in responseOfExhibition) {

					if ((responseOfExhibition[value].tags)
							.indexOf(prefrenceType) > -1) {
						tempArray.push(responseOfExhibition[value]);
					}
				}
				if (tempArray != '') {
					temp = tempArray;
					mapData();
				}
			}
		}

	}
}
function mapData() {
	var key = [];
	for (key in temp) {
	}
	var map = new google.maps.Map(document.getElementById('map-t'), {
		zoom : 13,
		center : new google.maps.LatLng(temp[key].location.y,
				temp[key].location.x),
		// center: new google.maps.LatLng(lattitude, longttitude),
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		zoomControl : true,
		disableDefaultUI : true
	});

	var infowindow = new google.maps.InfoWindow();

	var marker, i;
	$.each(temp, function(index, value) {
		if ($('#r1').prop('checked')) {
			marker = new google.maps.Marker({
				position : new google.maps.LatLng(value.location.y,
						value.location.x),
				map : map,
				icon : 'img/red-pin.png'
			});
			google.maps.event.addListener(marker, 'mouseout', (function(marker,
					i) {
				return function() {
					marker.setIcon('img/red-pin.png');
				}
			})(marker, i));
		} else if ($('#r2').prop('checked')) {
			marker = new google.maps.Marker({
				position : new google.maps.LatLng(value.location.y,
						value.location.x),
				map : map,
				icon : 'img/red-pin.png'
			});
			google.maps.event.addListener(marker, 'mouseout', (function(marker,
					i) {
				return function() {
					marker.setIcon('img/red-pin.png');
				}
			})(marker, i));
		}
		google.maps.event.addListener(marker, 'mouseover',
				(function(marker, i) {
					return function() {
						marker.setIcon('img/blue-pin.png');
					}
				})(marker, i));

		google.maps.event.addListener(marker, 'mouseover',
				(function(marker, i) {
					return function() {

						infowindow.setContent('<img src='
								+ value.displayImageUrl
								+ ' style="width:80px;height:50px;"/>' + '<br>'
								+ value.address.street + '<br>'
								+ value.address.city);
						infowindow.open(map, marker);
					}
				})(marker, i));

	});
	// }
}

function firstMap() {
	var key = [];
	for (key in temp) {
	}
	var map = new google.maps.Map(document.getElementById('map-t-thumb'), {
		zoom : 13,
		center : new google.maps.LatLng(lattitude, longttitude),
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		zoomControl : true,
		disableDefaultUI : true
	});
	var infowindow = new google.maps.InfoWindow();
}



function onPageLoad() {
	userLang = navigator.language || navigator.userLanguage;

	if(userLang == 'fr') {
  	  $('#displayRemoveDefaultLang').remove();
      $('#aarfre').clone().appendTo('#displayDefaultLang');
   
      
	} else if (userLang == 'en') {
	  $('#displayRemoveDefaultLang').remove();
	  $('#aareng').clone().appendTo('#displayDefaultLang');
	}
	
	var now = new Date();
	currentDate = now.getFullYear() + "-" + (+now.getMonth() + 1) + "-"
			+ now.getDate();

	$('#noResult').hide();
	$('#preferences').change(function() {
		if ($(this).prop('checked')) {
			$('#c1').prop('checked', true);
			$('#c2').prop('checked', true);
			$('#c3').prop('checked', false);
			$('#c3').prop('checked', false);
			$('#c4').prop('checked', false);
			$('#cc1').prop('checked', false);
			$('#cc2').prop('checked', false);
			$('#prefrence').show();
			$('#prefer').hide();
			$('#preferenceDivInMap').show();
		} else {
			$('#prefrence').hide();
			$('#preferenceDivInMap').hide();
		}
	});
	$('#preferences').trigger('change');

	$('#destination').change(function() {
		if ($(this).prop('checked')) {
			$('#c1').prop('checked', true);
			$('#r1').prop('checked', true);
			$('#c2').prop('checked', true);
			$('#c3').prop('checked', false);
			$('#c4').prop('checked', false);
			$('#cc1').prop('checked', false);
			$('#cc2').prop('checked', false);
			$('#prefrence').hide();
			$('#typeDivInMap').show();
			$('#preferenceDivInMap').hide();
			if ($('#c1').prop('checked')) {
				$('#prefer').show();
			} else {
				$('#prefer').hide();
			}
		} else {
			$('#cc1').prop('checked', false);
			$('#cc2').prop('checked', false);
			$('#prefer').hide();
			$('#typeDivInMap').hide();
		}
	});
	$('#destination').trigger('change');

	$('#c2').change(function() {
		if ($(this).prop('checked')) {
			$('#r2').prop('checked', true);
			$('#typeDivInMap').hide();
		} else {
			$('#exhibD').css("display", "true");
			$('#r2').prop('checked', false);
			$('#typeDivInMap').show();
		}
	});
	$('#c2').trigger('change');

	$('#c1').change(function() {
		if ($(this).prop('checked')) {
			$('#r1').prop('checked', true);
			$('#typeDivInMap').show();
			if ($('#destination').prop('checked')) {
				$('#prefer').show();
			}
		} else {
			if ($('#c2').prop('checked')) {
				$('#r2').prop('checked', true);
			}
			$('#r1').prop('checked', false);
			$('#prefer').hide();
			$('#typeDivInMap').hide();
		}
	});
	$('#c1').trigger('change');

	$('#c3').change(function() {
		if ($(this).prop('checked')) {
			$('#cc1').prop('checked', true);
		} else {
			$('#cc1').prop('checked', false);
		}
	});
	$('#c3').trigger('change');

	$('#c4').change(function() {
		if ($(this).prop('checked')) {
			$('#cc2').prop('checked', true);
		} else {
			$('#cc2').prop('checked', false);
		}
	});
	$('#c4').trigger('change');

	// end// check same filter on map as on search page

	// ///////////////hide show type div

	$('#r1').change(function() {
		if ($('#destination').prop('checked')) {
			$('#typeDivInMap').show();
		}
	});
	$('#r1').trigger('change');

	$('#r2').change(function() {
		if ($(this).prop('checked')) {
			$('#typeDivInMap').hide();
		}
	});
	$('#r2').trigger('change');

	// autocomplete js
	$(document).ready(
			function() {
				$('body').click(
						function(e) {
							if ($("#city").is(":visible")
									&& !$("#searchCity").is(e.target)
									&& !$("#city").is(e.target)) {
								$("#city").fadeOut();
							}
						});
			});

	// ///////////////hide show type div

	// //on destination/preferance

	$('#prefrences').change(function() {
		if ($(this).prop('checked')) {
			$('#typeDivInMap').hide();
			$('#preferenceDivInMap').show();
		} else {
			$('#preferenceDivInMap').hide();
		}
	});
	$('#prefrences').trigger('change');
}
// function showRecordsOnChanged(){
// // showRecordsOnLoad();
// }

function GetVenueTypes(responseForVenues) {
	allTypes = [];
	uniqueTypes = [];

	
	$('#liContainer').empty();

	for (key in responseForVenues) {

		allTypes.push(responseForVenues[key].type);
	}

	uniqueTypes.push('All');

	for (var i = 0; i < allTypes.length; i++) {
		if ((jQuery.inArray(allTypes[i], uniqueTypes)) == -1) {
			uniqueTypes.push(allTypes[i]);
		}
	}

	var lowerTypes = [];
	var midTypes = [];
	var finalTypes =[];
	for(var i=0;i<uniqueTypes.length;i++)
	{
      
		lowerTypes.push(uniqueTypes[i].toLowerCase());
	}
	
	for(var i=0;i<lowerTypes.length;i++)
	{
		midTypes.push(lowerTypes[i].replace(/_/g, ' '));
	}
	
	for(var i=0;i<midTypes.length;i++)
	{
		finalTypes.push(midTypes[i].substring(0, 1).toUpperCase() + midTypes[i].substring(1));
	}
	

	for (key in finalTypes) {
		$('#liContainer').append(

				'<li onClick="selectType(\'' + finalTypes[key]
						+ '\')">>&nbsp;'
						+ finalTypes[key] + '</li>');
	}
}

function GetPrefTypes(mergedData) {
	allTypes = [];
	uniqueTypes = [];
	var tagTypes = [];
	unTypes = [];

	$('#liPrefContainer').empty();
	var cityName = document.getElementById('searchCity').value;
	for (key in mergedData) {
		if (mergedData[key].address.city == cityName)
			tagTypes.push(mergedData[key].tags);
	}

	uniqueTypes.push('All');

	for (tag in tagTypes) {
		for (var i = 0; i < tagTypes[tag].length; i++) {
			allTypes.push(tagTypes[tag][i]);
		}
	}

	for (var i = 0; i < allTypes.length; i++) {
		if ((jQuery.inArray(allTypes[i], uniqueTypes)) == -1) {
			uniqueTypes.push(allTypes[i]);
		}
	}

	var lowerTypes = [];
	var midTypes = [];
	var finalTypes =[];
	
	for(var i=0;i<uniqueTypes.length;i++)
	{
      
		lowerTypes.push(uniqueTypes[i].toLowerCase());
	}
	
	for(var i=0;i<lowerTypes.length;i++)
	{
		midTypes.push(lowerTypes[i].replace(/_/g, ' '));
	}
	
	for(var i=0;i<midTypes.length;i++)
	{
		finalTypes.push(midTypes[i].substring(0, 1).toUpperCase() + midTypes[i].substring(1));
	}
	
	for (key in finalTypes) {
     if(finalTypes[key]!="")
	  {
		$('#liPrefContainer').append(

				'<li onClick="selectPref(\'' + finalTypes[key]
						+ '\')">>&nbsp;'
						+ finalTypes[key] + '</li>');
	  }
	}
}

function geoCordinates() {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		'address' : cityNameTemp
		
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			lattitude = results[0].geometry.location.lat();
			longttitude = results[0].geometry.location.lng();
			firstMap();
			
		} else {
			alert("Something got wrong " + status);
		}
	});
}

function geoCordinatesCity(city)
{
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		'address' : city
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			
			lattitude = results[0].geometry.location.lat();
			longttitude = results[0].geometry.location.lng();
			firstMap();
	} else {
			alert("Something got wrong " + status);
		}
	});
}
	
function freeAdmissionOne() {
	
	temp = mergedData; 
	var freeAdmissionCheckBox = document.getElementById('c3').checked;
	var forTheKids = document.getElementById('c4').checked;
	
	adVen = [];
	adExh = [];
	var venues = [];
	var event = [];
	freeAdmission = [];
	for (key in temp) {
		if (temp[key].free) {
			freeAdmission.push(temp[key]);
		}
	}
	for (key in responseForVenues) {
		if (responseForVenues[key].free) {
			venues.push(responseForVenues[key]);
			adVen.push(responseForVenues[key]);
		}
	}
	for (key in responseOfExhibition) {
		if (responseOfExhibition[key].free) {
			event.push(responseOfExhibition[key]);
			adExh.push(responseOfExhibition[key]);
		}
	}
	
	if (freeAdmissionCheckBox == true && forTheKids == false) {
	
		$('.result-box').remove();
		adKidCombo = freeAdmission;
		venCombo = adVen;
		exhCombo = adExh;
		showList(venCombo, exhCombo, adKidCombo );
	}	
	else if(forTheKids == true && freeAdmission == true) {
	
		  venCombo	= eventVen.concat(adVen);
		  exhCombo	= eventExh.concat(adExh);
		  adKidCombo = forTheKids.concat(freeAdmission);
			 showList(venCombo, exhCombo, adKidCombo );
	}	
	
	else {
		$("h2").remove();
		$('.result-box').remove();
		mergeArray();
	}
}

function forTheKids() {
	temp = mergedData; // for proper initialization of data into temp or to
	// resolve conflict of data
	var forTheKidsCheckBox = document.getElementById('c4').checked;
	var freeAdmission = document.getElementById('c3').checked;
	eventVen = [];
	eventExh = [];
	var forTheKids = [];

   $("#totalNumberOfRecords").empty();
	
	for (key in temp) {
		if ((temp[key].tags).indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
			forTheKids.push(temp[key]);
		}
	}
	
	for (key in responseForVenues) {
		if ((responseForVenues[key].tags)
				.indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
			eventVen.push(responseForVenues[key]);
		}
	}
	
	for (key in responseOfExhibition) {
		if ((responseOfExhibition[key].tags)
				.indexOf('PASSER_UN_BON_MOMENT_EN_FAMILLE') > -1) {
			eventExh.push(responseOfExhibition[key]);
		}
		
	}
	
	if (forTheKidsCheckBox == true && freeAdmission == false) {

		$('.result-box').remove();		
				adKidCombo = forTheKids;
				venCombo = eventVen;
				exhCombo = eventExh;
		showList(venCombo, exhCombo, adKidCombo );
		
	}
	else if(forTheKidsCheckBox == true && freeAdmission == true) {

		  venCombo	= eventVen.concat(adVen);
		  exhCombo	= eventExh.concat(adExh);
		  adKidCombo = forTheKids.concat(freeAdmission);
			 showList(venCombo, exhCombo, adKidCombo );
	}	

    else {
		$("h2").remove();
		$('.result-box').remove();
		mergeArray();
	}
	
}

function showList(venCombo, exhCombo, adKidCombo) {
	
	  $("h2").remove();
	if (venCombo.length == 0) {

		$('#venueD').hide();
		$("#totalNumberOfRecords").append(
				'<div class="search-title"><h2>' + locCity + ': '
						+ exhCombo.length + ' Exhibitions</h2></div>');
	}
	if (exhCombo.length == 0) {

		$('#exhibD').hide();
		$("#totalNumberOfRecords").append(
				'<div class="search-title"><h2>' + locCity + ': '
						+ venCombo.length + ' Venues</h2></div>');
	}
	

for ( var value in adKidCombo) {
	if (adKidCombo[value].free) {
		
		long=adKidCombo[value].location.x;
		lat=adKidCombo[value].location.y;

		function distanceCalculationMerged(lat, long, lattitude, longttitude)
		{
			
			 var radlat1 = Math.PI * lattitude/180
		     var radlat2 = Math.PI * lat/180
		     var radlon1 = Math.PI * long/180
		     var radlon2 = Math.PI * longttitude/180
		     var theta = long-longttitude
		     var radtheta = Math.PI * theta/180
		     var unit="K";
			 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			 dist = Math.acos(dist)
			 dist = dist * 180/Math.PI
		     dist = dist * 60 * 1.1515
		     if (unit=="K") { dist = dist * 1.609344 }
		     if (unit=="N") { dist = dist * 0.8684 }
		 	return dist;
			
		}

		distanceMerged = distanceCalculationMerged(lat, long, lattitude, longttitude);
		
		if(Math.round(distanceMerged)<1)
		{
		distanceMerShow ="<1";
	
		}
	else
		{
	distanceMerShow=Math.round(distanceMerged);

		}
		
		$("#searchResult")
				.append(
						'<a target="_blank" href ='
								+ adKidCombo[value].website
								+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
								+ adKidCombo[value].displayImageUrl
								+ '></div><div class="col-md-7"><h4 class="venue-title">'
								+ adKidCombo[value].name
								+ '</h4><div class="venue-add">'
								+ adKidCombo[value].address.city
								+ '</div><div class="venue-description">'
								+ adKidCombo[value].description.fr
								+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
								+ adKidCombo[value].displaySchedules
								+ '</span></p></div></div></div></a>');
	} else {
		$("#searchResult")
				.append(
						'<a target="_blank" href ='
								+ adKidCombo[value].website
								+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
								+ adKidCombo[value].displayImageUrl
								+ '></div><div class="col-md-7"><h4 class="venue-title">'
								+ adKidCombo[value].name
								+ '</h4><div class="venue-add">'
								+ adKidCombo[value].address.city
								+ '</div><div class="venue-description">'
								+ adKidCombo[value].description.fr
								+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
								+ adKidCombo[value].displaySchedules
								+ '</span></p></div></div></div></a>');
	}
}
if (adKidCombo != '') {
	temp = adKidCombo;
	getCordinate();
} else {
	$("h2").remove();
	$("#totalNumberOfRecords").append($('#noResult').show());
}
}

function filterOnVenAndExh(val) {


if ($("#c2").prop('checked')==true){ 
	$("#exhibD").click();
	
}


	temp = mergedData; // for proper initialization of data into temp or to
	// resolve conflict of data
	var venuesType;
	var forTheKidsCheckBox = document.getElementById('c4').checked;
	if (forTheKidsCheckBox) {

		forTheKids();
	}
	var freeAdmissionCheckBox = document.getElementById('c3').checked;
	if (freeAdmissionCheckBox) {

		freeAdmissionOne();
	}
	var venues = document.getElementById('c1').checked;
	var exhibition = document.getElementById('c2').checked;
	
	if (val == undefined) {
		venuesType = 'All';
	} else {
		venuesType = val;
	}
	if (exhibition == false) {
		$('#exhibD').css("display", "none");
	} else {
		$('#exhibD').css("display", "block");
	}
	if (venues == false) {
		$('#venueD').css("display", "none");
	} else {
		$('#venueD').css("display", "block");
	}

	var searchByPreferences = document.getElementById("preferences").checked;
	if (searchByPreferences == true) {
		var prefType = document.getElementById("prefType").innerHTML;
		searchByPrefrence(prefType);
	} else {
		var afterSplit = venuesType.split(" ");
		venuesType = afterSplit[0];
		for (var i = 1; i < afterSplit.length; i++) {
			venuesType += "_" + afterSplit[i];
		}
		venuesType = venuesType.toUpperCase().replace(' ', '_')
		$('.result-box').remove();
		$("h2").remove();
		var tempArray = [];
		var venuesTemp = [];
		var exhibitionTemp = [];
		if (temp != "") {
			
			if (venues == true && exhibition == true && venuesType == 'ALL' ) {
				
				$("#totalNumberOfRecords").append(
						'<div class="search-title"><h2>' + locCity + ': '
								+ responseForVenues.length + ' Venues / '
								+ responseOfExhibition.length
								+ ' Exhibitions</h2></div>');
				for ( var key in temp) {
					if (temp[key].free) {
						//code by nil
						long=temp[key].location.x;
						lat=temp[key].location.y;
				
						function distanceCalculation(lat, long, lattitude, longttitude)
						{
							
							 var radlat1 = Math.PI * lattitude/180
						     var radlat2 = Math.PI * lat/180
						     var radlon1 = Math.PI * long/180
						     var radlon2 = Math.PI * longttitude/180
						     var theta = long-longttitude
						     var radtheta = Math.PI * theta/180
						     var unit="K";
							 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							 dist = Math.acos(dist)
							 dist = dist * 180/Math.PI
						     dist = dist * 60 * 1.1515
						     if (unit=="K") { dist = dist * 1.609344 }
						     if (unit=="N") { dist = dist * 0.8684 }
						 	return dist;
							
						}
						
						distance = distanceCalculation(lat, long, lattitude, longttitude);
						
						if(Math.round(distance)<1)
						{
						distanceMerShow ="<1";
					
						}
					else
						{
					distanceMerShow=Math.round(distance);

						}
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ temp[key].website
												+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
												+ temp[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ temp[key].name
												+ '</h4><div class="venue-add">'
												+ temp[key].address.city
												+ '</div><div class="venue-description">'
												+ temp[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ temp[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					} else {
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ temp[key].website
												+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
												+ temp[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ temp[key].name
												+ '</h4><div class="venue-add">'
												+ temp[key].address.city
												+ '</div><div class="venue-description">'
												+ temp[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ temp[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					}
				}
				temp = temp; // for the confirmation
				getCordinate();
			}
			if (venues == true && exhibition == false && venuesType == 'ALL') {
				$("#totalNumberOfRecords").append(
						'<div class="search-title"><h2>' + locCity + ': '
								+ responseForVenues.length
								+ ' Venues</h2></div>');
				for ( var key in responseForVenues) {
					if (responseForVenues[key].free) {
						
						longex=responseForVenues[key].location.x;
						latex=responseForVenues[key].location.y;
						
						function distanceCalculationEx(latex, longex, lattitude, longttitude)
						{
							
							 var radlat1 = Math.PI * lattitude/180
						     var radlat2 = Math.PI * latex/180
						     var radlon1 = Math.PI * longex/180
						     var radlon2 = Math.PI * longttitude/180
						     var theta = longex-longttitude
						     var radtheta = Math.PI * theta/180
						     var unit="K";
							 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							 dist = Math.acos(dist)
							 dist = dist * 180/Math.PI
						     dist = dist * 60 * 1.1515
						     if (unit=="K") { dist = dist * 1.609344 }
						     if (unit=="N") { dist = dist * 0.8684 }
						 	return dist;
							
						}
						distanceEx=distanceCalculationEx(latex, longex, lattitude, longttitude);
						
						if(Math.round(distanceEx)<1)
						{
						distanceMerShow ="<1";
					
						}
					else
						{
					distanceMerShow=Math.round(distanceEx);

						}
						
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ responseForVenues[key].website
												+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
												+ responseForVenues[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ responseForVenues[key].name
												+ '</h4><div class="venue-add">'
												+ responseForVenues[key].address.city
												+ '</div><div class="venue-description">'
												+ responseForVenues[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ responseForVenues[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					} else {
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ responseForVenues[key].website
												+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
												+ responseForVenues[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ responseForVenues[key].name
												+ '</h4><div class="venue-add">'
												+ responseForVenues[key].address.city
												+ '</div><div class="venue-description">'
												+ responseForVenues[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ responseForVenues[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					}
				}
				if (responseForVenues != '') {
					temp = responseForVenues;
					getCordinate();
				}
			}
			
		
			if (venues == false && exhibition == true && venuesType != 'ALL') {
				
				$("#totalNumberOfRecords").append(
						'<div class="search-title"><h2>' + locCity + ': '
								+ responseOfExhibition.length
								+ ' Exhibitions</h2></div>');
				for ( var key in responseOfExhibition) {
					if (responseOfExhibition[key].free) {
						
						longex=responseOfExhibition[key].location.x;
						latex=responseOfExhibition[key].location.y;
						
						function distanceCalculationEx(latex, longex, lattitude, longttitude)
						{
							
							 var radlat1 = Math.PI * lattitude/180
						     var radlat2 = Math.PI * latex/180
						     var radlon1 = Math.PI * longex/180
						     var radlon2 = Math.PI * longttitude/180
						     var theta = longex-longttitude
						     var radtheta = Math.PI * theta/180
						     var unit="K";
							 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							 dist = Math.acos(dist)
							 dist = dist * 180/Math.PI
						     dist = dist * 60 * 1.1515
						     if (unit=="K") { dist = dist * 1.609344 }
						     if (unit=="N") { dist = dist * 0.8684 }
						 	return dist;
							
						}
						distanceEx=distanceCalculationEx(latex, longex, lattitude, longttitude);
						
						if(Math.round(distanceEx)<1)
						{
						distanceMerShow ="<1";
					
						}
					else
						{
					distanceMerShow=Math.round(distanceEx);

						}
						
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ responseOfExhibition[key].website
												+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
												+ responseOfExhibition[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ responseOfExhibition[key].name
												+ '</h4><div class="venue-add">'
												+ responseOfExhibition[key].address.city
												+ '</div><div class="venue-description">'
												+ responseOfExhibition[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ responseOfExhibition[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					} else {
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ responseOfExhibition[key].website
												+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
												+ responseOfExhibition[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ responseOfExhibition[key].name
												+ '</h4><div class="venue-add">'
												+ responseOfExhibition[key].address.city
												+ '</div><div class="venue-description">'
												+ responseOfExhibition[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ responseOfExhibition[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					}
				}
				if (responseOfExhibition = '') {
					temp = responseOfExhibition;
					getCordinate();
				}
			}
			if (venues == true && exhibition == true && venuesType != 'ALL') {
				for (value in temp) {
					if (temp[value].type == venuesType) {
						tempArray.push(temp[value]);
					}
				}
				venTemp = [];
				for (value in responseForVenues) {
					if (responseForVenues[value].type == venuesType) {
						venuesTemp.push(responseForVenues[value]);

						venTemp.push(responseForVenues[value]);
					}
				}
				exhibTemp = [];
				for (value in responseOfExhibition) {
					if (responseOfExhibition[value].type == venuesType) {
						exhibitionTemp.push(responseOfExhibition[value]);
						exhibTemp.push(responseOfExhibition[value]);
					}
				}

				$("#totalNumberOfRecords").append(
						'<div class="search-title"><h2>' + locCity + ': '
								+ venuesTemp.length + ' Venues / '
								+ exhibitionTemp.length
								+ ' Exhibitions</h2></div>');
				for ( var key in tempArray) {
					if (tempArray[key].free) {
						
						long=tempArray[key].location.x;
						lat=tempArray[key].location.y;
				
						function distanceCalculation(lat, long, lattitude, longttitude)
						{
							
							 var radlat1 = Math.PI * lattitude/180
						     var radlat2 = Math.PI * lat/180
						     var radlon1 = Math.PI * long/180
						     var radlon2 = Math.PI * longttitude/180
						     var theta = long-longttitude
						     var radtheta = Math.PI * theta/180
						     var unit="K";
							 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							 dist = Math.acos(dist)
							 dist = dist * 180/Math.PI
						     dist = dist * 60 * 1.1515
						     if (unit=="K") { dist = dist * 1.609344 }
						     if (unit=="N") { dist = dist * 0.8684 }
						 	return dist;
							
						}
						
						distance = distanceCalculation(lat, long, lattitude, longttitude);
						
						if(Math.round(distance)<1)
						{
						distanceMerShow ="<1";
					
						}
					else
						{
					distanceMerShow=Math.round(distance);

						}
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ tempArray[key].website
												+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
												+ tempArray[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ tempArray[key].name
												+ '</h4><div class="venue-add">'
												+ tempArray[key].address.city
												+ '</div><div class="venue-description">'
												+ tempArray[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp'+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ tempArray[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					} else {
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ tempArray[key].website
												+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
												+ tempArray[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ tempArray[key].name
												+ '</h4><div class="venue-add">'
												+ tempArray[key].address.city
												+ '</div><div class="venue-description">'
												+ tempArray[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ tempArray[key].displaySchedules
												+ '</span></p></div></div></div>');
					}
				}
				if (tempArray != '') {
					temp = tempArray;
					getCordinate();
				} else {
					$("h2").remove();
					$("#totalNumberOfRecords").append($('#noResult').show());
				}
			}// if

			if (venues == true && exhibition == false && venuesType != 'ALL') {
				venTemp = [];
				for (value in responseForVenues) {
					if (responseForVenues[value].type == venuesType) {
						tempArray.push(responseForVenues[value]);

						venTemp.push(responseForVenues[value]);
					}
				}
				$("#totalNumberOfRecords").append(
						'<div class="search-title"><h2>' + locCity + ': '
								+ tempArray.length + ' Venues</h2></div>');
				for ( var key in tempArray) {
					if (tempArray[key].free) {
						
						long=tempArray[key].location.x;
						lat=tempArray[key].location.y;
				
						function distanceCalculation(lat, long, lattitude, longttitude)
						{
							
							 var radlat1 = Math.PI * lattitude/180
						     var radlat2 = Math.PI * lat/180
						     var radlon1 = Math.PI * long/180
						     var radlon2 = Math.PI * longttitude/180
						     var theta = long-longttitude
						     var radtheta = Math.PI * theta/180
						     var unit="K";
							 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							 dist = Math.acos(dist)
							 dist = dist * 180/Math.PI
						     dist = dist * 60 * 1.1515
						     if (unit=="K") { dist = dist * 1.609344 }
						     if (unit=="N") { dist = dist * 0.8684 }
						 	return dist;
							
						}
						
						distance = distanceCalculation(lat, long, lattitude, longttitude);
						
						if(Math.round(distance)<1)
						{
						distanceMerShow ="<1";
					
						}
					else
						{
					distanceMerShow=Math.round(distance);

						}
						
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ tempArray[key].website
												+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
												+ tempArray[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ tempArray[key].name
												+ '</h4><div class="venue-add">'
												+ tempArray[key].address.city
												+ '</div><div class="venue-description">'
												+ tempArray[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ tempArray[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					} else {
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ tempArray[key].website
												+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
												+ tempArray[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ tempArray[key].name
												+ '</h4><div class="venue-add">'
												+ tempArray[key].address.city
												+ '</div><div class="venue-description">'
												+ tempArray[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ tempArray[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					}
				}
				if (tempArray != '') {
					temp = tempArray;
					getCordinate();
				} else {
					$("h2").remove();
					$("#totalNumberOfRecords").append($('#noResult').show());
				}
			}
		} else {
			$("#totalNumberOfRecords").append($('#noResult').show());
		}
	}

}
function searchByPrefrence(prefType) {
	temp = mergedData; // for proper initialization of data into temp or to
	// resolve conflict of data
	var prefrenceType;
	var venues = document.getElementById('c1').checked;
	var exhibition = document.getElementById('c2').checked;
	if (prefType == undefined) {
		prefrenceType = 'All';
	} else {
		prefrenceType = prefType;
	}
	var tempArr = [];
	numberOfVenues = [];
	numberOfExhibition = [];
	var afterSplit = prefrenceType.split(" ");
	prefrenceType = afterSplit[0];
	for (var i = 1; i < afterSplit.length; i++) {
		prefrenceType += "_" + afterSplit[i];
	}
	prefrenceType = prefrenceType.toUpperCase().replace(' ', '_');
	$('.result-box').remove();
	$("h2").remove();
	if (temp != "") {
		if (venues == false) {
			$("#venueD").css("display", "none");
		}
		if (venues == true && exhibition == true && prefrenceType == 'ALL') {
			
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ responseForVenues.length + ' Venues / '
							+ responseOfExhibition.length
							+ ' Exhibitions</h2></div>');
			for ( var key in temp) {
				if (temp[key].free) {
					

					long=temp[key].location.x;
					lat=temp[key].location.y;
			
					function distanceCalculation(lat, long, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * lat/180
					     var radlon1 = Math.PI * long/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = long-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					
					distance = distanceCalculation(lat, long, lattitude, longttitude);
					
					if(Math.round(distance)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distance);

					}
					
					
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ temp[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ temp[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ temp[key].name
											+ '</h4><div class="venue-add">'
											+ temp[key].address.city
											+ '</div><div class="venue-description">'
											+ temp[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ temp[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				} else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ temp[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ temp[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ temp[key].name
											+ '</h4><div class="venue-add">'
											+ temp[key].address.city
											+ '</div><div class="venue-description">'
											+ temp[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ temp[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
			}
			temp = temp; // For the conformation
			getCordinate();
		}
		if (venues == true && exhibition == false && prefrenceType == 'ALL') {
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ responseForVenues.length + ' Venues</h2></div>');
			for ( var key in responseForVenues) {
				if (responseForVenues[key].free) {
					
					longex=responseForVenues[key].location.x;
					latex=responseForVenues[key].location.y;
					
					function distanceCalculationEx(latex, longex, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * latex/180
					     var radlon1 = Math.PI * longex/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = longex-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					distanceVe=distanceCalculationEx(latex, longex, lattitude, longttitude);
					
					if(Math.round(distanceVe)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distanceVe);

					}
					
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ responseForVenues[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ responseForVenues[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ responseForVenues[key].name
											+ '</h4><div class="venue-add">'
											+ responseForVenues[key].address.city
											+ '</div><div class="venue-description">'
											+ responseForVenues[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ responseForVenues[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				} else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ responseForVenues[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ responseForVenues[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ responseForVenues[key].name
											+ '</h4><div class="venue-add">'
											+ responseForVenues[key].address.city
											+ '</div><div class="venue-description">'
											+ responseForVenues[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ responseForVenues[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
			}
		}
		if (venues == false && exhibition == true && prefrenceType == 'ALL') {
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ responseOfExhibition.length
							+ ' Exhibitions</h2></div>');
			for ( var key in responseOfExhibition) {
				if (responseOfExhibition[key].free) {
					
					longex=responseOfExhibition[key].location.x;
					latex=responseOfExhibition[key].location.y;
					
					function distanceCalculationEx(latex, longex, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * latex/180
					     var radlon1 = Math.PI * longex/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = longex-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					distanceEx=distanceCalculationEx(latex, longex, lattitude, longttitude);
					
					if(Math.round(distanceEx)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distanceEx);

					}
					
					
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ responseOfExhibition[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ responseForVenues[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ responseOfExhibition[key].name
											+ '</h4><div class="venue-add">'
											+ responseOfExhibition[key].address.city
											+ '</div><div class="venue-description">'
											+ responseOfExhibition[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ responseOfExhibition[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				} else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ responseOfExhibition[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ responseOfExhibition[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ responseOfExhibition[key].name
											+ '</h4><div class="venue-add">'
											+ responseOfExhibition[key].address.city
											+ '</div><div class="venue-description">'
											+ responseOfExhibition[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ responseOfExhibition[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
			}
			if (responseOfExhibition = '') {
				temp = responseOfExhibition;
				getCordinate();
			}
		}
		if (venues == true && exhibition == true && prefrenceType != 'ALL') {
			temp = [];
			temp = mergedData;

			for (value in responseForVenues) {

				if ((responseForVenues[value].tags).indexOf(prefrenceType) > -1) {

					numberOfVenues.push(responseForVenues[value]);

				}
			}

			for (value in responseOfExhibition) {
				if ((responseOfExhibition[value].tags).indexOf(prefrenceType) > -1) {
					numberOfExhibition.push(responseOfExhibition[value]);
				}
			}
			if ($('#noResult').show()) {
				$('#noResult').hide();
			}
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ numberOfVenues.length + ' Venues / '
							+ numberOfExhibition.length
							+ ' Exhibitions</h2></div>');
			for ( var key in tempArr) {
				if (tempArr[key].free) {
					
					long=tempArr[key].location.x;
					lat=tempArr[key].location.y;
			
					function distanceCalculation(lat, long, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * lat/180
					     var radlon1 = Math.PI * long/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = long-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					
					distance = distanceCalculation(lat, long, lattitude, longttitude);
					
					if(Math.round(distance)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distance);

					}
					
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArr[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ tempArr[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArr[key].name
											+ '</h4><div class="venue-add">'
											+ tempArr[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArr[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArr[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				} else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArr[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ tempArr[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArr[key].name
											+ '</h4><div class="venue-add">'
											+ tempArr[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArr[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArr[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
			}
			if (tempArr != '') {
				temp = tempArr;
				getCordinate();
			} else {
				$("h2").remove();
				$("#totalNumberOfRecords").append($('#noResult').show());
			}
		}// if
		if (venues == true && exhibition == false && prefrenceType != 'ALL') {
			for (value in responseForVenues) {
				if ((responseForVenues[value].tags).indexOf(prefrenceType) > -1) {
					tempArr.push(responseForVenues[value]);
				}
			}
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ tempArr.length + ' Venues</h2></div>');
			for ( var key in tempArr) {
				if (tempArr[key].free) {
					
					long=tempArr[key].location.x;
					lat=tempArr[key].location.y;
			
					function distanceCalculation(lat, long, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * lat/180
					     var radlon1 = Math.PI * long/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = long-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					
					distance = distanceCalculation(lat, long, lattitude, longttitude);
					
					if(Math.round(distance)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distance);

					}
					
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArr[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ tempArr[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArr[key].name
											+ '</h4><div class="venue-add">'
											+ tempArr[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArr[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArr[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				} else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArr[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ tempArr[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArr[key].name
											+ '</h4><div class="venue-add">'
											+ tempArr[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArr[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArr[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
			}
			if (tempArr != '') {
				temp = tempArr;
				getCordinate();
			}
		}
		if (venues == false && exhibition == true && prefrenceType != 'ALL') {
			for (value in responseOfExhibition) {
				if ((responseOfExhibition[value].tags).indexOf(prefrenceType) > -1) {
					tempArr.push(responseOfExhibition[value]);
				}
			}
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ tempArr.length + ' Exhibitions</h2></div>');
			for ( var key in tempArr) {
				if (tempArr[key].free) {
					
					long=tempArr[key].location.x;
					lat=tempArr[key].location.y;
			
					function distanceCalculation(lat, long, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * lat/180
					     var radlon1 = Math.PI * long/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = long-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					
					distance = distanceCalculation(lat, long, lattitude, longttitude);
					
					if(Math.round(distance)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distance);

					}
					
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArr[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ tempArr[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArr[key].name
											+ '</h4><div class="venue-add">'
											+ tempArr[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArr[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArr[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				} else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArr[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ tempArr[key].displayImageUrl
											+ ' /></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArr[key].name
											+ '</h4><div class="venue-add">'
											+ tempArr[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArr[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArr[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
			}
			if (tempArr != '') {
				temp = tempArr;
				getCordinate();
			}
		}
	}
}

function showAllVenuesList() {

	if ($('.ven').css('display') == 'block') {
		$('.ven').css("display", "none");
	} else {
		$('.ven').css("display", "block");
	}
	$('.result-box').remove();
	$('.def').css("display", "none");
	$('.exi').css("display", "none");
	$("h2").remove();

	var preferences = document.getElementById('preferences').checked;
	var prefType = document.getElementById("prefType").innerHTML;
	var venuesType = document.getElementById("selValue").innerHTML;
	var venues = document.getElementById('c1').checked;
	var forTheKids = document.getElementById('c4').checked;
	var freeAdmission = document.getElementById('c3').checked;

	if (venues == true && venuesType == 'All' && preferences == false && forTheKids == false && freeAdmission ==false) {
	
		tempArray = [];

		tempArray = responseForVenues;
		
			
		if (tempArray.length != 0) {
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ tempArray.length + ' Venues</h2></div>');
			for ( var key in tempArray) {
				if (tempArray[key].free) {
					//nil
					long=tempArray[key].location.x;
					lat=tempArray[key].location.y;
			
					function distanceCalculation(lat, long, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * lat/180
					     var radlon1 = Math.PI * long/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = long-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					
					distance = distanceCalculation(lat, long, lattitude, longttitude);
			
					if(Math.round(distance)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distance);

					}
					if(distance<35)
						{
					//nil
					$("#searchResultVenue")
							.append(
									
									'<a target="_blank" href ='
											+ tempArray[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ tempArray[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArray[key].name
											+ '</h4><div class="venue-add">'
											+ tempArray[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArray[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
					 						+ tempArray[key].displaySchedules
											+ '</span></p></div></div></div></a>');
					} 
					
						
			
			else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArray[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ tempArray[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArray[key].name
											+ '</h4><div class="venue-add">'
											+ tempArray[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArray[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArray[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
						
			}
			
		} 
		}	
		//meenal1
			
		else {

			$('#venueD').css("display", "none");
		}
		
	} 
	//meenal
	else if (venues == true && forTheKids == true && freeAdmission == true) {
	      
			tempArray = [];

			tempArray = eventVen.concat(adVen);
			if (tempArray.length != 0) {
				$("#totalNumberOfRecords").empty();
				$("#totalNumberOfRecords").append(
						'<div class="search-title"><h2>' + locCity + ': '
								+ tempArray.length + ' Venues</h2></div>');
				for ( var key in tempArray) {
					if (tempArray[key].free) {
						
						long=tempArray[key].location.x;
						lat=tempArray[key].location.y;
				
						function distanceCalculation(lat, long, lattitude, longttitude)
						{
							
							 var radlat1 = Math.PI * lattitude/180
						     var radlat2 = Math.PI * lat/180
						     var radlon1 = Math.PI * long/180
						     var radlon2 = Math.PI * longttitude/180
						     var theta = long-longttitude
						     var radtheta = Math.PI * theta/180
						     var unit="K";
							 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
							 dist = Math.acos(dist)
							 dist = dist * 180/Math.PI
						     dist = dist * 60 * 1.1515
						     if (unit=="K") { dist = dist * 1.609344 }
						     if (unit=="N") { dist = dist * 0.8684 }
						 	return dist;
							
						}
						
						distance = distanceCalculation(lat, long, lattitude, longttitude);
						
						if(Math.round(distance)<1)
						{
						distanceMerShow ="<1";
					
						}
					else
						{
					distanceMerShow=Math.round(distance);

						}
						
						$("#searchResultVenue")
								.append(
										'<a target="_blank" href ='
												+ tempArray[key].website
												+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
												+ tempArray[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ tempArray[key].name
												+ '</h4><div class="venue-add">'
												+ tempArray[key].address.city
												+ '</div><div class="venue-description">'
												+ tempArray[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ tempArray[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					} else {
						$("#searchResult")
								.append(
										'<a target="_blank" href ='
												+ tempArray[key].website
												+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
												+ tempArray[key].displayImageUrl
												+ '></div><div class="col-md-7"><h4 class="venue-title">'
												+ tempArray[key].name
												+ '</h4><div class="venue-add">'
												+ tempArray[key].address.city
												+ '</div><div class="venue-description">'
												+ tempArray[key].description.fr
												+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
												+ tempArray[key].displaySchedules
												+ '</span></p></div></div></div></a>');
					}
				}
			} else {

				$('#venueD').css("display", "none");
			}
		}
	else if (venues == true && forTheKids == true) {
     
		tempArray = [];

		tempArray = eventVen;
		if (tempArray.length != 0) {
			$("#totalNumberOfRecords").empty();
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ tempArray.length + ' Venues</h2></div>');
			for ( var key in tempArray) {
				if (tempArray[key].free) {
					
					long=tempArray[key].location.x;
					lat=tempArray[key].location.y;
			
					function distanceCalculation(lat, long, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * lat/180
					     var radlon1 = Math.PI * long/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = long-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					
					distance = distanceCalculation(lat, long, lattitude, longttitude);
					
					if(Math.round(distance)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distance);

					}
					
					
					$("#searchResultVenue")
							.append(
									'<a target="_blank" href ='
											+ tempArray[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ tempArray[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArray[key].name
											+ '</h4><div class="venue-add">'
											+ tempArray[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArray[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArray[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				} else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArray[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ tempArray[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArray[key].name
											+ '</h4><div class="venue-add">'
											+ tempArray[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArray[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArray[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
			}
		} else {

			$('#venueD').css("display", "none");
		}
	}
	else if (venues == true && venuesType != 'All' && preferences == false) {
		
		tempArray = [];

		tempArray = venTemp;
		if (tempArray.length != 0) {
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ tempArray.length + ' Venues</h2></div>');
			for ( var key in tempArray) {
				if (tempArray[key].free) {
					
					long=tempArray[key].location.x;
					lat=tempArray[key].location.y;
			
					function distanceCalculation(lat, long, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * lat/180
					     var radlon1 = Math.PI * long/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = long-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					
					distance = distanceCalculation(lat, long, lattitude, longttitude);
					
					if(Math.round(distance)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distance);

					}
					
					$("#searchResultVenue")
							.append(
									'<a target="_blank" href ='
											+ tempArray[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ tempArray[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArray[key].name
											+ '</h4><div class="venue-add">'
											+ tempArray[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArray[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArray[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				} else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArray[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ tempArray[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArray[key].name
											+ '</h4><div class="venue-add">'
											+ tempArray[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArray[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArray[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
			}
		} else {

			$('#venueD').css("display", "none");
		}
	}

	else if (venues == true && venuesType == 'All' && preferences == true
			&& prefType == 'All') {
	
		$("#totalNumberOfRecords").append(
				'<div class="search-title"><h2>' + locCity + ': '
						+ responseForVenues.length + ' Venues</h2></div>');
		for ( var key in responseForVenues) {
			if (responseForVenues[key].free) {
				
				long=responseForVenues[key].location.x;
				lat=responseForVenues[key].location.y;
		
				function distanceCalculation(lat, long, lattitude, longttitude)
				{
					
					 var radlat1 = Math.PI * lattitude/180
				     var radlat2 = Math.PI * lat/180
				     var radlon1 = Math.PI * long/180
				     var radlon2 = Math.PI * longttitude/180
				     var theta = long-longttitude
				     var radtheta = Math.PI * theta/180
				     var unit="K";
					 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					 dist = Math.acos(dist)
					 dist = dist * 180/Math.PI
				     dist = dist * 60 * 1.1515
				     if (unit=="K") { dist = dist * 1.609344 }
				     if (unit=="N") { dist = dist * 0.8684 }
				 	return dist;
					
				}
				
				distance = distanceCalculation(lat, long, lattitude, longttitude);
				
				if(Math.round(distance)<1)
				{
				distanceMerShow ="<1";
			
				}
			else
				{
			distanceMerShow=Math.round(distance);

				}
				
				$("#searchResultVenue")
						.append(
								'<a target="_blank" href ='
										+ responseForVenues[key].website
										+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
										+ responseForVenues[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ responseForVenues[key].name
										+ '</h4><div class="venue-add">'
										+ responseForVenues[key].address.city
										+ '</div><div class="venue-description">'
										+ responseForVenues[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ responseForVenues[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			} else {
				$("#searchResult")
						.append(
								'<a target="_blank" href ='
										+ responseForVenues[key].website
										+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
										+ responseForVenues[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ responseForVenues[key].name
										+ '</h4><div class="venue-add">'
										+ responseForVenues[key].address.city
										+ '</div><div class="venue-description">'
										+ responseForVenues[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ responseForVenues[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			}
		}
		if (responseForVenues != '') {
			temp = responseForVenues;
			getCordinate();
		}
	}
	if ((venues == true && preferences == true && venuesType == 'All' && prefType != 'All')
			|| (venues == true && preferences == true && prefType != 'All')) {

		$("#totalNumberOfRecords").empty();
		tempArray = numberOfVenues;
		if (tempArray.length != 0) {
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ tempArray.length + ' Venues</h2></div>');
			for ( var key in tempArray) {
				if (tempArray[key].free) {
					
					long=tempArray[key].location.x;
					lat=tempArray[key].location.y;
			
					function distanceCalculation(lat, long, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * lat/180
					     var radlon1 = Math.PI * long/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = long-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					
					distance = distanceCalculation(lat, long, lattitude, longttitude);
					
					if(Math.round(distance)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distance);

					}
					
					$("#searchResultVenue")
							.append(
									'<a target="_blank" href ='
											+ tempArray[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ tempArray[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArray[key].name
											+ '</h4><div class="venue-add">'
											+ tempArray[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArray[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArray[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				} else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArray[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ tempArray[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArray[key].name
											+ '</h4><div class="venue-add">'
											+ tempArray[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArray[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp'+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArray[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
			}
		} else {
			$('#venueD').css("display", "none");
		}
	}

}


function showAllExhibitionList() {
	if ($('.exi').css('display') == 'block') {
		$('.exi').css("display", "none");

	} else {

		$('.exi').css("display", "block");
	}
	$('.result-box').remove();
	$('.def').css("display", "none");
	$('.ven').css("display", "none");
	$("h2").remove();
    
	var venueType = document.getElementById("selValue").innerHTML;
	var preferences = document.getElementById('preferences').checked;
	var prefType = document.getElementById("prefType").innerHTML;
	var exhibitions = document.getElementById('c2').checked;
	var freeAdmission = document.getElementById('c3').checked;
	var forTheKids = document.getElementById('c4').checked;
	var destination = document.getElementById('destination').checked;
	/*if (venues == true && venuesType == 'All' && preferences == false && forTheKids == false && freeAdmission ==false)*/
	if (exhibitions == true && destination == true && preferences == false && venueType == 'All' && forTheKids ==false && freeAdmission == false) {

		$("#totalNumberOfRecords").append(
				'<div class="search-title"><h2>' + locCity + ': '
						+ responseOfExhibition.length
						+ ' Exhibitions</h2></div>');
		for ( var key in responseOfExhibition) {
			
			if (responseOfExhibition[key].free) {
				longex=responseOfExhibition[key].location.x;
				latex=responseOfExhibition[key].location.y;
				
				function distanceCalculationEx(latex, longex, lattitude, longttitude)
				{
					
					 var radlat1 = Math.PI * lattitude/180
				     var radlat2 = Math.PI * latex/180
				     var radlon1 = Math.PI * longex/180
				     var radlon2 = Math.PI * longttitude/180
				     var theta = longex-longttitude
				     var radtheta = Math.PI * theta/180
				     var unit="K";
					 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					 dist = Math.acos(dist)
					 dist = dist * 180/Math.PI
				     dist = dist * 60 * 1.1515
				     if (unit=="K") { dist = dist * 1.609344 }
				     if (unit=="N") { dist = dist * 0.8684 }
				 	return dist;
					
				}
				distanceEx=distanceCalculationEx(latex, longex, lattitude, longttitude);
				
				if(Math.round(distanceEx)<1)
				{
				distanceMerShow ="<1";
			
				}
			else
				{
			distanceMerShow=Math.round(distanceEx);

				}
				
				$("#searchResultExhib")
						.append(
								'<a target="_blank" href ='
										+ responseOfExhibition[key].website
										+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
										+ responseOfExhibition[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ responseOfExhibition[key].name
										+ '</h4><div class="venue-add">'
										+ responseOfExhibition[key].address.city
										+ '</div><div class="venue-description">'
										+ responseOfExhibition[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' Km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ responseOfExhibition[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			} else {
				$("#searchResult")
						.append(
								'<a target="_blank" href ='
										+ responseOfExhibition[key].website
										+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
										+ responseOfExhibition[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ responseOfExhibition[key].name
										+ '</h4><div class="venue-add">'
										+ responseOfExhibition[key].address.city
										+ '</div><div class="venue-description">'
										+ responseOfExhibition[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ responseOfExhibition[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			}
		}
		
	}
	
	
	
	
	else if (exhibitions == true && forTheKids == true && freeAdmission == true && destination == true && venueType == 'All') {

		var tempArr = eventExh.concat(adExh);
		$("#totalNumberOfRecords").append(
				'<div class="search-title"><h2>' + locCity + ': '
						+ tempArr.length
						+ ' Exhibitions</h2></div>');
		for ( var key in tempArr) {
			if (tempArr[key].free) {
				
				long=tempArr[key].location.x;
				lat=tempArr[key].location.y;
		
				function distanceCalculation(lat, long, lattitude, longttitude)
				{
					
					 var radlat1 = Math.PI * lattitude/180
				     var radlat2 = Math.PI * lat/180
				     var radlon1 = Math.PI * long/180
				     var radlon2 = Math.PI * longttitude/180
				     var theta = long-longttitude
				     var radtheta = Math.PI * theta/180
				     var unit="K";
					 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					 dist = Math.acos(dist)
					 dist = dist * 180/Math.PI
				     dist = dist * 60 * 1.1515
				     if (unit=="K") { dist = dist * 1.609344 }
				     if (unit=="N") { dist = dist * 0.8684 }
				 	return dist;
					
				}
				
				distance = distanceCalculation(lat, long, lattitude, longttitude);
				
				if(Math.round(distance)<1)
				{
				distanceMerShow ="<1";
			
				}
			else
				{
			distanceMerShow=Math.round(distance);

				}
				
				$("#searchResultExhib")
						.append(
								'<a target="_blank" href ='
										+ tempArr[key].website
										+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
										+ tempArr[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ tempArr[key].name
										+ '</h4><div class="venue-add">'
										+ tempArr[key].address.city
										+ '</div><div class="venue-description">'
										+ tempArr[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ tempArr[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			} else {
				$("#searchResult")
						.append(
								'<a target="_blank" href ='
										+ tempArr[key].website
										+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
										+ tempArr[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ tempArr[key].name
										+ '</h4><div class="venue-add">'
										+ tempArr[key].address.city
										+ '</div><div class="venue-description">'
										+ tempArr[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ tempArr[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			}
		}
		if (tempArr != '') {
			temp = tempArr;
			getCordinate();
		}
	}
	
	else if (exhibitions == true && forTheKids == true && destination == true && venueType == 'All') {

		$("#totalNumberOfRecords").append(
				'<div class="search-title"><h2>' + locCity + ': '
						+ responseOfExhibition.length
						+ ' Exhibitions</h2></div>');
		for ( var key in responseOfExhibition) {
		
			if (responseOfExhibition[key].free) {
			
				long=responseOfExhibition[key].location.x;
				lat=responseOfExhibition[key].location.y;
		
				function distanceCalculation(lat, long, lattitude, longttitude)
				{
					
					 var radlat1 = Math.PI * lattitude/180
				     var radlat2 = Math.PI * lat/180
				     var radlon1 = Math.PI * long/180
				     var radlon2 = Math.PI * longttitude/180
				     var theta = long-longttitude
				     var radtheta = Math.PI * theta/180
				     var unit="K";
					 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					 dist = Math.acos(dist)
					 dist = dist * 180/Math.PI
				     dist = dist * 60 * 1.1515
				     if (unit=="K") { dist = dist * 1.609344 }
				     if (unit=="N") { dist = dist * 0.8684 }
				 	return dist;
					
				}
				
				distance = distanceCalculation(lat, long, lattitude, longttitude);
				
				if(Math.round(distance)<1)
				{
				distanceMerShow ="<1";
			
				}
			else
				{
			distanceMerShow=Math.round(distance);

				}
				
				$("#searchResultExhib")
						.append(
								'<a target="_blank" href ='
										+ responseOfExhibition[key].website
										+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
										+ responseOfExhibition[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ responseOfExhibition[key].name
										+ '</h4><div class="venue-add">'
										+ responseOfExhibition[key].address.city
										+ '</div><div class="venue-description">'
										+ responseOfExhibition[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ responseOfExhibition[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			} else {
				$("#searchResult")
						.append(
								'<a target="_blank" href ='
										+ responseOfExhibition[key].website
										+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
										+ responseOfExhibition[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ responseOfExhibition[key].name
										+ '</h4><div class="venue-add">'
										+ responseOfExhibition[key].address.city
										+ '</div><div class="venue-description">'
										+ responseOfExhibition[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ responseOfExhibition[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			}
		}
		if (responseOfExhibition != '') {
			temp = responseOfExhibition;
			getCordinate();
		}
	}
	else if (exhibitions == true && preferences == false && venueType != 'All') {
		
	
		$("#totalNumberOfRecords").append(
				'<div class="search-title"><h2>' + locCity + ': '
						+ exhibTemp.length
						+ ' Exhibitions</h2></div>');
		
		for ( var key in exhibTemp) {
			if (exhibTemp[key].free) {
				
				long=exhibTemp[key].location.x;
				lat=exhibTemp[key].location.y;
		
				function distanceCalculation(lat, long, lattitude, longttitude)
				{
					
					 var radlat1 = Math.PI * lattitude/180
				     var radlat2 = Math.PI * lat/180
				     var radlon1 = Math.PI * long/180
				     var radlon2 = Math.PI * longttitude/180
				     var theta = long-longttitude
				     var radtheta = Math.PI * theta/180
				     var unit="K";
					 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					 dist = Math.acos(dist)
					 dist = dist * 180/Math.PI
				     dist = dist * 60 * 1.1515
				     if (unit=="K") { dist = dist * 1.609344 }
				     if (unit=="N") { dist = dist * 0.8684 }
				 	return dist;
					
				}
				
				distance = distanceCalculation(lat, long, lattitude, longttitude);
				
				if(Math.round(distance)<1)
				{
				distanceMerShow ="<1";
			
				}
			else
				{
			distanceMerShow=Math.round(distance);

				}
				
				$("#searchResultExhib")
						.append(
								'<a target="_blank" href ='
										+ exhibTemp[key].website
										+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
										+ exhibTemp[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ exhibTemp[key].name
										+ '</h4><div class="venue-add">'
										+ exhibTemp[key].address.city
										+ '</div><div class="venue-description">'
										+ exhibTemp[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ exhibTemp[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			} else {
				$("#searchResult")
						.append(
								'<a target="_blank" href ='
										+ exhibTemp[key].website
										+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
										+ exhibTemp[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ exhibTemp[key].name
										+ '</h4><div class="venue-add">'
										+ exhibTemp[key].address.city
										+ '</div><div class="venue-description">'
										+ exhibTemp[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ exhibTemp[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			}
		}
		if (exhibTemp != '') {
			temp = exhibTemp;
			getCordinate();
		}
	}
	else if ((exhibitions == true && preferences == false)
			|| (exhibitions == true && preferences == true && prefType == 'All')) {

		$("#totalNumberOfRecords").append(
				'<div class="search-title"><h2>' + locCity + ': '
						+ responseOfExhibition.length
						+ ' Exhibitions</h2></div>');
		for ( var key in responseOfExhibition) {
			if (responseOfExhibition[key].free) {
				
				long=responseOfExhibition[key].location.x;
				lat=responseOfExhibition[key].location.y;
		
				function distanceCalculation(lat, long, lattitude, longttitude)
				{
					
					 var radlat1 = Math.PI * lattitude/180
				     var radlat2 = Math.PI * lat/180
				     var radlon1 = Math.PI * long/180
				     var radlon2 = Math.PI * longttitude/180
				     var theta = long-longttitude
				     var radtheta = Math.PI * theta/180
				     var unit="K";
					 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					 dist = Math.acos(dist)
					 dist = dist * 180/Math.PI
				     dist = dist * 60 * 1.1515
				     if (unit=="K") { dist = dist * 1.609344 }
				     if (unit=="N") { dist = dist * 0.8684 }
				 	return dist;
					
				}
				
				distance = distanceCalculation(lat, long, lattitude, longttitude);
				
				if(Math.round(distance)<1)
				{
				distanceMerShow ="<1";
			
				}
			else
				{
			distanceMerShow=Math.round(distance);

				}
				
				$("#searchResultExhib")
						.append(
								'<a target="_blank" href ='
										+ responseOfExhibition[key].website
										+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
										+ responseOfExhibition[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ responseOfExhibition[key].name
										+ '</h4><div class="venue-add">'
										+ responseOfExhibition[key].address.city
										+ '</div><div class="venue-description">'
										+ responseOfExhibition[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ responseOfExhibition[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			} else {
				$("#searchResult")
						.append(
								'<a target="_blank" href ='
										+ responseOfExhibition[key].website
										+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
										+ responseOfExhibition[key].displayImageUrl
										+ '></div><div class="col-md-7"><h4 class="venue-title">'
										+ responseOfExhibition[key].name
										+ '</h4><div class="venue-add">'
										+ responseOfExhibition[key].address.city
										+ '</div><div class="venue-description">'
										+ responseOfExhibition[key].description.fr
										+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important">&nbsp '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
										+ responseOfExhibition[key].displaySchedules
										+ '</span></p></div></div></div></a>');
			}
		}
		if (responseOfExhibition != '') {
			temp = responseOfExhibition;
			getCordinate();
		}
	} else if (exhibitions == true && preferences == true && prefType != 'All') {

		$("#totalNumberOfRecords").empty();
		tempArray = numberOfExhibition;
		if (tempArray.length != 0) {
			$("#totalNumberOfRecords").append(
					'<div class="search-title"><h2>' + locCity + ': '
							+ tempArray.length + ' Exhibitions</h2></div>');
			for ( var key in tempArray) {
				if (tempArray[key].free) {
					
					long=tempArray[key].location.x;
					lat=tempArray[key].location.y;
			
					function distanceCalculation(lat, long, lattitude, longttitude)
					{
						
						 var radlat1 = Math.PI * lattitude/180
					     var radlat2 = Math.PI * lat/180
					     var radlon1 = Math.PI * long/180
					     var radlon2 = Math.PI * longttitude/180
					     var theta = long-longttitude
					     var radtheta = Math.PI * theta/180
					     var unit="K";
						 dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						 dist = Math.acos(dist)
						 dist = dist * 180/Math.PI
					     dist = dist * 60 * 1.1515
					     if (unit=="K") { dist = dist * 1.609344 }
					     if (unit=="N") { dist = dist * 0.8684 }
					 	return dist;
						
					}
					
					distance = distanceCalculation(lat, long, lattitude, longttitude);
					
					if(Math.round(distance)<1)
					{
					distanceMerShow ="<1";
				
					}
				else
					{
				distanceMerShow=Math.round(distance);

					}
					
					$("#searchResultExhib")
							.append(
									'<a target="_blank" href ='
											+ tempArray[key].website
											+ '><div class="result-box"><div class="offer"></div><div class="col-md-4"><img class="image" src='
											+ tempArray[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArray[key].name
											+ '</h4><div class="venue-add">'
											+ tempArray[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArray[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important"> '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArray[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				} else {
					$("#searchResult")
							.append(
									'<a target="_blank" href ='
											+ tempArray[key].website
											+ '><div class="result-box"><div class="col-md-4"><img class="image" src='
											+ tempArray[key].displayImageUrl
											+ '></div><div class="col-md-7"><h4 class="venue-title">'
											+ tempArray[key].name
											+ '</h4><div class="venue-add">'
											+ tempArray[key].address.city
											+ '</div><div class="venue-description">'
											+ tempArray[key].description.fr
											+ '</div><div class="traveling-details"><p ><span><i class="man"></i><strong>Distance:<span class="disSpan" style="float:none !important"> '+distanceMerShow+' km</span></span><span class="distance_span"><i class="fa fa-clock-o"></i><strong>Time:</strong>'
											+ tempArray[key].displaySchedules
											+ '</span></p></div></div></div></a>');
				}
			}
		}
	}
}

function urlRead() {
	var url = [];
	var city = [];
	url = window.location.href.toString().split(",");
	city = url[0].toString().split("=");
	if (url[1] != undefined && url[2] != undefined && city[1] != undefined) {
		var from = "From";
		var to = "To";
		document.getElementById("startDate").value = ' ' + url[1];
		document.getElementById("endDate").value = ' ' + url[2];
		document.getElementById("searchCity").value = city[1];
		cityNameTemp = city[1];
		locCity = city[1];
		search();
	}
}

