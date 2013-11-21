# jQuery JIT image

#### Version 1.1

This jQuery plugin facilitates the use of jit image manipulation on the server with medias queries.
By default, the plugin uses the image parent size for reference.

## Usage

- With the default data attribute `data-src-format`:

````html
<div id="img-container">
	<img src="..." data-src-format="/jit/{w}/{h}/path/to/image.jpg" alt="" />
</div>
````

The plugin with automatically call it self on the DOM node with the right data attribute.
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
	container: null,
	dataAttribute: 'data-src-format',
	defaultSelector: 'img[data-src-format]',
	containerDataAttribute: 'data-container', // reference container, by default, the parent
	widthPattern: /\$w/gi,
	heightPattern: /\$h/gi,
	updateEvents: 'resize orientationchange',
	eventTimeout: 50,
	load: function (size) {}, // image loaded callback. Raises the 'loaded.jitImage' too.
	nonVisibleDelay: 1000  // delay resizing of non-visible images
}
````

Global default options are also available an can be setted usign global variables.
This allows modifiation of the values before the script is event loaded.

`window.jitImageSelector` default selector for the auto load image.

`window.jitImageDataAttribute` the data attribute to look for the image format.

## License

MIT Licensed. See LICENSE.txt or <http://deuxhuithuit.mit-license.org>
(c) [Deux Huit Huit](http://www.deuxhuithuit.com/?ref=github)