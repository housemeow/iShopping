app.controller('ChatCtrl', function($scope, ChatManager, $stateParams, $ionicScrollDelegate, FriendManager, SettingManager, iLabMessage, $window, $rootScope){
	$scope.phone = $stateParams.phone;//0922110002;
	$scope.message = {};
	$scope.message.text = "";
	$scope.chatMessages = ChatManager.get($scope.phone);//[{senderPhone:"0922110002",receiverPhone:"0922110002",hasRead:true,message:"hi"}];
	$scope.friendName = FriendManager.getByPhone($scope.phone).name;//"Hans";
	$scope.hostPhone = SettingManager.getHost().phone;//0922110002;
	
	$scope.$on('receivedMessage', function(res, message) {
		if(message.hasRead) {
			$scope.$apply();
		} else {			
			$scope.readMessage(message);
		}
	});
	
	$scope.init = function() {
		for(var index in $scope.chatMessages) {
			var chatMessage = $scope.chatMessages[index];
			$scope.readMessage(chatMessage);
		}
		$ionicScrollDelegate.scrollBottom();
	};
	
	$scope.onSendMessageClick = function() {
		if(!$scope.message.text) {
			console.log('不能發送空訊息');
			return;
		}
		iLabMessage.sendMessage($scope.hostPhone, $scope.phone, $scope.message.text, function(response) {
			//console.log('add response:' + response);
			//ChatManager.add(response, $scope.$apply);
		});
		$scope.message.text = "";
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
	
	$scope.backButton = [{
		type: 'button-clear ion-ios7-arrow-back',
		content: "",
		tap: function() {
			$window.history.back();
		}
	}];
});