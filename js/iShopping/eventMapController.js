app.controller('EventMapController', function(EventManager, $scope, $stateParams, $state,
		Geolocation, $window) {
	$scope.eventName = $stateParams.name;
	$scope.eid = $stateParams.eid;
	var event = EventManager.getById($scope.eid);
	console.log("eventMap event=" + JSON.stringify(event));
	
	console.log("eventMap eid=" + $scope.eid);

	$scope.viewEventButton = [ {
		type : 'button-positive',
		content : "<i class='icon ion-document-text'></i>",
		tap : function() {
			$state.go("event", {
				state : "VIEW",
				eid : $scope.eid
			});
		}
	} ];

	$scope.eventChatRoomButton = [ {
		type : 'button-positive',
		content : "<i class='icon ion-chatbubbles'></i>",
		tap : function() {
			$state.go("eventChatRoom", {
				name : $scope.eventName
			});
		}
	} ];

	var initMap = function(geoposition) {
		console.log(geoposition);
		var anchor = new google.maps.Point(30, 65);
		var origin = new google.maps.LatLng(geoposition.coords.latitude,
				geoposition.coords.longitude);
		
		var mapOptions = {
			zoom : 13,
			center : origin,
			disableDefaultUI : true
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);
		var markerMe = new MarkerWithLabel({
			position : origin,
			labelContent : "我",
			labelAnchor : anchor,
			labelClass : "labels",
			labelStyle : {
				opacity : 0.75
			}
		});
		var gatheringPoint = new google.maps.LatLng(geoposition.coords.latitude,
				geoposition.coords.longitude);
		gatheringPoint.k = 25.042482; // 忠孝新生捷運站緯度
		gatheringPoint.A = 121.532894; // 忠孝新生捷運站經度
		var markerGatheringPoint = new MarkerWithLabel({
			position : gatheringPoint,
			labelContent : "集合點(假)",
			labelAnchor : anchor,
			labelClass : "labels",
			labelStyle : {
				opacity : 0.75
			}
		});
		markerGatheringPoint.setMap(map);
		markerMe.setMap(map);
	};

	$scope.init = function() {
		Geolocation.getCurrentPosition(initMap);
	};
});