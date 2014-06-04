app.controller('FriendCtrl', function($scope, DBManager, Notification, Contacts, FriendManager, $window) {
	$scope.CREATE = 0;
	$scope.EDIT = 1;
	$scope.DELETE = 2;
	$scope.MESSAGE = 3;

	$scope.friendArray;
	$scope.model = {};
	$scope.state = $scope.CREATE;
	
	$scope.init = function() {
		$scope.friendArray = FriendManager.all();
		console.log('length = ' + Object.keys($scope.friendArray).length);
		if(FriendManager.length())
			return ;
		DBManager.getFriends();
		console.log('length = ' + Object.keys($scope.friendArray).length);
    };
	
	$scope.onFriendClick = function(STATE,id) {
		$scope.state = STATE;
		$scope.model = angular.copy(FriendManager.get(id));
	};
    
	$scope.onCreateClick = function() {
		if (!$scope.model.name || !$scope.model.phone) {
			Notification.alert("請輸入姓名及電話", null, '警告', '確定');
			return;
		}
		var friend = {
			name: $scope.model.name,
			phone: $scope.model.phone,
			email: $scope.model.email,
			birthday: $scope.model.birthday
		};
		DBManager.addFriend(friend);
		$scope.model = {};
	};
	
	$scope.onEditClick = function() {
		var friend = angular.copy($scope.model);
		DBManager.updateFriend(friend);
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.onDeleteClick = function() {
		var friend = angular.copy($scope.model);
		DBManager.deleteFriend(friend);
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.onCancelClick = function() {
		$scope.model = {};
		$scope.state = $scope.CREATE;
	};
	
	$scope.setFriendsFromContacts = function() {
        var options = new ContactFindOptions();
        options.multiple = true;
        options.filter = "";
        var fields = ["displayName", "phoneNumbers", "emails", "birthday"];
        Contacts.find(fields, $scope.onSetFriendsFromContactsSuccess, $scope.onSetFriendsFromContactsError, options);
	};

    $scope.onSetFriendsFromContactsSuccess = function(contactArray) {
        for (var i = 0, max = contactArray.length; i < max; i++) {
        	var contactName = contactArray[i].displayName;
        	if (!contactName)
        		continue;
        	var mobileNumber = getMobileNumber(contactArray[i].phoneNumbers);
        	if (!mobileNumber)
        		continue;
            var friend = {
                name: contactName,
                phone: mobileNumber,
                email: (contactArray[i].emails && contactArray[i].emails.length > 0) ? contactArray[i].emails[0].value : "",
                birthday: contactArray[i].birthday
            };
            DBManager.addFriend(friend);
        }
        $scope.init();
    };
	
	var getMobileNumber = function(phoneNumbers) {
		if (!(phoneNumbers instanceof Array))
			return null;
		for (var i = 0, max = phoneNumbers.length; i < max; i++) {
			if (phoneNumbers[i].type == 'mobile')
				return phoneNumbers[i].value;
		}
		return null;
	};
	
    $scope.onSetFriendsFromContactsError = function(e) {
        console.log(e);
    };
	    
	$scope.newFriendsButton = [{
		type: 'button-positive',
		content: "<i class='icon ion-plus'></i>",
		tap: $scope.setFriendsFromContacts
	}];
	
	$scope.checkLength = function() {
		return FriendManager.length();
	};
	
	$scope.onSMSClick = function() {
		var birthday = $scope.model.birthday ? $scope.model.birthday : "";
		$scope.SMS_MESSAGE = $scope.model.name + "真高興, " + birthday + "你又長了一歲。祝你生日快樂，永遠快樂";
		$window.sms.send($scope.model.phone, $scope.SMS_MESSAGE, "INTENT", 
			function(result) {
				if(result == "1") {
					navigator.notification.alert('發送簡訊成功!', null, "Info");
				} else {
					navigator.notification.alert('取消發送', null, "Info");
				}
				}, function(error) {
					console.log("發送失敗，原因:"+error);
				});
			};
	
	$scope.onPhoneClick = function() {
		$window.open("tel:"+ $scope.model.phone);
	};
	
	$scope.onEmailClick = function() {
		var birthday = $scope.model.birthday ? $scope.model.birthday : "";
		$scope.EMAIL_MESSAGE = $scope.model.name + "<br>　真高興，" + birthday + "你又長了一歲。祝你生日快樂，永遠快樂";
		$window.plugins.emailComposer.showEmailComposerWithCallback(
			function(result){
				if (result == 2) {
					navigator.notification.alert('成功發送郵件', null, "Info");
				} else {
					navigator.notification.alert('取消發送郵件', null, "Info");
				}
			}
			, "", $scope.EMAIL_MESSAGE, [$scope.model.email], [], [], true, []);
	};
});