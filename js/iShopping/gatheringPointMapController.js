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
			// if (marker == null) {
			// marker = new MarkerWithLabel({
			// position : origin,
			// labelContent : "集合點",
			// labelAnchor : anchor,
			// labelClass : "labels",
			// labelStyle : {
			// opacity : 0.75
			// }
			// });
			// marker.setMap(map);
			// } else {
			marker.setPosition(location);
			// }
		}
	};

	$scope.init = function() {
		Geolocation.getCurrentPosition(initMap);
		$scope.state = $stateParams.state;
		$scope.eid = $stateParams.eid;
		$scope.refreshState($scope.state);
	};
});