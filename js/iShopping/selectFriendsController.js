app.controller('SelectFriendsController', function($scope, $state,
		FriendManager, $stateParams) {

	$scope.init = function() {
		if ($stateParams.members == null) {
			$scope.members = $scope.getMembers();
		} else {
			$scope.members = JSON.parse($stateParams.members);
		}
	};

	$scope.getMembers = function() {
		var friends = FriendManager.list();
		var members = [];
		console.log("friends = " + JSON.stringify(friends));
		for ( var key in friends) {
			if (friends.hasOwnProperty(key)) {
				var referenceFriend = friends[key];
				var friend = {};
				friend.phone = referenceFriend.phone;
				friend.name = referenceFriend.name;
				friend.enabled = false;
				if (referenceFriend.isMember) {
					members.push(friend);
				}
			}
		}
		return members;
	};

	$scope.addFriendsButton = [ {
		type : 'button-positive',
		content : "<i class='icon ion-checkmark'></i>",
		tap : function() {
			var members = JSON.stringify($scope.members);
			console.log("members = " + members);
			$state.go('event', {
				state : 'CREATE',
				eid : $stateParams.eid,
				name : $stateParams.name,
				detail : $stateParams.detail,
				destination : $stateParams.destination,
				date : $stateParams.date,
				time : $stateParams.time,
				latitude : $stateParams.latitude,
				longitude : $stateParams.longitude,
				members : members
			});
		}
	} ];
});