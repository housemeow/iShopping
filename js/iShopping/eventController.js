app.controller('EventController', function($scope, ChatManager, $stateParams, FriendManager, SettingManager, iLabMessage, $window, Geolocation, $state){
	$scope.newFriendsButton = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus'></i>",
		tap: function() {
				$scope.onFriendClick($scope.ADDFRIEND);
			}
	}];	
	$scope.event = {};
	$scope.init = function() {
		for(var index in $scope.messages) {
			var message = $scope.messages[index];
			$scope.readMessage(message);
		}
	};
	/*
	$scope.eventList =[
	                   {
	                	   name : "爽歪歪",
	                	   eid: 1,
	                	   date: new Date("2014-06-05")
	                   },
	                   {
	                	   name : "歪歪",
	                	   eid: 2,
	                	   date: new Date("2014-06-18")
	                   },
	                   {
	                	   name : "Qoo",
	                	   eid: 3,
	                	   date: new Date("2014-06-20")
	                   },
	                   {
	                	   name : "拉布拉多",
	                	   eid: 4,
	                	   date: new Date("2014-06-01")
	                   },];*/
});