app.controller('MembersCtrl', function($scope, ChatManager, $window, FriendManager){
	$scope.friends = FriendManager.list();
	
	$scope.messages = ChatManager.list();
	
	$scope.getCount = function() {
		return FriendManager.count();
	};
	
	$scope.toURL = function(url) {
		$window.location = url;
	};
	
	$scope.getUnread = function(phone) {
		var s = 0;
		var messages = ChatManager.get(phone);
		for(var index in messages) {
			var message = messages[index];
			if(message.senderPhone == phone && !message.hasRead) {
				s++;
			}
		}
		return s;
	};
});