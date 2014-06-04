var app = angular.module("Simple_App04", ['ionic','PhoneGap']);

app.config( function($stateProvider, $urlRouterProvider) {
	$stateProvider
	    .state('tab', {
	        url: "/tab",
	        abstract: true,
	        templateUrl: "templates/04_sqlite/tab.html"
	    })
        .state('tab.index', {
            url: '/index',
            views: {
                'tab-index': {
                    templateUrl: 'templates/04_sqlite/helloSQLite.html',
                    controller: 'HelloSQLiteCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise("/tab/index");
});


app.factory('DBManager', function($q, $window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "BirthdayLineDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, email TEXT, birthday TEXT)", []);
        });
    });
    return {
        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            if (friend.phone == "")
	            	friend.phone = null;
	            if (friend.phone != null)
	            	friend.phone = friend.phone.replace(/-/g, "").replace(/ /g, "");
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, email, birthday) VALUES (?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.fbid],
	                    function(tx, res) {
	                		friend.id = res.insertId;
	                        (onSuccess || angular.noop)();
	                    }, function (e) {
	                        console.log('新增資料失敗，原因:'+e.message);
	    	            	console.log(JSON.stringify(friend));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },
        getFriends: function (onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM friends", [],onSuccess,onError);
            	});
            });
        },
        updateFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
            db.transaction(function (tx) {
                tx.executeSql("UPDATE friends SET name = ?,phone = ?, email = ?, birthday = ? where id = ?",
                    [friend.name, friend.phone, friend.email, friend.birthday,friend.id],
                    onSuccess,
                    onError
	                );
	            });
        	});
        },
        deleteFriendById: function (id, onSuccess, onError) {
            db.transaction(function(tx) {
                tx.executeSql("delete from friends where id = ?", [id],
                    onSuccess,
                    onError
                );
            });
        }
    };
});