## Clazzy

A cross platform JavaScript library that provides a classical interface, using a DSL inspired by Ruby, to a prototype system.


## Usage

### Creating a class

``` js
var Foo = Clazzy.create(
{
	initialize : function ()
	{
		// Constructor
	},

	// --------------------------------

	baz : function ()
	{
		// Instance method
	},

	qux : function ()
	{
		// Another instance method
	},
	
	// --------------------------------

	static : 
	{
		corge : function ()
		{
			// Static method
		}
	}
});

var foo = new Foo();
```

*Note: All instance properties of your class should be defined within the constructor, anything in the definition treated as an instance member is applied to the class prototype, meaning it will be shared by all instances of the class.


### Creating a class that extends another class

``` js
var Bar = Clazzy.create(
{
	extend : Foo,

	// --------------------------------

	initialize : function ()
	{
		this.super();
	},

	// --------------------------------

	baz : function ()
	{
		return 'bar';
	},

	qux : function ()
	{
		return 'super ' + this.super();
	}
});

var bar = new Bar();
```

### Creating a class that includes another class

Clazzy provides a method of code reuse called includes. Behaving similarly to Ruby's mixins and PHP's traits, they enable a developer to reuse sets of methods freely in several independent classes living in different class hierarchies.

``` js
var Baz = Clazzy.Create(
{
	include : [Foo]
});

var baz = new Baz();
```

Some things to take note with includes:

* If an include has a constructor, that constructor will be executed when the including class is being instantiated.
* The super method will not refer to the base of the class it's included in, it will refer to the hierarchy the include class may have.
* The precedence order is: an inherited member from a base class is overriden by an included member and an included member is overriden by a member from the current class.


## Getting started

### Node

Clazzy is available through the Node package manager(npm), so you install like so:

``` sh
npm install clazzy
```

and bring into your code like so:

``` js
var Clazz = require('clazz');
```

### Browser

To use Clazz.js in a browser envrionment it's as bringing it in using a script tag like so:

``` html
<script type="text/javascript" src="path/to/Clazz.js"></script>
```

To remove from the global namespace, you can use Clazz.noConflict(), like so:

``` js
Namespace.Clazz = Clazz.noConflict();
```

## Development

Grunt is used to handle the build process for Clazz.js. To perform a full build, use the `build` task:

``` sh
grunt build
```

which is just an alias for the `default` task:

``` sh
grunt
```

To only check code quality and/or run unit tests use the `test` task:

``` sh
grunt test
```

## License

Clazz.js is released under the MIT License