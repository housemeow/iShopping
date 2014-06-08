app.controller('GatheringPointMapController', function($scope, $stateParams,
		$state, Geolocation, $window) {


	var origin = null;
	
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
					state : 'CREATE',
					eid : $stateParams.eid,
					name : $stateParams.name,
					detail : $stateParams.detail,
					destination : $stateParams.destination,
					date : $stateParams.date,
					time : $stateParams.time,
					latitude : origin.k,
					longtitude : origin.A
				});
			};
		} else if ($scope.state == "EDIT") {
			$scope.title = "設定集合點";
			buttonCSS.tap = function() {
				$state.go('event', {
					state : 'EDIT',
					eid : $stateParams.eid,
					latitude : origin.k,
					longtitude : origin.A
				});
			};
		}
		if ($scope.state == "VIEW") {
			$scope.setGatheringPointButton = {};
		} else {
			$scope.setGatheringPointButton = [ buttonCSS ];
		}
	};

	var initMap = function(geoposition) {
		console.log(geoposition);


        var mapCenter= new google.maps.LatLng(geoposition.coords.latitude,
                           geoposition.coords.longitude);

		var mapOptions = {
			zoom : 13,
			center : mapCenter,
			disableDefaultUI : true
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);

		var anchor = new google.maps.Point(30, 65);
		var marker = new MarkerWithLabel({
			labelContent : "集合點",
			labelAnchor : anchor,
			labelClass : "labels",
			labelStyle : {
				opacity : 0.75
			}
		});
		console.log(origin);
		if($stateParams.latitude){
			origin = new google.maps.LatLng($stateParams.latitude,
				$stateParams.longitude);
			marker.setPosition(origin);
		}
		marker.setMap(map);

		// 建立搜尋列的UI
		var input = (document.getElementById('pac-input'));
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
		var searchBox = new google.maps.places.SearchBox((input));
		// 監聽搜尋列搜尋出來的清單，點選項目之後可以在searchBox.getPlaces()取得符合的項目
		google.maps.event.addListener(searchBox, 'places_changed', function() {
			var places = searchBox.getPlaces();
			// 取得第一個地標
			var place = places[0];
			origin = place.geometry.location;
			marker.setPosition(origin);
			// 設定畫面的解析度
			var bounds = new google.maps.LatLngBounds(place.geometry.location);
			map.fitBounds(bounds);
		});

		// Bias the SearchBox results towards places that are within the bounds
		// of the
		// current map's viewport.
		// 
		google.maps.event.addListener(map, 'bounds_changed', function() {
			var bounds = map.getBounds();
			searchBox.setBounds(bounds);
		});

		if ($scope.state != "VIEW")
		{
			google.maps.event.addListener(map, 'click', function(event) {
				placeMarker(event.latLng);
			});
		}
		
		function placeMarker(location) {
			origin = location;
			marker.setPosition(location);
		}
	};

	$scope.init = function() {
		Geolocation.getCurrentPosition(initMap);
		$scope.state = $stateParams.state;
		$scope.eid = $stateParams.eid;
		$scope.refreshState($scope.state);
	};
});