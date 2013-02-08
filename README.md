# jQuery JIT image

#### Version 1.0

This jQuery plugin facilitates the use of jit image manipulation on the server and medias queries.

## Usage:

- With the default data attribute `data-src-format`:

````html
<div id="img-container">
	<img src="..." data-src-format="/jit/{w}/{h}/path/to/image.jpg" alt="" />
</div>
````

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
	size: function () { return size of parent },
	set: function () { set attributes },
	widthPattern: /\{w\}/gi,
	heightPattern: /\{h\}/gi,
	updateEvents: 'resize'
}
````

## License

MIT Licensed. See LICENSE.txt    
(c) [Deux Huit Huit](http://www.deuxhuithuit.com/?ref=github)