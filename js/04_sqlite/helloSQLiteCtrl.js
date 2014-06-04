app.controller('HelloSQLiteCtrl', function($scope, DBManager, Contacts) {
		$scope.friends = [];
		$scope.model = {fbid : null};
		$scope.state;
		$scope.CREATE = 0;
		$scope.EDIT = 1;
		$scope.setFriendListFromAddressBook = function() {
	        var options = new ContactFindOptions();
	        options.multiple = true;
	        options.filter = "";
	        var fields = ["displayName", "phoneNumbers", "birthday", "emails"];
	        Contacts.find(fields, $scope.onSuccess, $scope.onError, options);
		};
		
		$scope.showFriends = function() {
			DBManager.getFriends($scope.getFriendsSuccess);
	    };
	    
		$scope.getFriendsSuccess = function (tx, rs) {
			for (var i = 0; i < rs.rows.length; i++) {
				$scope.friends.push(rs.rows.item(i));
			}
		};
		
	    $scope.onSuccess = function(friends) {
	        for (var i = 0, max = friends.length; i < max; i++) {
	        	if (friends[i].displayName == "" || friends[i].phoneNumbers == null)
	        		continue;
	            var friend = {
	            	id: -1,
	                name: friends[i].displayName ? friends[i].displayName : "" ,
	                phone: ( friends[i].phoneNumbers != null ) && ( friends[i].phoneNumbers.length > 0 ) && ( friends[i].phoneNumbers[0] ) ? friends[i].phoneNumbers[0].value : "",
	                email: friends[i].emails != null && friends[i].emails.length > 0 && friends[i].emails[0] ? friends[i].emails[0].value : "",
	                birthday: friends[i].birthday ? friends[i].birthday : ""
	            };
	            var model = friend;
	            DBManager.addFriend(model);
	        }
	        $scope.showFriends();
	    };
	    
	    $scope.onError = function(e) {
	        console.log(e);
	    };
		
		$scope.addButton = [
	       {
	           type: 'button-positive',
	           content: "<i class='icon ion-plus'></i>",
	           tap: $scope.setFriendListFromAddressBook
	       }
	    ];
		
		$scope.addFriend = function() {
			var friend = {
					name: $scope.model.name,
					phone: $scope.model.phone,
					email: $scope.model.email,
					birthday: $scope.model.birthday
				};
			DBManager.addFriend(friend, function() {
				$scope.friends.push(friend);
		    });
			$scope.model = {};
		};
		
		$scope.updateFriend = function(){
			DBManager.updateFriend($scope.model);
		};
		
		$scope.deleteFriend = function(index) {
			$scope.friends.splice(index, 1);
		};
		
		$scope.getFriend = function(index) {
			$scope.model = $scope.friends[index];
		};
	}
);