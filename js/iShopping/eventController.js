app.controller('EventController', function($scope, EventContainMemberManager,
		EventManager, ChatManager, $stateParams, FriendManager, SettingManager,
		iLabMessage, $window, Geolocation, $state) {
	$scope.hostPhone = SettingManager.getHost().phone;
	$scope.hostName = SettingManager.getHost().name;
	$scope.refreshState = function(state) {
		var buttonCSS = {
			type : 'button-energized'
		};
		if ($scope.state == "VIEW") {
			$scope.title = "活動詳細資料";
			$scope.gatheringPointButonText = "檢視集合點";
			var event = EventManager.getById($scope.event.eid);
			// $scope.event = EventManager.getById($scope.event.eid);
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

			buttonCSS.tap = function() {
				$state.go('event', {
					state : 'EDIT',
					eid : $scope.event.eid
				});
			};
			buttonCSS.content = "<i class='icon ion-edit'></i>";
		} else if ($scope.state == "CREATE") {
			$scope.title = "建立活動";
			$scope.gatheringPointButonText = "設定集合點";
			buttonCSS.tap = function() {
				$scope.event.members = JSON.parse($scope.event.members);
				var members = [];
				for ( var key in $scope.event.members) {
					if ($scope.event.members.hasOwnProperty(key)) {
						var member = $scope.event.members[key];
						if (member.enabled) {
							members.push({
								phone : member.phone,
								name : member.name
							});
						}
					}
				}
				members.push({
					phone : $scope.hostPhone,
					name : $scope.hostName
				});

				$scope.event.members = members;

				EventManager.add($scope.event, function(eid) {
					var i;
					for (i = 0; i < members.length; i++) {
						var member = members[i];
						member.eid = eid;
						console.log("member = " + JSON.stringify(member));
						EventContainMemberManager.add(member);

						if(member.phone!=$scope.hostPhone){
							var j;
							for(j=0;j<members.length;j++){
								var createMember = members[j];
								createMember.eid = eid;
								
								var textJSON = JSON.stringify({
									type : "eventCreateMember",
									member : createMember
								});
								var message = {
									senderPhone : $scope.hostPhone,
									receiverPhone : member.phone,
									message : textJSON
								};
								console.log("eventCreateMember send meaage = "
										+ JSON.stringify(message));
								iLabMessage.sendMessage(message);	
							}
						}
					}
					console.log("members = " + JSON.stringify(members));
					for (i = 0; i < members.length; i++) {
						var member = members[i];
						if (member.phone != $scope.hostPhone) {
							var textJSON = JSON.stringify({
								type : "eventCreate",
								text : "event create!",
								event : {
									"eid" : eid,
									"name" : $scope.event.name,
									"detail" : $scope.event.detail,
									"destination" : $scope.event.destination,
									"latitude" : $scope.event.latitude,
									"longitude" : $scope.event.longitude
								}
							// ,"members": members}
							});
							var message = {
								senderPhone : $scope.hostPhone,
								receiverPhone : member.phone,
								message : textJSON
							};
							console.log("event create send meaage = "
									+ JSON.stringify(message));
							iLabMessage.sendMessage(message);
						}
					}
				});
				$state.go('tab.eventList');
			};
			buttonCSS.content = "<i class='icon ion-checkmark'></i>";
		} else if ($scope.state == "EDIT") {
			$scope.title = "編輯活動";
			$scope.gatheringPointButonText = "設定集合點";
			var event = EventManager.getById($scope.event.eid);
			$scope.event = {};
			$scope.event.eid = event.eid;
			$scope.event.name = event.name;
			$scope.event.detail = event.detail;
			$scope.event.date = event.date;
			$scope.event.time = event.time;
			$scope.event.destination = event.destination;

			if ($stateParams.latitude != null) {
				$scope.event.latitude = $stateParams.latitude;
				$scope.event.longitude = $stateParams.longitude;
			} else {
				$scope.event.latitude = event.latitude;
				$scope.event.longitude = event.longitude;
			}

			buttonCSS.tap = function() {
				console.log("when EDIT state click OK event is: "
						+ JSON.stringify($scope.event));
				EventManager.update($scope.event);
				$state.go('event', {
					state : 'VIEW',
					eid : $scope.event.eid
				});
				console.log("when EDIT state after click OK event is: "
						+ JSON
								.stringify(EventManager
										.getById($scope.event.eid)));
			};
			buttonCSS.content = "<i class='icon ion-checkmark'></i>";
		}
		$scope.eventButton = [ buttonCSS ];
	};

	$scope.event = {};

	$scope.getSelectedFriendsCount = function() {
		var count = 0;
		if ($scope.event.members != null) {
			var members = JSON.parse($scope.event.members);
			console.log("get selectedFriendCount, members = "
					+ JSON.stringify(members));
			var i;
			for (i = 0; i < members.length; i++) {
				if (members[i].enabled) {
					count++;
				}
			}
		}
		return count;
	};

	$scope.clickAddFriendButton = function() {
		$state.go('selectFriends', {
			eid : $scope.event.eid,
			name : $scope.event.name,
			detail : $scope.event.detail,
			date : $scope.event.date,
			destination : $scope.event.destination,
			time : $scope.event.time,
			latitude : $scope.event.latitude,
			longitude : $scope.event.longitude,
			state : $scope.state,
			members : $scope.event.members
		});
	};

	$scope.clickGatheringPointButton = function() {
		// go to map page and pass state
		$state.go('gatheringPointMap', {
			eid : $scope.event.eid,
			name : $scope.event.name,
			detail : $scope.event.detail,
			date : $scope.event.date,
			destination : $scope.event.destination,
			time : $scope.event.time,
			latitude : $scope.event.latitude,
			longitude : $scope.event.longitude,
			state : $scope.state,
			members : $scope.event.members
		});
	};

	$scope.clickCancelButton = function() {
		$state.go('event', {
			state : 'VIEW'
		});
	};

	$scope.init = function() {
		$scope.event.eid = $stateParams.eid;
		$scope.event.name = $stateParams.name;// "逛夜市";
		$scope.event.detail = $stateParams.detail;// "帶兩百塊";
		$scope.event.destination = $stateParams.destination;// "士林夜市";
		$scope.event.date = $stateParams.date;// new Date('2014-12-18'); //
												// 尚未成功
		$scope.event.time = $stateParams.time;// '14:00';
		// $scope.event.latitude = 75; // 南北緯度 0-90
		// $scope.event.longitude = 123; // 東西經度 0-180
		$scope.event.latitude = $stateParams.latitude;
		$scope.event.longitude = $stateParams.longitude;
		// $scope.gatheringPointString = "(" + $scope.event.latitude + ", "
		// + $scope.event.longitude + ")";
		$scope.state = $stateParams.state;
		$scope.event.members = $stateParams.members;
		$scope.event.selectedMemberCount = $scope.getSelectedFriendsCount();
		console.log("$scope.event = " + JSON.stringify($scope.event));
		$scope.refreshState($scope.state);
	};
});