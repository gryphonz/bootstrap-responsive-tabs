define(['jquery'], function($){
	return function ResponsiveTabs(collapseDisplayed, containerID){
	    "use strict";
	    this.currentPosition = 'tabs';
		var th = this; 
	    if (collapseDisplayed === undefined) {
	        collapseDisplayed = ['xs', 'sm'];
	    }
	    if(containerID === undefined){
	        containerID = "";
	    }
	    else{
	        containerID = "#"+containerID+' ';
	    }
	    this.cid = containerID;
	    var tabGroups = $(this.cid+'.nav-tabs.responsive'),
	        hidden    = '',
	        visible   = '';
	        
	    $.each(collapseDisplayed, function () {
	        hidden  += ' hidden-' + this;
	        visible += ' visible-' + this;
	    });
	
	    $.each(tabGroups, function () {
	        var $tabGroup   = $(this),
	            tabs        = $tabGroup.find('li a'),
	            collapseDiv = $("<div></div>", {
	                "class" : "panel-group responsive" + visible,
	                "id"    : 'collapse-' + $tabGroup.attr('id')
	            });
	
	        $.each(tabs, function () {
	            var $this          = $(this),
	                active         = '',
	                oldLinkClass   = $this.attr('class') === undefined ? '' : $this.attr('class'),
	                newLinkClass   = 'accordion-toggle',
	                oldParentClass = $this.parent().attr('class') === undefined ? '' : $this.parent().attr('class'),
	                newParentClass = 'panel panel-default';
	
	            if (oldLinkClass.length > 0) {
	                newLinkClass += ' ' + oldLinkClass;
	            };
	
	            if (oldParentClass.length > 0) {
	                oldParentClass = oldParentClass.replace(/\bactive\b/g, '');
	                newParentClass += ' ' + oldParentClass;
	                newParentClass = newParentClass.replace(/\s{2,}/g, ' ');
	                newParentClass = newParentClass.replace(/^\s+|\s+$/g, '');
	            };
	
	            if ($this.parent().hasClass('active')) {
	                active = ' in';
	            }
	
	            collapseDiv.append(
	                $('<div>').attr('class', newParentClass).html(
	                    $('<div>').attr('class', 'panel-heading').html(
	                        $('<h4>').attr('class', 'panel-title').html(
	                            $('<a>', {
	                                'class' : newLinkClass,
	                                'data-toggle': 'collapse',
	                                'data-parent' : '#collapse-' + $tabGroup.attr('id'),
	                                'href' : '#collapse-' + $this.attr('href').replace(/#/g, ''),
	                                'html': $this.html()
	                            })
	                        )
	                    )
	                ).append(
	                    $('<div>', {
	                        'id' : 'collapse-' + $this.attr('href').replace(/#/g, ''),
	                        'class' : 'panel-collapse collapse' + active
	                    }).html(
	                        $('<div>').attr('class', 'panel-body').html('')
	                    )
	                )
	            );
	        });
	
	        $tabGroup.next().after(collapseDiv);
	        $tabGroup.addClass(hidden);
	        $(th.cid+'.tab-content.responsive').addClass(hidden);
	    });
	       
		this.checkResize = function () {
		    if ($(".panel-group.responsive").is(":visible") === true && th.currentPosition === 'tabs') {
		        this.toggleResponsiveTabContent();
		        th.currentPosition = 'panel';
		    } 
		    else if ($(".panel-group.responsive").is(":visible") === false && th.currentPosition === 'panel') {
		        this.toggleResponsiveTabContent();
		        th.currentPosition = 'tabs';
		    }
		};
		
		this.toggleResponsiveTabContent = function () {
		    var tabGroups = $(th.cid+'.nav-tabs.responsive');
		    $.each(tabGroups, function () {
		        var tabs = $(this).find('li a');
		
		        $.each(tabs, function () {
		            var href         = $(this).attr('href').replace(/#/g, ''),
		                tabId        = "#" + href,
		                panelId      = "#collapse-" + href,
		                tabContent   = $(th.cid+tabId).html(),
		                panelContent = $(th.cid+panelId + " div:first-child").html();
		
		            $(th.cid+tabId).html(tabContent);	            
		            $(th.cid+panelId + " div:first-child").html(tabContent);
		        });
		    });
		};
		
		this.bindTabToCollapse = function () {
		    "use strict";
		    var tabs     = $(th.cid+'.nav-tabs.responsive').find('li a'),
		        collapse = $(th.cid+".panel-group.responsive").find('.panel-collapse');
		
		    tabs.on('shown.bs.tab', function (e) {
		        var $current  = $($(e.target)[0].hash.replace(/#/, '#collapse-'));
		        $current.collapse('show');
		
		        if(e.relatedTarget){
		            var $previous = $($(e.relatedTarget)[0].hash.replace(/#/, '#collapse-'));
		            $previous.collapse('hide');
		        }
		    });
		
		    collapse.on('show.bs.collapse', function (e) {
		        var current = $(e.target).context.id.replace(/collapse-/g, '#');
		
		        $('a[href="' + current + '"]').tab('show');
		    });
		}
		this.checkResize();
	    this.bindTabToCollapse();
	    $(window).resize(function () {
		    th.checkResize();
		});
	}
});
