app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "BirthdayLineDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT, phone TEXT UNIQUE, email TEXT, birthday DATE, member BOOLEAN)", []);
        });
    });
    
    return {
        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, email, birthday, member) VALUES (?, ?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.member],
	                    function(tx, res) {
	                		friend.id = res.insertId;
	                        (onSuccess || angular.noop)();
	                    }, function (e) {
	                        console.log('新增朋友失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify(friend));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },
        
        updateFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function (tx) {
	                tx.executeSql("UPDATE friends SET name = ?, phone = ?, email = ?, birthday = ?, member = ? where id = ?",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.member, friend.id],
	                    onSuccess,
	                    onError
	                );
	            });
        	});
        },
        
        deleteFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("delete from friends where id = ?", [friend.id],
	                	onSuccess,
	                    onError
	                );
	            });
        	});
        },
        
        getFriends: function (onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM friends", [],
	        			onSuccess,
        				onError
    				);
            	});
            });
        }
    };
});

app.factory('FriendManager', function(DBManager, iLabMember) {
	var friends = {};
	var fridndsByPhone = {};
	DBManager.getFriends(function(tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			friends[res.rows.item(i).id] = res.rows.item(i);
		}
	});
	return {
		add: function(friend) {
			iLabMember.isMember(friend.phone, function(response) {
				friend.member = response;
				DBManager.addFriend(friend, function() {
					friends[friend.id] = friend;
				});
			}, function() {
				friend.member = false;
				DBManager.addFriend(friend, function() {
					friends[friend.id] = friend;
				});
			});
		},
		edit: function(friend) {
			iLabMember.isMember(friend.phone, function(response) {
				friend.member = response;
				DBManager.updateFriend(friend, function() {
					friends[friend.id] = friend;
				});
			}, function() {
				friend.member = false;
				DBManager.updateFriend(friend, function() {
					var oldFriend = friends[friend.id];
					oldFriend.name = friend.name;
					oldFriend.phone = friend.phone;
					oldFriend.email = friend.email;
					oldFriend.birthday = friend.birthday;
				});
			});
		},
		remove: function(friend) {
			DBManager.deleteFriend(friend, function() {
				delete friends[friend.id];
			});
		},
		get: function(id) {
			return friends[id];
		},
		getByPhone: function(phone) {
			if (fridndsByPhone[phone] == undefined) {
				for (var id in friends) {
					if (friends[id].phone == phone) {
						fridndsByPhone[phone] = friends[id];
						break;
					}
				}
			}
			return fridndsByPhone[phone];
		},
		list: function() {
			return friends;
		},
		count: function() {
			return Object.keys(friends).length;
		}
	};
  
});

app.factory('UserManager', function($window) {
	var user = {};
	
	if ($window.localStorage['user']) {
		user = JSON.parse($window.localStorage['user']);
	}
	user.type = localStorage['type'];
	user.token = localStorage['token'];
	
	return {
		set: function(data) {
			localStorage['user'] = JSON.stringify(data);
			user = data;
		},
		get: function() {
			return user;
		}
	};
});