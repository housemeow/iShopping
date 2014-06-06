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
	console.log("hello!!!!");
	EventManager.list(function(list){
		console.log(JSON.stringify(list));
		$scope.eventList = list;
	});
	
	var events =[
	                   {
	                	   name : "爽歪歪",
	                	   //eid: 1,
	                	   date: new Date("2014-06-05")
	                   },
	                   {
	                	   name : "歪歪",
	                	   //eid: 2,
	                	   date: new Date("2014-06-18")
	                   },
	                   {
	                	   name : "Qoo",
	                	   //eid: 3,
	                	   date: new Date("2014-06-20")
	                   },
	                   {
	                	   name : "拉布拉多",
	                	   //eid: 4,
	                	   date: new Date("2014-06-01")
	                   },];
	for(var i=0;i<events.length;i++){
		console.log(JSON.stringify(events[i]));
		EventManager.add(events[i]);
	}
	

	$scope.init = function() {
		var host = SettingManager.getHost();
		console.log(JSON.stringify(host));
	};
	
	
//	$scope.phone = $stateParams.phone;
//	$scope.chatMessage = {};
//	$scope.chatMessage.text = $stateParams.defaultMessage ? $stateParams.defaultMessage : "";
//	$scope.messages = ChatManager.get($scope.phone);//[{senderPhone:"0922110002",receiverPhone:"0922110002",hasRead:true,message:"hi"}];
//	$scope.friendName = FriendManager.getByPhone($scope.phone).name;
//	$scope.hostPhone = SettingManager.getHost().phone;;
//	
//	$scope.$on('receivedMessage', function(event, message) {
//		if (message.hasRead) {
//			$scope.$apply();
//		} else {
//			$scope.readMessage(message);
//		}
//	});
//	
//	
//	$scope.onSendMessageClick = function() {
//		if(!$scope.chatMessage.text) {
//			console.log('不能發送空訊息');
//			return;
//		}
//		var message = {
//        	senderPhone: $scope.hostPhone,
//            receiverPhone: $scope.phone,
//            message: $scope.chatMessage.text
//        };
//		iLabMessage.sendMessage(message);
//		$scope.chatMessage.text = "";
//	};
//    
//    $scope.readMessage = function(message) {
//    	if(!message.hasRead && message.senderPhone == $scope.phone) {
//    		message.hasRead = true;
//			iLabMessage.sendMessage(message);
//			ChatManager.read(message, $scope.$apply);
//		}
//    };
//	
//    $scope.onLocationClick = function() {
//    	Geolocation.getCurrentPosition(function(position) {
//    		$scope.chatMessage.text = "("+position.coords.latitude+","+position.coords.longitude+")" + $scope.chatMessage.text;
//    		$scope.onSendMessageClick();
//    	});
//    };
//    
//    $scope.hasLocation = function(message) {
//    	if (message.hasLocation == undefined)
//    		message.hasLocation = new RegExp(/^\(([0-9.]+),([0-9.]+)\)/).test(message.message);
//    	return message.hasLocation;
//    };
//    
//    $scope.onMessageClick = function(message) {
//    	if (message.hasLocation) {
//        	var latlng = message.message.match(/([0-9.-]+).+?([0-9.-]+)/);
//        	console.log(message.senderPhone == $scope.hostPhone);
//        	$state.go('map', {
//        		latitude:latlng[1],
//        		longitude:latlng[2],
//        		friendName:$scope.friendName,
//        		isMe:message.senderPhone == $scope.hostPhone
//        	});
//    	}
//    };
//    
//	$scope.backButton = [{
//		type: 'button-clear ion-ios7-arrow-back',
//		content: "",
//		tap: function() {
//			$window.location = "#/tab/members";
//		}
//	}];
});