app.controller('EventController', function($scope, EventManager, ChatManager, $stateParams,
		FriendManager, SettingManager, iLabMessage, $window, Geolocation,
		$state) {
	$scope.refreshState = function(state) {
		var buttonCSS = {
			type : 'button-positive'
		};
		if ($scope.state == "VIEW") {
			$scope.title = "活動詳細資料";
			$scope.gatheringPointButonText = "檢視集合點";
			var event = EventManager.getById($scope.event.eid);
			$scope.event = event;
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
				/*
				var event = {
					name : $scope.event.name,
					detail : $scope.event.detail,
					destination : $scope.event.destination,
					date : $scope.event.date,
					time : $scope.event.time,
					latitude : $scope.event.latitude,
					longtitude : $scope.event.longtitude
				};*/
				EventManager.add(event);
				$state.go('tab.eventList');
			};
			buttonCSS.content = "<i class='icon ion-checkmark'></i>";
		} else if ($scope.state == "EDIT") {
			$scope.title = "編輯活動";
			$scope.gatheringPointButonText = "設定集合點";
			var event = EventManager.getById($scope.event.eid);
			$scope.event = event;
			buttonCSS.tap = function() {
				/*
				var event = {
						eid : $scope.event.eid,
						name : $scope.event.name,
						detail : $scope.event.detail,
						destination : $scope.event.destination,
						date : $scope.event.date,
						time : $scope.event.time,
						latitude : $scope.event.latitude,
						longtitude : $scope.event.longtitude
					};
					*/
				EventManager.update($scope.event);
				$state.go('event', {
					state : 'VIEW',
					eid : $scope.event.eid
				});
			};
			buttonCSS.content = "<i class='icon ion-checkmark'></i>";
		}
		$scope.eventButton = [ buttonCSS ];
	};

	$scope.event = {};
	$scope.init = function() {
		$scope.event.eid = $stateParams.eid;
		$scope.event.name = $stateParams.name;//"逛夜市";
		$scope.event.detail = $stateParams.detail;//"帶兩百塊";
		$scope.event.destination = $stateParams.destination;//"士林夜市";
		$scope.event.date = $stateParams.date;//new Date('2014-12-18'); // 尚未成功
		$scope.event.time = $stateParams.time;//'14:00';
		// $scope.event.latitude = 75; // 南北緯度 0-90
		// $scope.event.longtitude = 123; // 東西經度 0-180
		$scope.event.latitude = $stateParams.latitude;
		$scope.event.longtitude = $stateParams.longtitude;
		//$scope.gatheringPointString = "(" + $scope.event.latitude + ", "
		//		+ $scope.event.longtitude + ")";
		$scope.state = $stateParams.state;
		$scope.refreshState($scope.state);

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
			longtitude : $scope.event.longtitude,
			state : $scope.state
		});
	};

	$scope.clickCancelButton = function() {
		$state.go('event', {
			state : 'VIEW'
		});
	};
});