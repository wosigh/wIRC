function StartupAssistant()
{
    // on first start, this message is displayed, along with the current version message from below
    this.firstMessage = $L("On First Start Message...");
	
    this.secondMessage = $L("On Every Update Message...");
	
    // on new version start
    this.newMessages =
	[
		{
			version: '0.0.0',
			log:
			[
				'Log Item 1',
				'Log Item 2',
				'Log Item 3'
			]
		}
	];
	
    // setup menu
    this.menuModel =
	{
	    visible: true,
	    items:
	    [
	     ]
	};
	
    // setup command menu
    this.cmdMenuModel =
	{
	    visible: false, 
	    items:
	    [
		    {},
		    {
				label: $L("Ok, I've read this. Let's continue ..."),
				command: 'do-continue'
		    },
		    {}
	     ]
	};
};

StartupAssistant.prototype.setup = function()
{
	// set theme
	this.controller.document.body.className = prefs.get().theme;
	
    // get elements
    this.titleContainer = this.controller.get('title');
    this.dataContainer =  this.controller.get('data');
	
    // set title
    if (vers.isFirst) 
	{
	    this.titleContainer.innerHTML = $L("Welcome To wIRC");
	}
    else if (vers.isNew) 
	{
	    this.titleContainer.innerHTML = $L("wIRC Changelog");
	}
	
	
    // build data
    var html = '';
    if (vers.isFirst)
	{
	    html += '<div class="text">' + this.firstMessage + '</div>';
	}
    if (vers.isNew)
	{
	    html += '<div class="text">' + this.secondMessage + '</div>';
	    for (var m = 0; m < this.newMessages.length; m++)
		{
		    html += Mojo.View.render({object: {title: 'v' + this.newMessages[m].version}, template: 'startup/changeLog'});
		    html += '<ul class="changelog">';
		    for (var l = 0; l < this.newMessages[m].log.length; l++)
			{
			    html += '<li>' + this.newMessages[m].log[l] + '</li>';
			}
		    html += '</ul>';
		}
	}
	
    // set data
    this.dataContainer.innerHTML = html;
	
	
    // setup menu
    this.controller.setupWidget(Mojo.Menu.appMenu, { omitDefaultItems: true }, this.menuModel);
	
    // set command menu
    this.controller.setupWidget(Mojo.Menu.commandMenu, { menuClass: 'no-fade' }, this.cmdMenuModel);
	
    // set this scene's default transition
    this.controller.setDefaultTransition(Mojo.Transition.zoomFade);
};

StartupAssistant.prototype.activate = function(event)
{
    // start continue button timer
    this.timer = this.controller.window.setTimeout(this.showContinue.bind(this), 5 * 1000);
};
StartupAssistant.prototype.showContinue = function()
{
    // show the command menu
    this.controller.setMenuVisible(Mojo.Menu.commandMenu, true);
};
StartupAssistant.prototype.handleCommand = function(event)
{
    if (event.type == Mojo.Event.command)
	{
	    switch (event.command)
		{
			case 'do-continue':
				if (prefs.get().realname.length==0 || prefs.get().nicknames.length==0)
					this.controller.stageController.swapScene({name: 'identity', transition: Mojo.Transition.crossFade}, true, true);
				else
					this.controller.stageController.swapScene({name: 'server-list', transition: Mojo.Transition.crossFade});
			
				break;			
		}
	}
};
