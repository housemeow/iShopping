app.controller('EventMemberListController', function($scope, EventContainMemberManager, ChatManager, $stateParams, FriendManager, SettingManager, iLabMessage, $window, Geolocation, $state){
	var eid = $stateParams.eid;
	console.log("eid = " + eid);
	
	
	$scope.eventMemberList = EventContainMemberManager.getMembersByEid(eid);
		
		
//		[
//	                   {
//	                	   name : "王小明",
//	                	   mid: 1
//	                   },
//	                   {
//	                	   name : "陳三",
//	                	   mid: 2
//	                   },
//	                   {
//	                	   name : "iShopping",
//	                	   mid: 3,
//	                	   isManager : true
//	                   },
//	                   {
//	                	   name : "洪九",
//	                	   mid: 4
//	                   },];

	$scope.init = function() {

	};
	
	
// $scope.phone = $stateParams.phone;
// $scope.chatMessage = {};
// $scope.chatMessage.text = $stateParams.defaultMessage ?
// $stateParams.defaultMessage : "";
// $scope.messages =
// ChatManager.get($scope.phone);//[{senderPhone:"0922110002",receiverPhone:"0922110002",hasRead:true,message:"hi"}];
// $scope.friendName = FriendManager.getByPhone($scope.phone).name;
// $scope.hostPhone = SettingManager.getHost().phone;;
//	
// $scope.$on('receivedMessage', function(event, message) {
// if (message.hasRead) {
// $scope.$apply();
// } else {
// $scope.readMessage(message);
// }
// });
//	
//	
// $scope.onSendMessageClick = function() {
// if(!$scope.chatMessage.text) {
// console.log('不能發送空訊息');
// return;
// }
// var message = {
// senderPhone: $scope.hostPhone,
// receiverPhone: $scope.phone,
// message: $scope.chatMessage.text
// };
// iLabMessage.sendMessage(message);
// $scope.chatMessage.text = "";
// };
//    
// $scope.readMessage = function(message) {
// if(!message.hasRead && message.senderPhone == $scope.phone) {
// message.hasRead = true;
// iLabMessage.sendMessage(message);
// ChatManager.read(message, $scope.$apply);
// }
// };
//	
// $scope.onLocationClick = function() {
// Geolocation.getCurrentPosition(function(position) {
// $scope.chatMessage.text =
// "("+position.coords.latitude+","+position.coords.longitude+")" +
// $scope.chatMessage.text;
// $scope.onSendMessageClick();
// });
// };
//    
// $scope.hasLocation = function(message) {
// if (message.hasLocation == undefined)
// message.hasLocation = new
// RegExp(/^\(([0-9.]+),([0-9.]+)\)/).test(message.message);
// return message.hasLocation;
// };
//    
// $scope.onMessageClick = function(message) {
// if (message.hasLocation) {
// var latlng = message.message.match(/([0-9.-]+).+?([0-9.-]+)/);
// console.log(message.senderPhone == $scope.hostPhone);
// $state.go('map', {
// latitude:latlng[1],
// longitude:latlng[2],
// friendName:$scope.friendName,
// isMe:message.senderPhone == $scope.hostPhone
// });
// }
// };
//    
// $scope.backButton = [{
// type: 'button-clear ion-ios7-arrow-back',
// content: "",
// tap: function() {
// $window.location = "#/tab/members";
// }
// }];
});