var app = angular.module("Simple_App04", ['ionic', 'PhoneGap','iLabBirthdayLine']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/08_midterm/tab.html"
	    })
        .state('tab.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/08_midterm/friends.html',
                    controller: 'FriendsCtrl'
                }
            }
        })
        .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/08_midterm/setting.html',
                    controller: 'SettingCtrl'
                }
            }
        })
		.state('tab.members', {
	        url: '/members',
	        views: {
	            'tab-members': {
	                templateUrl: 'templates/08_midterm/members.html',
	                controller: 'MembersCtrl'
	            }
	        }
	    })
	    .state('chat', {
	        url: '/chat/:phone',
            templateUrl: 'templates/08_midterm/chat.html',
            controller: 'ChatCtrl'
	    });

    $urlRouterProvider.otherwise("/tab/friends");
});

app.filter('fromNow', function() {
	return function(dateString) {
		return moment(dateString).fromNow();
	};
});

app.run(function(DBManager, SettingManager, PushNotificationsFactory, iLabMessage, $window, PhoneGap, $rootScope, FriendManager, ChatManager) {
	var host = SettingManager.getHost();
	
	PhoneGap.ready(function() {
		if(host.phone){
			$window.document.addEventListener("pause", function(){
				iLabMessage.resetCounter(host.phone);
			}, false);
		}
	});
	
	$window.receiveMessage = function(payload) {
		console.log('收到一則新訊息: ' + payload);
		var message = JSON.parse(payload);
		if(!message)
			return;
		var friend = FriendManager.getByPhone(ChatManager.getFriendPhone(message));
		if (friend) {
			console.log('receiveMessage: 有朋友 ,  hasRead:' + message.hasRead);
			if (!message.hasRead){			
				ChatManager.add(message, function() {
					$rootScope.$broadcast('receivedMessage',message);
					$rootScope.$apply();
				});
			}
			else {
				ChatManager.read(message, function() {
					$rootScope.$broadcast('receivedMessage',message);
					$rootScope.$apply();
				});
			}
		} else console.log('receiveMessage: 沒朋友');
	};
	
	if (host.registered) {
		PhoneGap.ready(function() {		
			$window.plugins.MQTTPlugin.CONNECT(angular.noop, angular.noop, host.phone, host.phone);
		});
	}
	
	var GCMSENDERID = '325215294371';
	
	PushNotificationsFactory(GCMSENDERID, function(token, type) {
		var host = SettingManager.getHost();
		host.token = token;
		if (type == "GCM")
			host.type = 0;
		else if (type == "APNS")
			host.type = 1;
		SettingManager.setHost(host);
	});
	
	moment.lang('zh-tw');
});