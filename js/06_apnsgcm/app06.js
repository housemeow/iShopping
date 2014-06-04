var app = angular.module("Simple_App04", ['ionic', 'PhoneGap','iLabBirthdayLine']);

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/06_apnsgcm/tab.html"
	    })
        .state('tab.helloapnsgcm', {
            url: '/helloapnsgcm',
            views: {
                'tab-hellosms': {
                    templateUrl: 'templates/06_apnsgcm/helloAPNSGCM.html',
                    controller: 'HelloAPNSGCMCtrl'
                }
            }
        })
        .state('tab.setting', {
            url: '/setting',
            views: {
                'tab-setting': {
                    templateUrl: 'templates/06_apnsgcm/setting.html',
                    controller: 'SettingCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise("/tab/helloapnsgcm");
});

app.run(function(iLabMember, UserManager) {
	var user = UserManager.get();
	iLabMember.getToken(function(token, type) {
		user.token = token;
		user.type = type == "GCM" ? "0" : "1";
	});
});