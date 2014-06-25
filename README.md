# jQuery JIT image

#### Version 1.3

### This is our response to "responsive images"

**Now downloads retina image ready by default**

This jQuery plug-in facilitates the use of jit (just in time) image manipulation on the server with medias queries.
By default, the plug-in uses the image's parent size for reference, but this can be customized via the `data-container` attribute.

Instances only need to be registered once and they will get updated the the window resizes, if needed.

It also has two ways of dealing with the resize: it can change the `src` attribute of all the elements
at once or can serialize the change, and hence, the download. By default, it uses the first method, 
but delays elements that are not visible (1 sec delay, `nonVisibleDelay` option). But if you set the `
`parallelLoadingLimit` to a value greater than one, the plug-in will make sure that not more than 
this much download are running in parallel. But beware when mixing different values of this parameter since the limit is checked in a *per element* manner.

## Usage

- With the default data attribute `data-src-format`:

````html
<div id="img-container">
	<img src="..." data-src-format="/jit/{$w}/{$h}/path/to/image.jpg" alt="" />
</div>
````

The plug-in with automatically call it self on the DOM node with the right data attribute.
The `container` option call also be set via the `data-container` attribute.

- Manually via script:

````javascript
// Default options
$('img.resize').jitImage();

// Custom data attribute
$('img[data-format]').jitImage({
	dataAttribute: 'data-format'
});
````

## Options

Possible options and their default values.

````javascript
{
	container: null, // the reference element for the size, jQuery, DOM or selector
	dataAttribute: 'data-src-format', // can also be function
	defaultSelector: 'img[data-src-format]',
	containerDataAttribute: 'data-container', // reference container, by default, the parent. Can also be function
	widthPattern: /\$w/i, // regexp to identify the width pattern
	heightPattern: /\$h/i, // regexp to identify the height pattern
	eventTimeout: 50, // the timer for event dispatching
	load: function (size) {}, // image loaded callback. Raises the 'loaded.jitImage' too.
	nonVisibleDelay: 1000,  // delay resizing of non-visible images
	forceCssResize: true, // change the css properties of the image as well
	parallelLoadingLimit: 0, // limit the number of concurrent requests (0 = disabled)
	format: null, // function (urlFormat, o, size)
	bypassDefaultFormat: false,
	updated: null, // function (urlFormat, o, size)
	forceEvenSize: false, // force size to use even numbers
	useDevicePixelRatio: true // uses dpr when formatting urls ("retina image")
}
````

Global default options are also available an can be set using global variables.
This allows modification of the values before the script is event loaded.

`window.jitImageSelector` default selector for the auto load image.

`window.jitImageDataAttribute` the data attribute to look for the image format.

You can also changes all default values on a global level after the script is loaded
with the `$.jitImage.defaults` object.

## License

MIT Licensed. See LICENSE.txt or <http://deuxhuithuit.mit-license.org>    
(c) [Deux Huit Huit](http://deuxhuithuit.com/?ref=github)
