app.factory('DBManager', function($window, PhoneGap) {
	var db = null;
    PhoneGap.ready(function() {
        db = $window.sqlitePlugin.openDatabase({name: "BirthdayLineDB"});
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS friends(id INTEGER PRIMARY KEY ASC, name TEXT UNIQUE, phone TEXT UNIQUE, email TEXT, birthday DATE, isMember BOOLEAN, eventId TEXT default '')", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS messages(msgId INTEGER PRIMARY KEY, senderPhone TEXT, receiverPhone TEXT, message TEXT, time DATE, hasRead BOOLEAN, latitude REAL, longitude REAL)", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS event(eid INTEGER, name TEXT, detail TEXT, date DATE, time TEXT, destination TEXT, latitude REAL, longitude REAL)", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS eventContainMember(eid INTEGER, phone TEXT, name TEXT, latitude REAL, longitude REAL, PRIMARY KEY (eid, phone))", []);
            tx.executeSql("CREATE TABLE IF NOT EXISTS eventMessage(eid INTEGER, senderPhone TEXT, messageType TEXT, message TEXT, latitude REAL, longitude REAL)", []);
        });
    });
    
    return {
    	// frineds
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
        
        // event
        getEvents: function (onSuccess, onError) {
        	console.log("流程 - DBManager getEvents");
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM event", [],
	        			onSuccess,
        				onError
    				);
            	});
            });
        },

        addEvent: function(event, onSuccess, onError) {
        	console.log("流程 - DBManager addEvent");
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO event(eid, name, detail, date, time, destination, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
	                	[event.eid, event.name, event.detail, event.date, event.time, event.destination, event.latitude, event.longitude],
	                    function(tx, res){
	                    	//event.eid = res.insertId;
	                    	(onSuccess||angular.noop)();
	                    }, function (e) {
	                        console.log('新增任務失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify(event));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },

        updateEvent: function(event, onSuccess, onError) {
        	console.log("流程 - DBManager updateEvent");
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("UPDATE event SET name = ?, detail = ?, date = ?, time = ?, destination = ?, latitude = ?, longitude = ?, mmid = ? where eid = ?",
	                	[event.name, event.detail, event.date, event.time, event.destination, event.latitude, event.longitude, event.mmid, event.eid],
	                    onSuccess, function (e) {
	                        console.log('編輯任務失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify(event));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },
        
        // evendContainMember
        getEventContainMembers: function (onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM eventContainMember", [],
	        			onSuccess,
        				onError
    				);
            	});
            });
        },

        addEventContainMember: function(eventContainMember, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO eventContainMember(eid, phone, name, latitude, longitude) VALUES (?, ?, ?, ?, ?)",
	                	[eventContainMember.eid, eventContainMember.phone, eventContainMember.name, eventContainMember.latitude, eventContainMember.longitude],
	                    onSuccess, function (e) {
	                        console.log('新增事件成員失敗，原因: ' + e.message);
	    	            	console.log(JSON.stringify(friend));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },

        // eventMessage
        getEventMessages: function (onSuccess, onError) {
        	PhoneGap.ready(function() {
        		db.transaction(function(tx) {
        			tx.executeSql("SELECT * FROM eventMessage", [],
	        			onSuccess,
        				onError
    				);
            	});
            });
        },

        addEventMessage: function(eventMessage, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO eventMessage(eid, senderPhone, messageType, time, ,latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)",
	                	[eventMessage.eid, eventMessage.senderPhone, eventMessage.messageType, eventMessage.time, eventMessage.latitude, eventMessage.longitude],
	                    onSuccess, function (e) {
	                        console.log('新增活動訊息紀錄失敗，原因: ' + e.message);
	    	            	// console.log(JSON.stringify(friend));
	                        (onError || angular.noop)(e);
	                    }
	                );
	            });
        	});
        },

        // messages
        addMessage: function(message, onSuccess, onError) {
        	PhoneGap.ready(function() {
	            db.transaction(function(tx) {
	                tx.executeSql("INSERT INTO messages(msgId, senderPhone, receiverPhone, message, time, hasRead) VALUES (?, ?, ?, ?, ?, ?)",
	                	[message.msgId, message.senderPhone, message.receiverPhone, message.message.text, message.time, message.hasRead],
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

app.factory('EventMessageManager', function(DBManager) {
	console.log("流程 - EventMessageManager");
	var eventMessages = [];
	DBManager.getEventMessages(function(tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			eventMessages.push(res.rows.item(i));
		}
	});
	
	return {
		add: function(eventMessage, onSuccess, onError) {
			console.log("流程 - EventMessageManager add");
			console.log("eventMessage = " + JSON.stringify(eventMessage));
			DBManager.addEventMessage(eventMessage, function(){
				eventMessages.push(eventMessage);
				console.log("eventMessages =" + JSON.stringify(eventMessages));
                (onSuccess || angular.noop)();
			}, onError);
		},

		getEventMessagesByEid: function(eid) {
			console.log("流程 - EventMessageManager getEventMessagesByEid");
			var messages = [];
			var i;
			for(i=0;i<eventMessages.length;i++){
				console.log("eventMessages[i]=" + JSON.stringify(eventMessages[i]));
				if(eventMessages[i].eid == eid){
					console.log("2");
					messages.push(eventMessages[i]);
				}
			}
			return messages;
		}
	};
});

app.factory('EventContainMemberManager', function(DBManager) {
	console.log("流程 - EventContainMemberManager");
	var eventContainMembers = [];
	DBManager.getEventContainMembers(function(tx, res) {
		for (var i = 0, max = res.rows.length; i < max; i++) {
			eventContainMembers.push(res.rows.item(i));
		}
	});
	return {
		add: function(eventContainMember, onSuccess, onError) {
			console.log("流程 - EventContainMemberManager add");
			console.log("eventContainMember = " + JSON.stringify(eventContainMember));
			DBManager.addEventContainMember(eventContainMember, function(){
				eventContainMembers.push(eventContainMember);
				console.log("eventContainMembers =" + JSON.stringify(eventContainMembers));
                (onSuccess || angular.noop)();
			}, onError);
		},
		getMembersByEid: function(eid) {
			console.log("流程 - EventContainMemberManager getMembersByEid");
			var members = [];
			var i;
			for(i=0;i<eventContainMembers.length;i++){
				console.log("eventContainMembers[i]=" + JSON.stringify(eventContainMembers[i]));
				if(eventContainMembers[i].eid == eid){
					console.log("2");
					members.push(eventContainMembers[i]);
				}
			}
			return members;
		}
	};
});

app.factory('EventManager', function(DBManager, EventContainMemberManager, iLabEvent) {
	console.log("流程 - EventManager");
	var eventList = {};
	DBManager.getEvents(function(tx, res) {
		console.log("流程 - EventManager DBManager.getEvents");
		for (var i = 0, max = res.rows.length; i < max; i++) {
			eventList[res.rows.item(i).eid] = res.rows.item(i);
			console.log("event list add Event:" + JSON.stringify(res.rows.item(i)));
		}
	});
	return {
		list: function() {
			console.log("流程 - EventManager list");
			// console.log("in service: eventList=" + JSON.stringify(eventList));
			return eventList;
		},
		count: function() {
			console.log("流程 - EventManager count");
			return Object.keys(eventList).length;
		},
		addFromExistEid: function(event, onSuccess, onError) {
			console.log("流程 - EventManager addFromExistEid");
			console.log("event = " + JSON.stringify(event));
			
			DBManager.addEvent(event, function(){
				console.log("流程 - EventManager DBManager.addFromExistEid");
				eventList[event.eid] = event;
                (onSuccess || angular.noop)(event.eid);
                console.log("流程 - EventManager DBManager.addFromExistEid success");
			}, function(error){
				console.log("addFromExistEid error:" + JSON.stringify(error));
			});
			
		},
		add: function(event, onSuccess, onError) {
			console.log("流程 - EventManager add");
			iLabEvent.getNewEid(function(eid){
				event.eid = eid;
				console.log("event = " + JSON.stringify(event));
				DBManager.addEvent(event, function(){
					console.log("流程 - EventManager DBManager.addEvent");
					eventList[event.eid] = event;
	                (onSuccess || angular.noop)(eid);
	                console.log("流程 - EventManager DBManager.addEvent success");
				}, onError);
			});
		},
		getById: function(eid) {
			console.log("流程 - EventManager getById");
			return eventList[eid];
		},
		update: function(event, onSuccess, onError) {
			console.log("流程 - EventManager update");
			DBManager.updateEvent(event, function(){
				console.log("this is EventManger update");
				console.log("this is EventManger update and the event is: " + JSON.stringify(event));
				console.log("this is EventManger update and the event list is (before): " + JSON.stringify(eventList));
				console.log("this is EventManger update and the event in list is (before): " + JSON.stringify(eventList[event.eid]));
				eventList[event.eid] = event;
				console.log("this is EventManger update and the event in list is (after): " + JSON.stringify(eventList[event.eid]));
				console.log("this is EventManger update and the event list is: (after)" + JSON.stringify(eventList));
                (onSuccess || angular.noop)();
			}, onError);
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