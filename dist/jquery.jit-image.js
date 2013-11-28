/*! jQuery JIT image - v1.1.0 - 2013-11-28\n* https://github.com/DeuxHuitHuit/jQuery-jit-image
* Copyright (c) 2013 Deux Huit Huit Licensed MIT *//*
 *  jQuery JIT image v1.1 - jQuery plugin
 *
 *  Copyright (c) 2013 Deux Huit Huit (http://www.deuxhuithuit.com/)
 *  Licensed under the MIT LICENSE
 *  (https://raw.github.com/DeuxHuitHuit/jQuery-jit-image/master/LICENSE.txt)
 */
(function ($, defaultSelector, dataAttribute, undefined) {
	
	"use strict";
	
	// assure param values
	dataAttribute = dataAttribute || 'data-src-format';
	defaultSelector = defaultSelector || 'img['+dataAttribute+']';
	$.fn.on = $.fn.on || $.fn.bind;
	
	var
	
	win = $(window),
	
	instances = $(),
	
	DATA_KEY = 'jitImageOptions',
	
	_getSize = function (o) {
		return {
			width: o.container.width(),
			height: o.container.height()
		};
	},
	
	_set = function (t, size, url, forceCssResize, callback) {
		if (!!t && !!size) {
			if (!!forceCssResize && !!size.width) {
				t.attr('width', size.width).width(size.width);
			} else {
				t.removeAttr('width').width('');
			}
			
			if (!!forceCssResize && !!size.height) {
				t.attr('height', size.height).height(size.height);
			} else {
				t.removeAttr('height').height('');
			}
			
			if (!!url && t.attr('src') !== url) {
				// register for load
				t.one('load', function () {
					if ($.isFunction(callback)) {
						callback.call(this, size);
					}
					t.trigger('loaded.jitImage', [size]);
				});
				// load it
				t.attr('src', url);
			}
		}
	},
	
	_getUrlFromFormat = function (t, o, size) {
		var 
		format = t.attr(o.dataAttribute),
		urlFormat = {
			url: format,
			height: false,
			width: false
		};
		if (!!format) {
			urlFormat.width = o.widthPattern.test(format);
			urlFormat.height = o.heightPattern.test(format);
			urlFormat.url = format
					.replace(o.widthPattern, ~~size.width)
					.replace(o.heightPattern, ~~size.height);
		}
		return urlFormat;
	},
	
	_update = function (t, o) {
		if (!!o && !!t) {
			var 
			size = o.size(o),
			urlFormat = _getUrlFromFormat(t, o, size);
			if (!!urlFormat && !!size && (size.height > 0 || size.width > 0)) {
				// fix for aspect ratio scaling
				size.width = urlFormat.width ? size.width : false;
				size.height = urlFormat.height ? size.height : false;
				o.set(t, size, urlFormat.url, o.forceCssResize, o.load);
			}
		}
	},
	
	_updateAll = function () {
		$.each(instances, function _resize(index, element) {
			var $el = $(element);
			var data = $el.data(DATA_KEY);
			var update = function () {
				_update($el, $el.data(DATA_KEY));
			};
			
			if (!data) {
				return;
			}
			
			// cancel any pending timeouts
			clearTimeout(data.jitTimeout);
			
			if (!!_defaults.nonVisibleDelay && !$el.is(':visible')) {
				data.jitTimeout = setTimeout(update, _defaults.nonVisibleDelay);
			} else {
				update();
			}
		});
		// re-register event
		setTimeout(_registerOnce, _defaults.eventTimeout);
	},
	
	eventTimer = null,
	
	updateOnEvent = function (e) {
		clearTimeout(eventTimer);
		eventTimer = setTimeout(_updateAll, _defaults.eventTimeout);
	},
	
	_defaults = {
		container: null,
		dataAttribute: dataAttribute,
		defaultSelector: defaultSelector,
		containerDataAttribute: 'data-container',
		size: _getSize,
		set: _set,
		widthPattern: /\$w/gi,
		heightPattern: /\$h/gi,
		updateEvents: 'resize orientationchange',
		eventTimeout: 50,
		load: $.noop,
		nonVisibleDelay: 1000,
		forceCssResize: true
	},
	
	_registerOnce = function () {
		win.one(_defaults.updateEvents, updateOnEvent);
	};
	
	$.jitImage = {
		remove: function (t) {
			instances = instances.not(t);
		},
		defaults: _defaults,
		_getSize: _getSize,
		_set: _set,
		_getUrlFromFormat: _getUrlFromFormat
	};
	
	$.fn.jitImage = function (options) {
		var
		
		t = $(this),
		
		_each = function (index, element) {
			var 
			o = $.extend({}, _defaults, options),
			t = $(element),
			container = t.attr(o.containerDataAttribute);
			// assure container
			// do it here since elements may have
			// different parents
			o.container = !!o.container ? 
							$(o.container) : 
							!!container ? t.closest(container) : (!t.parent().length ? t : t.parent()) ;
			// save options
			t.data(DATA_KEY, o);
			
			// update attributes
			_update(t, o);
		};
		
		// flatten our element array
		instances = instances.add(t);
		
		// hook up each element
		return t.each(_each);
	};
	
	// Use data attribute to automatically hook up nodes
	win.load(function init() {
		$(_defaults.defaultSelector).jitImage();
		_registerOnce();
	});
	
})(jQuery, window.jitImageSelector, window.jitImageDataAttribute);