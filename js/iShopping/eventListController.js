app.controller('EventListController', function($scope, ChatManager, EventManager, $stateParams, FriendManager, SettingManager, iLabMessage, $window, Geolocation, $state){
	$scope.newEventButton = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus'></i>",
		tap: function() 
		{
			$state.go('event', {state: 'CREATE'});
		}
	}];	
	
	$scope.eventList = {};
	EventManager.list(function(list){
		console.log(JSON.stringify(list));
		$scope.eventList = list;
	});
	
	$scope.init = function() {
		var host = SettingManager.getHost();
		console.log(JSON.stringify(host));
	};
});