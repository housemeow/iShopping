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
	
	
	$scope.init = function() {
		var host = SettingManager.getHost();
		console.log(JSON.stringify(host));
		EventManager.list(function(list){
			
			$scope.eventList = list;
		});
		console.log("event list ctrl's list" + JSON.stringify($scope.eventList));
		console.log("event list count" + $scope.eventList.length);
	};
});