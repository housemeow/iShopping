var app = angular.module("iShopping", ['ionic', 'PhoneGap','iLabBirthdayLine']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/iShopping/tab.html"
	    })
        .state('tab.friends', {
            url: '/friends',
            views: {
                'tab-friends': {
                    templateUrl: 'templates/iShopping/friends.html',
                    controller: 'FriendsCtrl'
                }
            }
        })
        .state('tab.eventList', {
            url: '/eventList',
            views: {
                'tab-eventList': {
                    templateUrl: 'templates/iShopping/eventList.html',
                    controller: 'EventListController'
                }
            }
        })
        .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/iShopping/setting.html',
                    controller: 'SettingCtrl'
                }
            }
        })
		.state('tab.members', {
	        url: '/members',
	        views: {
	            'tab-members': {
	                templateUrl: 'templates/iShopping/members.html',
	                controller: 'MembersCtrl'
	            }
	        }
	    })
	    .state('tab.news', {
	        url: '/news',
	        views: {
                'tab-news': {
                    templateUrl: 'templates/iShopping/news.html',
                    controller: 'NewsCtrl'
                }
	        }
	    })
	    .state('eventMap', {
	        url: '/eventMap?eid&name',
            templateUrl: 'templates/iShopping/eventMap.html',
            controller: 'EventMapController'
	    })
	    .state('eventMemberList', {
	        url: '/eventMemberList?eid',
            templateUrl: 'templates/iShopping/eventMemberList.html',
            controller: 'EventMemberListController'
	    })
	    .state('eventChatRoom', {
	        url: '/eventCharRoom?eid&name',
            templateUrl: 'templates/iShopping/eventChatRoom.html',
            controller: 'EventChatRoomController'
	    })
	    .state('event', {
	        url: '/event?state&eid&name&detail&destination&date&time&latitude&longitude&members',
            templateUrl: 'templates/iShopping/event.html',
            controller: 'EventController'
	    })
	    .state('selectFriends', {
	        url: '/selectFriends?state&eid&name&detail&destination&date&time&latitude&longitude&members',
            templateUrl: 'templates/iShopping/selectFriends.html',
            controller: 'SelectFriendsController'
	    })
	    .state('gatheringPointMap', {
	        url: '/gatheringPointMap?state&eid&name&detail&destination&date&time&latitude&longitude&members',
            templateUrl: 'templates/iShopping/gatheringPointMap.html',
            controller: 'GatheringPointMapController'
	    })
	    .state('chat', {
	        url: '/chat?phone&defaultMessage',
            templateUrl: 'templates/iShopping/chat.html',
            controller: 'ChatCtrl'
	    })
	    .state('map', {
	        url: '/map?latitude&longitude&friendName&isMe',
            templateUrl: 'templates/iShopping/map.html',
            controller: 'MapCtrl'
	    });

    $urlRouterProvider.otherwise("/tab/friends");
});

app.filter('fromNow', function() {
	return function(dateString) {
		if(!dateString)
			return;
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

app.filter('afterDay', function() {
	return function(dateString) {
		if (!dateString)
			return '未知';
		var birthday = new Date(dateString);
		var now = moment().startOf('day').toDate();
		//birthday.setFullYear(now.getFullYear());
		//if (birthday < now)
		//	birthday.setFullYear(now.getFullYear() + 1);
		
		var span = now.dateDiff(birthday, 'd');
		if (span == 0)
			return '今天';
		if(span<0){
			return "已過期";
		}
		
		return span + '天後';
	};
});

app.filter('sortBy', function () {
    return function (items, method) {
        var result = [];
        angular.forEach(items, function (value, key) {
        	 result.push(value);
        });
        
        var birthday = function(a, b) {
         	if(!a.birthday)
         		return 1;
         	if(!b.birthday)
         		return -1;
             var d1 = new Date(a.birthday);
             var d2 = new Date(b.birthday);
             var now = moment().startOf('day').toDate();
             d1.setFullYear(now.getFullYear());
             if (d1 < now)
                 d1.setFullYear(now.getFullYear() + 1);
             d2.setFullYear(now.getFullYear());
             if (d2 < now)
                 d2.setFullYear(now.getFullYear() + 1);
             if (d1 > d2)
             	return 1;
             if (d1 < d2)
             	return -1;
             return 0;
         };
         
         var message = function(a, b) {
        	if(!a.lastMessage && !b.lastMessage)
        		return birthday(a,b);
        	if(!a.lastMessage)
         		return 1;
        	if(!b.lastMessage)
         		return -1;
             var d1 = new Date(a.lastMessage);
             var d2 = new Date(b.lastMessage);
             if (d1 > d2)
             	return -1;
             if (d1 < d2)
             	return 1;
             return 0;
         };
        if(method == 'birthday') {
        	result.sort(birthday);
        }
        else if (method == 'message') {
        	result.sort(message);
        }
        return result;
    };
});

app.filter('reverseArray', function () {
    return function (array) {
        return [].concat(array).reverse();;
    };
});

app.run(function(DBManager, EventManager, SettingManager, PushNotificationsFactory, iLabMessage, $window, PhoneGap, $rootScope, FriendManager, ChatManager) {
	Date.prototype.dateDiff = function(objDate, interval){
	    var dtEnd = new Date(objDate);
	    if(isNaN(dtEnd)) return undefined;
	    switch (interval) {
	        case "s":return parseInt((dtEnd - this) / 1000);  //秒
	        case "n":return parseInt((dtEnd - this) / 60000);  //分
	        case "h":return parseInt((dtEnd - this) / 3600000);  //時
	        case "d":return parseInt((dtEnd - this) / 86400000);  //天
	        case "w":return parseInt((dtEnd - this) / (86400000 * 7));  //週
	        case "m":return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-this.getFullYear())*12) - (this.getMonth()+1);  //月份
	        case "y":return dtEnd.getFullYear() - this.getFullYear();  //天
	    }
	};
	
	var host = SettingManager.getHost();
	var fbAppId = '270369976420378';
	$window.openFB.init(fbAppId);
	
	$window.receiveMessage = function(payload) {
		console.log('這裡是app12.js window.receveMessage 收到一則新訊息: ' + payload);
		var message = JSON.parse(payload);
		message.message = JSON.parse(message.message);
		console.log("messge:" + JSON.stringify(message));
		if(!message)
			return;
		var friend = FriendManager.getByPhone(message.senderPhone);
		if (friend || host.phone == message.senderPhone || host.publisherId == message.senderPhone) {
			iLabMessage.resetCounter(host.phone);
			console.log('receiveMessage: 發訊者是朋友,或是我,或是消息發布者 ,  hasRead:' + message.hasRead);
			if(message.message.type == "friendMessage")
			{
				console.log('這裡是app12.js window.receveMessage : type = friendMessage');
				if (!message.hasRead){ //別人發的訊息	
					ChatManager.add(message, function() {
						$rootScope.$broadcast('receivedMessage', message);
						$rootScope.$apply();
					});
				}
				else { // 自己發的訊息
					ChatManager.read(message, function() {
						$rootScope.$broadcast('receivedMessage',message);
						$rootScope.$apply();
					});
				}
			}else if(message.message.type = "eventCreate"){
				console.log('這裡是app12.js window.receveMessage : type = eventCreate');
				var event = message.message.event;
				EventManager.addFromExistEid(event);
				var members = message.message.event.members;
				console.log("messge:" + JSON.stringify(members));
				for(i=0;i<members.length;i++){
					var member = members[i];
					member.eid = event.eid;
					console.log("member: " + JSON.stringify(member));
					EventContainMemberManager.add(member);
					/*
					if(member.phone != host.phone)
					{
						EventContainMemberManager.add(member);
					}
					*/
				}
			}
		}
		else console.log('receiveMessage: 發訊者來路不明');
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