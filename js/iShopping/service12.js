app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "BirthdayLineDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT UNIQUE, phone TEXT UNIQUE, email TEXT, birthday DATE, isMember BOOLEAN, eventId TEXT default '')", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS friendInvitation(smid INTEGER PRIMARY KEY, name TEXT)", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS messages(msgId INTEGER PRIMARY KEY, senderPhone TEXT, receiverPhone TEXT, message TEXT, time DATE, hasRead BOOLEAN, latitude REAL, longtitude REAL)", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS event(eid INTEGER PRIMARY KEY, name TEXT, detail TEXT, date DATE, time DATE, destination TEXT, latitude REAL, longtitude REAL, mmid INTEGER)", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS eventContainMember(eid INTEGER, mid INTEGER,name TEXT, latitude REAL, longtitude REAL)", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS eventInvitation(eid INTEGER, eventName TEXT, inviterName TEXT)", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS eventMessageLog(eid INTEGER, smid INTEGER, messageType TEXT, message TEXT, latitude REAL, longtitude REAL)", []);
        });
    });
    
    return {
        addFriend: function (friend, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO friends(name, phone, email, birthday, isMember) VALUES (?, ?, ?, ?, ?)",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember],
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
	                tx.executeSql("UPDATE friends SET name = ?, phone = ?, email = ?, birthday = ?, isMember = ?, eventId = ? where id = ?",
	                    [friend.name, friend.phone, friend.email, friend.birthday, friend.isMember, friend.eventId, friend.id],
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
        },
        
        addMessage: function(message, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO messages(msgId, senderPhone, receiverPhone, message, time, hasRead) VALUES (?, ?, ?, ?, ?, ?)",
	                	[message.msgId, message.senderPhone, message.receiverPhone, message.message, message.time, message.hasRead],
	                    onSuccess, function (e) {
	                        console.log('新增朋友失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify(friend));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },
        
        readMessage: function (message, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function (tx) {
	                tx.executeSql("UPDATE messages SET hasRead = ? where msgId = ?",
	                	[true, message.msgId],
	                    function(tx, res) {
	                		message.hasRead = true;
	                        (onSuccess || angular.noop)();
	                    },
	                    onError
	                );
	            });
        	});
        },
        
        getMessages: function (onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM messages", [],
	        			onSuccess,
        				onError
    				);
            	});
            });
        },
        
        deleteMessage: function (phone, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("delete from messages where receiverPhone = ? OR senderPhone = ?", [phone],
	                	onSuccess,
	                    onError
	                );
	            });
        	});
        }
    };
});

app.factory('FriendManager', function(DBManager, iLabMember) {
	var idIndexedFriends = {};
	var phoneIndexedFriends = {};
	DBManager.getFriends(function(tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			res.rows.item(i).isMember = JSON.parse(res.rows.item(i).isMember);
			idIndexedFriends[res.rows.item(i).id] = res.rows.item(i);
			phoneIndexedFriends[res.rows.item(i).phone] = res.rows.item(i);
		}
	});
	return {
		add: function(friend, onSuccess, onError) {
			iLabMember.isMember(friend.phone, function(response) {
				friend.isMember = JSON.parse(response);
				DBManager.addFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
                    (onSuccess || angular.noop)();
				}, onError);
			}, function() {
				friend.isMember = false;
				DBManager.addFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
                    (onSuccess || angular.noop)();
				}, onError);
			});
		},
		edit: function(friend, onSuccess, onError) {
			iLabMember.isMember(friend.phone, function(response) {
				friend.isMember = JSON.parse(response);
				DBManager.updateFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
                    (onSuccess || angular.noop)();
				}, onError);
			}, function() {
				friend.isMember = false;
				DBManager.updateFriend(friend, function() {
					idIndexedFriends[friend.id] = friend;
					phoneIndexedFriends[friend.phone] = friend;
                    (onSuccess || angular.noop)();
				}, onError);
			});
		},
		remove: function(friend, onSuccess, onError) {
			DBManager.deleteFriend(friend, function() {
				delete idIndexedFriends[friend.id];
			}, onError);
		},
		getById: function(id) {
			return idIndexedFriends[id];
		},
		getByPhone: function(phone) {
			return phoneIndexedFriends[phone];
		},
		list: function() {
			return idIndexedFriends;
		},
		count: function() {
			return Object.keys(idIndexedFriends).length;
		}
	};
  
});

app.factory('SettingManager', function($window) {
	if (!$window.localStorage['host'])
		$window.localStorage['host'] = "{}";
	return {
		setHost: function(host) {
			$window.localStorage['host'] = JSON.stringify(host);
		},
		getHost: function() {
			return JSON.parse($window.localStorage['host']);
		}
	};
	/*
	if (!$window.localStorage['host'])
		$window.localStorage['host'] = "{}";
	var host = JSON.parse($window.localStorage['host']);
	return {
		setHost: function(newHost) {
			for (var i in newHost)
				host[i] = newHost[i];
			$window.localStorage['host'] = JSON.stringify(host);
		},
		getHost: function() {
			return host;
		}
	};
	*/
});

app.factory('ChatManager', function(DBManager, SettingManager) {
	var messages = {};
	var host = SettingManager.getHost();
	var unlogMsgIds = {};
	var getPhone = function(message) {
		if (message.senderPhone == host.phone)
			return message.receiverPhone;
		return message.senderPhone;
	};
	var checkMessage = function(message) {
		var result = null;
		var phone = getPhone(message);
		var chatMessages = messages[phone];
		for (var i in chatMessages) {
			if (chatMessages[i].msgId == message.msgId)
				result = chatMessages[i];
		}
		return result;
	};
	DBManager.getMessages(function(tx, res) {
		console.log('host: ' + host.phone);
		for (var i = 0, max = res.rows.length; i < max; i++) {
			console.log(JSON.stringify(res.rows.item(i)));
			res.rows.item(i).hasRead = JSON.parse(res.rows.item(i).hasRead);
			var phone = getPhone(res.rows.item(i));
			console.log('phone: ' + phone);
			if(!messages[phone])
				messages[phone] = [];
			messages[phone].push(res.rows.item(i));
		}
	});
	return {
		getFriendPhone: getPhone,
		add: function(message, onSuccess, onError) {
			if (unlogMsgIds[message.msgId]) {
				console.log('take unlogMsgIds' + message.msgId);
				message.hasRead = true;
				delete unlogMsgIds[message.msgId];
			}
			DBManager.addMessage(message, function() {
				console.log('chatManager add 成功: ' + JSON.stringify(message));
				var phone = getPhone(message);
				if (!messages[phone])
					messages[phone] = [];
				messages[phone].push(message);
                (onSuccess || angular.noop)();
			}, onError);
		},
		read : function(message, onSuccess, onError) {
			console.log('db read');
			var msgId = message.msgId;
			message = checkMessage(message);
			if (!message) {
				console.log('unlogMsgIds' + msgId);
				unlogMsgIds[msgId] = true;
				return;
			}
			DBManager.readMessage(message, function() {console.log('db success');}, onError);
		},
		remove: function(phone, onSuccess, onError) {
			DBManager.deleteMessage(phone, function() {
				delete messages[phone];
                (onSuccess || angular.noop)();
			}, onError);
		},
		list: function() {
			return messages;
		},
		get: function(phone) {
			if (!messages[phone])
				messages[phone] = [];
			return messages[phone];
		},
		count: function() {
			return Object.keys(messages).length;
		}
		
	};
});