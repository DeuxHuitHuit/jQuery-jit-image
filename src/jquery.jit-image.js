/*
 *  jQuery JIT image v1.0 - jQuery plugin
 *
 *  Copyright (c) 2013 Deux Huit Huit (http://www.deuxhuithuit.com/)
 *  Licensed under the MIT LICENSE
 *  (https://raw.github.com/DeuxHuitHuit/jQuery-jit-image/master/LICENSE.txt)
 */
(function ($, defaultSelector, dataAttribute, undefined) {
	
	"use strict";
	
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
		t.attr('width', size.width);
		t.attr('height', size.height);
		t.width(size.width).height(size.height);
		t.attr('src', url);
	},
	
	_getUrlFromFormat = function (t, o) {
		var 
		format = t.attr(o.dataAttribute),
		url = null;
		if (!!format) {
			
		}
		return url;
	},
	
	_update = function (t, o) {
		var 
		t = $(element),
		size = o.size(o),
		url = _getUrlFromFormat(t, o);
		o.set(t, size, url);
	},
	
	resize = function (e) {
		$.each(instances, function _resize(index, element) {
			var $el = $(element);
			_update($el, $el.data(DATA_KEY));
		});
	},
	
	_defaults = {
		dataAttribute: dataAttribute || 'data-src-format',
		defaultSelector: defaultSelector || 'img['+dataAttribute+']',
		size: _getSize,
		set: _set
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
		
		// save options
		t.data(DATA_KEY, o);
		
		// flatten our element array
		instances = instances.add(t);
		
		return t.each(_each);
	};
	
	// Use data attribute to automatically hook up nodes
	$(function init() {
		$(_defaults.defaultSelector).jitImage();
		win.resize(resize);
	});
	
})(jQuery, window.jitImageSelector, window.jitImageDataAttribute);