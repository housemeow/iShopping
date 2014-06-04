app.controller('GatheringPointMapController', function($scope, $stateParams,
		$state, Geolocation, $window) {
	$scope.refreshState = function(state) {
		var buttonCSS = {
			type : 'button-positive',
			content : "<i class='icon ion-checkmark'></i>"
		};
		if ($scope.state == "VIEW") {
			$scope.title = "檢視集合點";
			buttonCSS.tap = function() {
			};
		} else if ($scope.state == "CREATE") {
			$scope.title = "設定集合點";
			buttonCSS.tap = function() {
				$state.go('event', {
					state : 'CREATE'
				});
			};
		} else if ($scope.state == "EDIT") {
			$scope.title = "設定集合點";
			buttonCSS.tap = function() {
				$state.go('event', {
					state : 'EDIT'
				});
			};
		}
		if ($scope.state == "VIEW") {
			$scope.setGatheringPointButton = {};
		} else {
			$scope.setGatheringPointButton = [ buttonCSS ];
		}
		$scope.apply();
	};

	var origin = null;

	var initMap = function(geoposition) {
		console.log(geoposition);
		var origin = new google.maps.LatLng(geoposition.coords.latitude,
				geoposition.coords.longitude);
		var mapOptions = {
			zoom : 13,
			center : origin,
			disableDefaultUI : true
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);

		var anchor = new google.maps.Point(30, 65);
		var marker = new MarkerWithLabel({
			position : origin,
			labelContent : "集合點",
			labelAnchor : anchor,
			labelClass : "labels",
			labelStyle : {
				opacity : 0.75
			}
		});
		marker.setMap(map);
		google.maps.event.addListener(map, 'click', function(event) {
			placeMarker(event.latLng);
		});

		function placeMarker(location) {
			origin = location;
			marker.setPosition(location);
		}
	};

	$scope.init = function() {
		// Geolocation.getCurrentPosition(initMap);
		// $scope.state = $stateParams.state;
		// $scope.eid = $stateParams.eid;
		// $scope.refreshState($scope.state);

		var markers = [];
		var map = new google.maps.Map(document.getElementById('map-canvas'), {
			mapTypeId : google.maps.MapTypeId.ROADMAP,
			disableDefaultUI : true
		});

		var defaultBounds = new google.maps.LatLngBounds(
				new google.maps.LatLng(-33.8902, 151.1759),
				new google.maps.LatLng(-33.8474, 151.2631));
		map.fitBounds(defaultBounds);

		// Create the search box and link it to the UI element.
		var input = (document.getElementById('pac-input'));
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		var searchBox = new google.maps.places.SearchBox((input));

		// Listen for the event fired when the user selects an item from the
		// pick list. Retrieve the matching places for that item.
		google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces();

			// For each place, get the icon, place name, and location.
			var anchor = new google.maps.Point(30, 65);
			var place = places[0];
			var origin = place.geometry.location;
			var marker = new MarkerWithLabel({
				position : origin,
				labelContent : "集合點",
				labelAnchor : anchor,
				labelClass : "labels",
				labelStyle : {
					opacity : 0.75
				}
			});
			marker.setMap(map);
			var bounds = new google.maps.LatLngBounds(place.geometry.location);
			map.fitBounds(bounds);
		});

		// Bias the SearchBox results towards places that are within the bounds
		// of the
		// current map's viewport.
		google.maps.event.addListener(map, 'bounds_changed', function() {
			var bounds = map.getBounds();
			searchBox.setBounds(bounds);
		});
	};
});