app.controller('EventMapController', function(iLabMessage, SettingManager, EventContainMemberManager, EventManager, $scope, $stateParams, $state,
		Geolocation, $window) {
	$scope.eventName = $stateParams.name;
	$scope.eid = $stateParams.eid;
	
	console.log("eventContainMembers:" + JSON.stringify(EventContainMemberManager.getMembersByEid($scope.eid)));
	
	$scope.hostPhone = SettingManager.getHost().phone;
	$scope.autoUpdate = {text: "自動", checked: SettingManager.getHost().isAutoSendPosition};
	
	$scope.toggleClick = function()
	{
		console.log("$scope.autoUpdate = " + JSON.stringify($scope.autoUpdate));

		var host = SettingManager.getHost();
		host.isAutoSendPosition = $scope.autoUpdate.checked;
		SettingManager.setHost(host);
		
	};
	
	console.log("eventMap eid=" + $scope.eid);

	$scope.viewEventButton = [ {
		type : 'button-energized',
		content : "<i class='icon ion-document-text'></i>",
		tap : function() {
			$state.go("event", {
				state : "VIEW",
				eid : $scope.eid
			});
		}
	} ];

	$scope.eventChatRoomButton = [ {
		type : 'button-energized',
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

		// 建立搜尋列的UI
		var toggle = (document.getElementById('toggle'));
		toggle.style.padding = '5px';
		map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(toggle);
		
		var markerMe = new MarkerWithLabel({
			position : origin,
			labelContent : "我",
			labelAnchor : anchor,
			labelClass : "labels",
			labelStyle : {
				opacity : 0.75
			}
		});
		

		$scope.$on('myPositionChanged', function(event, position) {
			markerMe.setPosition(position);
		});
		
		
		var members = EventContainMemberManager.getMembersByEid($scope.eid);
		

		google.maps.event.addListener(map, 'click', function(event) {
			if($scope.autoUpdate.checked == false){
				var host = SettingManager.getHost();
				markerMe.setPosition(event.latLng);
				var i;
				for(i=0;i<members.length;i++){
					console.log("手動坐標模式");
					if(members[i].phone != host.phone)
					{
						console.log("手動傳座標模式 member not self block!!!");
						var textJSON = JSON.stringify({
							type: "positionChanged",
							eid : $scope.eid,
							latitude : event.latLng.lat(),//geoposition.coords.latitude,
							longitude : event.latLng.lng()//geoposition.coords.longitude
						});
						var message = {
				        	senderPhone: host.phone,
				            receiverPhone: members[i].phone,
				            message: textJSON
				        };
						console.log("手動傳座標模式 send meaage = " + JSON.stringify(message));
						iLabMessage.sendMessage(message);
					}	
				}
			}
		});
		
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