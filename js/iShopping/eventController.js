app.controller('EventController', function($scope, ChatManager, $stateParams, FriendManager, SettingManager, iLabMessage, $window, Geolocation, $state){
	$scope.refreshState = function (state){
		var buttonCSS = {
				type: 'button-positive'
		};
		if($scope.state=="VIEW"){
			$scope.title = "活動詳細資料";
			buttonCSS.tap = function(){
				console.log("now is view");
				$state.go('event', {state:'EDIT'});
			};
			buttonCSS.content = "<i class='icon ion-edit'></i>";
		}else if($scope.state=="CREATE"){
			$scope.title = "建立活動";
			buttonCSS.tap = function(){
				// go to event list
				$state.go('tab.eventList');
			};
			buttonCSS.content = "<i class='icon ion-checkmark'></i>";
			
		}else if($scope.state=="EDIT"){
			$scope.title = "編輯活動";
			buttonCSS.tap = function(){
				console.log("now is edit");
				$state.go('event', {state:'VIEW'});
			};
			buttonCSS.content = "<i class='icon ion-checkmark'></i>";
		}
		console.log($scope.state);
		$scope.eventButton = [buttonCSS];
		$scope.apply();
	}
	
	$scope.event = {};
	$scope.init = function() {
		$scope.event.name = "逛夜市";
		$scope.event.detail = "帶兩百塊";
		$scope.event.destination = "士林夜市"
		$scope.event.date = new Date('2014-12-18'); // 尚未成功
		$scope.event.time = '14:00';
		$scope.event.gatheringPoint = "(123, 312)";
		$scope.state = $stateParams.state;
		$scope.refreshState($scope.state);
		
	};
});