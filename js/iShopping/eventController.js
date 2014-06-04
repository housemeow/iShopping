app.controller('EventController', function($scope, ChatManager, $stateParams, FriendManager, SettingManager, iLabMessage, $window, Geolocation, $state){
	$scope.refreshState = function (state){
		var buttonCSS = {
				type: 'button-positive'
		};
		if($scope.state=="VIEW"){
			buttonCSS.tap = function(){
				// prepare to edit state
			};
			buttonCSS.content = "<i class='icon ion-edit'></i>";
		}else if($scope.state=="CREATE"){
			buttonCSS.tap = function(){
				// go to event list
				$state.go('tab.eventList');
			};
			buttonCSS.content = "<i class='icon ion-checkmark'></i>";
			
		}else if($scope.state=="EDIT"){
			buttonCSS.tap = function(){
				// back to view state
			};
			buttonCSS.content = "<i class='icon ion-checkmark'></i>";
		}
		console.log($scope.state);
		$scope.eventButton = [buttonCSS];	
	}
	
	$scope.event = {};
	$scope.init = function() {
		$scope.state = $stateParams.state;
		$scope.refreshState($scope.state);
		
	};
});