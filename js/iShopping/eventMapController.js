app.controller('EventMapController', function(iLabMessage, SettingManager, EventContainMemberManager, EventManager, $scope, $stateParams, $state,
		Geolocation, $window) {
	$scope.eventName = $stateParams.name;
	$scope.eid = $stateParams.eid;
	$scope.hostPhone = SettingManager.getHost().phone;;

	
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
		
		var members = EventContainMemberManager.getMembersByEid($scope.eid);
		console.log("eventMapController members = " + JSON.stringify(members));
		var memberMarkers = [];
		var i;
		for(i=0;i<members.length;i++){
			var member = members[i];
			if(member.phone != $scope.hostPhone){
				var marker = new MarkerWithLabel({
					position : origin,
					labelContent : member.name,
					labelAnchor : anchor,
					labelClass : "labels",
					labelStyle : {
						opacity : 0.75
					}
				});
				//console.log("marker = " + JSON.stringify(marker));
				marker.phone = member.phone;
				memberMarkers.push(marker);
				marker.setMap(map);
			}
		}
		
		
		$scope.$on('positionChanged', function(event, message) {
			console.log("positionChanged: received meaage = " + JSON.stringify(message));
			var i;
			for(i=0;i<memberMarkers.length;i++){
				var marker = memberMarkers[i];
				if(marker.phone==message.senderPhone){

					var position = new google.maps.LatLng(message.message.latitude,
							message.message.longitude);
					marker.setPosition(position);
				}
			}
		});
		
		setInterval(function(){
			Geolocation.getCurrentPosition(function(geoposition){
				var mePosition = new google.maps.LatLng(geoposition.coords.latitude,
						geoposition.coords.longitude);
				markerMe.setPosition(mePosition);
				//console.log("position changed:" + mePosition);
				var i;
				for(i=0;i<members.length;i++){
					if(members[i].phone != $scope.hostPhone)
					{
						var textJSON = JSON.stringify({
						type: "positionChanged",
						eid : $scope.eid,
						latitude : geoposition.coords.latitude,
						longitude : geoposition.coords.longitude
						});
						var message = {
				        	senderPhone: $scope.hostPhone,
				            receiverPhone: members[i].phone,
				            message: textJSON
				        };
						console.log("send meaage = " + JSON.stringify(message));
						iLabMessage.sendMessage(message);
					}	
				}
			});
		},3000);

		
		console.log("event in eventMap is: " + JSON.stringify($scope.event));
		if($scope.event.latitude!=null){
			console.log("this is : $scope.event.latitude!=null block");
			var gatheringPoint = new google.maps.LatLng($scope.event.latitude,
				$scope.event.longitude);

			var markerGatheringPoint = new MarkerWithLabel({
				position : gatheringPoint,
				labelContent : "集合點",
				labelAnchor : anchor,
				labelClass : "labels",
				labelStyle : {
					opacity : 0.75
				}
			});


			markerGatheringPoint.setMap(map);
		}
		markerMe.setMap(map);
	};

	$scope.init = function() {
		var event = EventManager.getById($stateParams.eid);
		$scope.event = {};
		$scope.event.eid = event.eid;
		$scope.event.name = event.name;
		$scope.event.detail = event.detail;
		$scope.event.date = event.date;
		$scope.event.time = event.time;
		$scope.event.destination = event.destination;
		$scope.event.latitude = event.latitude;
		$scope.event.longitude = event.longitude;
		$scope.event.mmid = event.mmid;

		Geolocation.getCurrentPosition(initMap);
	};
});