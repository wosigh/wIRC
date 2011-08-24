enyo.kind({
	name: 'wirc.Channel',
	kind: enyo.Control,
	
	setup: {},
	server: false,
	
	joined: false,
	display: false,
	
	messages: '',
	commands: '',
	
	unread: 0,
	mentions: 0,
	
	statics: {
	},
	
	constructor: function(setup, server) {
	    this.inherited(arguments);
		//this.log(setup);
		this.setup = setup;
		this.server = server;
		this.messages = [];
		this.commands = [];
	},
	
	getSetup: function() {
		return this.setup;
	},
	getNameSimple: function() {
		return this.setup.name.substr(1, this.setup.name.length);
	},
	
	newMessage: function(type, nick, text) {
		var m = new wirc.Message({
			type: type,
			nick: nick,
			text: text,
			self: (nick == this.server.setup.nicks[0]),
			num: this.messages.length,
			chan: null,
		});
		this.messages.unshift(m);
		enyo.application.e.dispatch('channel-message' + this.getNameSimple());
		
		if (type != 'status') {
			var mm = new wirc.Message({
				type: type,
				nick: nick,
				text: text,
				self: (nick == this.server.setup.nicks[0]),
				num: 0,
				chan: this.getNameSimple(),
			});
			enyo.application.e.dispatch('preview-message', mm);
		}
	},
	
	newCommand: function(command) {
		if (this.server.state = wirc.Server.stateConnected) { // || true) { // or true so we can test commands from chrome
			
			this.commands.push(command);
			
			var cmdRegExp = new RegExp(/^\/([^\s]*)[\s]*(.*)$/); // move this
			
			var m = cmdRegExp.exec(command);
			if (m) {
				//this.log(m);
				
				var cmd = m[1];
				var val = m[2];
				
				switch (cmd.toLowerCase()) {
					
					case 'me':
						this.me(val);
						break;
						
					case 'part':
						this.part(val);
						break;
						
					default:
						this.server.newCommand(command);
						break;
				}
			}
			else {
				this.msg(command);
			}
		}
		else {
			// not connected
			this.newMessage('status', false, 'Not Connected.');
			// trigger popup?
		}
	},
	
	me: function(message) {
		enyo.application.pm.call('cmd_me', this.server.setup.id, this.setup.name, message);
		this.newMessage('action', this.server.setup.nick, message);
	},
	
	msg: function(message) {
		var n = Math.ceil(message.length / 255);
		var msg = '';
		for (var i = 0; i < n; i++) {
			if (i < (n - 1)) {
				msg = message.substring(i * 255, (i + 1) * 255)
			}
			else {
				msg = message.substring(i * 255);
			}
			enyo.application.pm.call('cmd_msg', this.server.setup.id, this.setup.name, msg);
			this.newMessage('privmsg', this.server.setup.nicks[0], msg);
		}
	},
	
	join: function(join) {
		/* This would only need to be called if joining a previously parted
		channel that still shows up in the list. */ 
		//enyo.application.pm.call('cmd_join', this.server.setup.id, this.setup.name, this.setup.key||null);
		enyo.application.pm.call('cmd_channel_mode', this.server.setup.id, this.setup.name, null);
		this.joined = true;
		this.display = true;
		enyo.application.e.dispatch('main-crud'); // refresh main list
	},
	
	part: function(reason) {
		enyo.application.pm.call('cmd_part', this.server.setup.id, this.setup.name, reason||'woo');
		this.joined = false;
		this.display = false;
		enyo.application.e.dispatch('main-crud'); // refresh main list
	},
	
	completeNick: function(completionText, oldNick) {
		var nicks = [];
		var start = 0;
		for (i in this.setup.nicks) {
			var n = this.setup.nicks[i]
			if (n.nick.toLowerCase().indexOf(completionText.toLowerCase()) === 0) {
				nicks.push(n.nick)
				if (n.nick.toLowerCase() === oldNick)
					start = nicks.length
			}
		}
		if (nicks.length > 0) {
			if (start >= nicks.length)
				start = 0;
			return nicks[start]
		}
	},
	
	sortNicks: function() {
		this.setup.nicks.sort(enyo.bind(this, 'sortByMode'));
	},
	
	addNick: function(nick) {
		if (this.setup.nicks.indexOf(nick) === -1) {
			this.setup.nicks.push(nick);
			this.updateUserCount();
		}
	},

	removeNick: function(nick) {
		if (this.setup.nicks.indexOf(nick) !== -1) {
			this.setup.nicks = this.setup.nicks.without(nick);
			if (!nick.me)
				this.updateUserCount();
		}
	},
	
	containsNick: function(nick) {
		return (this.setup.nicks.indexOf(nick) !== -1);
	},
	
	updateUserCount: function() {
		enyo.application.e.dispatch('update-user-count' + this.getNameSimple());
	},
	
	getListNicks: function() {
		var returnArray = [];
		if (this.server.nicks.length > 0) {
			//this.warn(this.server.nicks.length, this.server.nicks);
			for (var n = 0; n < this.server.nicks.length; n++){
				//this.warn(this.server.nicks[n], this.server.nicks[n].channels);
				if (this.server.nicks[n].channels.indexOf(this) > -1)
					returnArray.push(this.server.nicks[n].getListObject(this));
			}
		}
		return returnArray;
	}
	
});
