app.controller('SelectFriendsController', function($scope, $state, FriendManager, $stateParams) {
	

	$scope.init = function() {
		
		var friends = FriendManager.list();
		$scope.friends = [];//FriendManager.list();
		console.log("friends = " + JSON.stringify(friends));
		for (var key in friends) {
			if (friends.hasOwnProperty(key)){
				var friend = friends[key];
				console.log("friend = " + JSON.stringify(friend));
				if(friend.isMember){
					$scope.friends.push(friend);
				}
			}
		}

		
		
    };
    
	$scope.addFriendsButton = [ {
		type : 'button-positive',
		content : "<i class='icon ion-checkmark'></i>",
		tap : function() {$state.go('event', {
			state : 'CREATE',
			eid : $stateParams.eid,
			name : $stateParams.name,
			detail : $stateParams.detail,
			destination : $stateParams.destination,
			date : $stateParams.date,
			time : $stateParams.time,
			latitude : $stateParams.latitude,
			longitude : $stateParams.longitude
		});
		}
	} ];
});