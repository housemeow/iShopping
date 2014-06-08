app.controller('EventListController', function($scope, ChatManager, EventManager, $stateParams, FriendManager, SettingManager, iLabMessage, $window, Geolocation, $state){
	$scope.eventList = null;
	
	$scope.newEventButton = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus'></i>",
		tap: function() 
		{
			console.log("流程 - eventListController go to eventController create state");
			$state.go('event', {state: 'CREATE'});
		}
	}];
	
	$scope.init = function() {
		console.log("流程 - eventListController init");
		$scope.eventList = EventManager.list();
		console.log("流程 - eventListController eventList after get events: " + JSON.stringify($scope.eventList));
	};
	
	$scope.getEventListCount = function()
	{
		console.log("流程 - eventListController getEventListCount");
		return EventManager.count();
	};
});