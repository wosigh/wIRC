function AboutAssistant(id)
{
	this.guiVersionElement 		= false;
	this.serviceVersionElement 	= false;
	this.homepageElement	 	= false;
}

AboutAssistant.prototype.setup = function()
{
	this.serviceVersionElement	= this.controller.get('serviceVersion');
	this.guiVersionElement 		= this.controller.get('guiVersion');
	//this.webPageElement			= this.controller.get('webPage');
	
	//this.webPageElement.update(Mojo.Format.runTextIndexer('http://www.webos-internals.org/wiki/Application:WIRC'));
	this.guiVersionElement.update(Mojo.Controller.appInfo.version);
	
	this.serviceVersionElement.update(plugin.get_version());
}

AboutAssistant.prototype.activate = function(event)
{
}

AboutAssistant.prototype.cleanup = function(event)
{
}
