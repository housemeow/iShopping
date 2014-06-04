app.controller('SettingCtrl',function($scope, $window, UserManager, $ionicLoading, $http, Notification, iLabMember){
	$scope.ANONYMOUS = 0;
	$scope.MEMBER = 1;
	$scope.DELETE = 2;
	
	$scope.state = $scope.ANONYMOUS;
	
	$scope.init = function() {
		$scope.user = UserManager.get();
		if($scope.user.registered == "true") {
			$scope.state = $scope.MEMBER;
		}
	};	
	
	$scope.onActionClick = function(STATE) {
    	$scope.state = STATE;
    };
    
    $scope.onRegisterClick = function() {
    	$scope.show();
    	iLabMember.register($scope.user,
     		   function() {
     			$scope.hide();
     			$scope.user.registered = "true";
     			Notification.alert('註冊成功', null, "通知");
     			UserManager.set($scope.user);
     			$scope.state = $scope.MEMBER;
     		}, function() {
     			$scope.hide();
     			Notification.alert('註冊失敗', null, "通知");
 		});
    };
	
	$scope.onDeleteClick = function() {
		$scope.show();
		iLabMember.removeMember($scope.user.phone, function(response) {
			Notification.alert('刪除成功', null, "通知");
			$scope.user.phone = "";
			$scope.user.registered = "";
			UserManager.set($scope.user);
			$scope.hide();
			$scope.state = $scope.ANONYMOUS;
			}, function() {
    			Notification.alert('刪除失敗', null, "通知");
    			$scope.hide();
    		});
	};
	
	$scope.onCancelClick = function() {
		$scope.user = UserManager.get();
		$scope.state = $scope.MEMBER;
	};
	
    $scope.show = function() {
        $scope.loading = $ionicLoading.show({
          content: "<i class='ion-loading-b'></i>",
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 500
        });
    };
    
    $scope.hide = function() {
    	$scope.loading.hide();
    };
});