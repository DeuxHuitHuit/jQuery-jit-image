/*
 *  jQuery JIT image v1.0 - jQuery plugin
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
	
	_set = function (t, size, url) {
		if (!!size.width) {
			t.attr('width', size.width).width(size.width);
		} else {
			t.removeAttr('width').width('');
		}
		
		if (!!size.height) {
			t.attr('height', size.height).height(size.height);
		} else {
			t.removeAttr('height').height('');
		}
		if (!!url) {
			t.attr('src', url);
		}
	},
	
	_getUrlFromFormat = function (t, o, size) {
		var 
		format = t.attr(o.dataAttribute),
		url = null;
		if (!!format) {
			url = format
					.replace(o.widthPattern, size.width)
					.replace(o.heightPattern, size.height);
		}
		return url;
	},
	
	_update = function (t, o) {
		var 
		size = o.size(o),
		url = _getUrlFromFormat(t, o, size);
		if (!!url) {
			o.set(t, size, url);
		}
	},
	
	resize = function (e) {
		$.each(instances, function _resize(index, element) {
			var $el = $(element);
			_update($el, $el.data(DATA_KEY));
		});
	},
	
	_defaults = {
		container: null,
		dataAttribute: dataAttribute,
		defaultSelector: defaultSelector,
		size: _getSize,
		set: _set,
		widthPattern: /\$w/gi,
		heightPattern: /\$h/gi,
		updateEvents: 'resize'
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
		
		o = $.extend({}, _defaults, options),
		
		t = $(this),
		
		_each = function (index, element) {
			return _update($(element), o);
		};
		
		// assure container
		o.container = !!o.container ? $(o.container) : t.parent();
		
		// save options
		t.data(DATA_KEY, o);
		
		// flatten our element array
		instances = instances.add(t);
		
		return t.each(_each);
	};
	
	// Use data attribute to automatically hook up nodes
	$(function init() {
		$(_defaults.defaultSelector).jitImage();
		win.on(_defaults.updateEvents, resize);
	});
	
})(jQuery, window.jitImageSelector, window.jitImageDataAttribute);