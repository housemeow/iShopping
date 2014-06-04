var app = angular.module("Simple_App04", ['ionic', 'PhoneGap','iLabBirthdayLine']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/10_map/tab.html"
	    })
        .state('tab.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/10_map/friends.html',
                    controller: 'FriendsCtrl'
                }
            }
        })
        .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/10_map/setting.html',
                    controller: 'SettingCtrl'
                }
            }
        })
		.state('tab.members', {
	        url: '/members',
	        views: {
	            'tab-members': {
	                templateUrl: 'templates/10_map/members.html',
	                controller: 'MembersCtrl'
	            }
	        }
	    })
	    .state('tab.news', {
	        url: '/news',
	        views: {
                'tab-news': {
                    templateUrl: 'templates/10_map/news.html',
                    controller: 'NewsCtrl'
                }
	        }
	    })
	    .state('chat', {
	        url: '/chat/:phone',
            templateUrl: 'templates/10_map/chat.html',
            controller: 'ChatCtrl'
	    })
	    .state('map', {
	        url: '/map?latitude&longitude&friendName&isMe',
            templateUrl: 'templates/10_map/map.html',
            controller: 'MapCtrl'
	    });

    $urlRouterProvider.otherwise("/tab/friends");
});

app.filter('fromNow', function() {
	return function(dateString) {
		return moment(dateString).fromNow();
	};
});

app.filter('removeLocation', function() {
	return function(messageString) {
		var result = messageString.replace(/^\([0-9.]+,[0-9.]+\)/, '');
		if (!result)
			return '顯示地圖';
		return result;
	};
});

app.run(function(DBManager, SettingManager, PushNotificationsFactory, iLabMessage, $window, PhoneGap, $rootScope, FriendManager, ChatManager) {
	var host = SettingManager.getHost();

	$window.receiveMessage = function(payload) {
		console.log('收到一則新訊息: ' + payload);
		var message = JSON.parse(payload);
		if(!message)
			return;
		var friend = FriendManager.getByPhone(message.senderPhone);
		if (friend || host.phone == message.senderPhone || host.publisherId == message.senderPhone) {
			iLabMessage.resetCounter(host.phone);
			console.log('receiveMessage: 發訊者是朋友,或是我,或是消息發布者 ,  hasRead:' + message.hasRead);
			if (!message.hasRead){			
				ChatManager.add(message, function() {
					$rootScope.$broadcast('receivedMessage', message);
					$rootScope.$apply();
				});
			}
			else {
				ChatManager.read(message, function() {
					$rootScope.$broadcast('receivedMessage',message);
					$rootScope.$apply();
				});
			}
		} else console.log('receiveMessage: 發訊者來路不明');
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