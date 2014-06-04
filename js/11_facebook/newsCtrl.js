app.controller('NewsCtrl', function($scope, ChatManager, $ionicScrollDelegate, FriendManager, SettingManager, iLabMessage, $window, $rootScope){
	$scope.host = SettingManager.getHost();
	$scope.publisherName = $scope.host.publisherName;
	$scope.publisherId = $scope.host.publisherId;
	$scope.messages = ChatManager.get($scope.publisherId);
	
	$scope.$on('receivedMessage', function(res, message) {
		if(message.hasRead) {
			$scope.$apply();
		} else {			
			$scope.readMessage(message);
		}
	});
	
	$scope.init = function() {
		for(var index in $scope.messages) {
			var chatMessage = $scope.messages[index];
			$scope.readMessage(chatMessage);
		}
	};
	
	$scope.reverse = function(array) {
        return [].concat(array).reverse();
    };
    
    $scope.readMessage = function(chatMessage) {
    	if(!chatMessage.hasRead && chatMessage.senderPhone == $scope.phone) {
			iLabMessage.readMessage(chatMessage.msgId);
			ChatManager.read(chatMessage, $scope.$apply);
		}
    };
    
    $scope.isSubscribe = function() {
    	return SettingManager.publisherId ? true : false;
    };
});