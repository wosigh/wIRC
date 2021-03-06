enyo.kind({
	name: 'wirc.Manager',
	kind: enyo.Control,
	
	controller: false,
	
	setController: function(c) {
		this.controller = c;
	},
	
	createPanel: function() {
		if (this.controller)
			return this.controller.createPanel.apply(this.controller, arguments);
	},
	destroyPanel: function() {
		if (this.controller)
			return this.controller.destroySecondary.apply(this.controller, arguments);
	},
	
	previewHeight: function() {
		if (this.controller.$.preview.showing && this.controller.$.preview.hasNode())
			return parseInt(this.controller.$.preview.height);
		else
			return 0;
	}
	
});

enyo.application.m = new wirc.Manager();
