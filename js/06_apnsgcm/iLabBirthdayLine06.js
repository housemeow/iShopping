angular.module('iLabBirthdayLine', []).factory('iLabMessage', function ($rootScope, $window, $http) {
    return {
    	sendMessage: function(sender, receiver, message) {
        	var urlStr = 'http://ilab.kgame.tw:7828/api/Message';
    		var data = {
                Sender: sender,
                Receiver: receiver,
                Message: message
            };
    		
    		var p = $http({
                method: 'POST',
                url: urlStr,
                data: data
            });
    		
    		p.success(function(response, status, headers, config){
    			console.log("發送成功");
    		});
    		
    		p.error(function(response, status, headers, config) {
    		    console.log("發送失敗，原因:"+response);
    		});
        }
    };
});


angular.module('iLabBirthdayLine').factory('iLabMember', function (PushNotificationsFactory, $rootScope, $window, $http) {
	return {
        isMember: function(phone, onSuccess, onError) {
			var p = $http({
				method: 'GET',
				url: 'http://ilab.kgame.tw:7828/api/Member',
				params: {phone: phone}
			});
			p.success(function(response, status, headers, config){
    			(onSuccess || angular.noop)(response);
    		});
    		p.error(function (response, status, headers, config){
    			(onError || angular.noop)(false);
    		});
        },
		getToken: function(onSuccess) {
	    	PushNotificationsFactory('325215294371', onSuccess);
	    },
	    register: function(user, onSuccess, onError) {
	    	var registerData = {
    			Phone: user.phone,
    			Type: user.type,
    			Token: user.token
    		};
        	console.log(JSON.stringify(registerData));
	        	
    		var p = $http({
    			method: 'POST',
    			url: 'http://ilab.kgame.tw:7828/api/Member',
    			data: registerData
    		});
	    		
    		p.success(function(response, status, headers, config){
    			(onSuccess || angular.noop)(response);
    		});
	    		
    		p.error(function (response, status, headers, config){
    			(onError || angular.noop);
    		});
	    },
	    removeMember: function(phone, onSuccess, onError) {
        	var p = $http({
    			method: 'DELETE',
    			url: 'http://ilab.kgame.tw:7828/api/Member',
    			params: {
    				phone: phone
    			}
    		});
    		p.success(function(response, status, headers, config){
    			(onSuccess || angular.noop)(response);
    		});
    		p.error(function (response, status, headers, config){
    			(onError || angular.noop)(false);
    		});
        }
	};
});