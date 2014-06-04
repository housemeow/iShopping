app.controller('EventController', function($scope, ChatManager, $stateParams, FriendManager, SettingManager, iLabMessage, $window, Geolocation, $state){
	$scope.createEventButton = [{
		type: 'button-positive',
		content: "<i class='icon ion-checkmark'></i>",
		tap: function() 
		{
			$state.go('tab.eventList');
		}
	}];	
	
	$scope.event = {};
	$scope.init = function() {
	};
});