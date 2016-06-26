# Clazzy

[![Available from NPM](https://img.shields.io/npm/v/clazzy.svg?maxAge=900)](https://www.npmjs.com/package/clazzy)
[![Built using Travis](https://img.shields.io/travis/lsphillips/Clazzy/master.svg?maxAge=900)](https://travis-ci.org/lsphillips/Clazzy)

A cross platform JavaScript library that provides a classical interface to prototypal inheritance.

**This project is now deprecated in favor of the ECMAScript 6 class syntax, this project will no longer be maintained.**

## Usage

Clazzy has a single method with this signature:

```
Function Clazzy.create(Object definition)
```

It returns a constructor function, with a prototype populated using the provided definition, that you can instantiate using the `new` keyword.

### Creating a class

``` js
var Foo = Clazzy.create(
{
	initialize : function ()
	{
		this.foo = 'foo';
	},

	bar : function ()
	{
		return 'bar';
	},

	baz : function (baz)
	{
		return baz;
	},

	static :
	{
		qux : function ()
		{
			return 'qux';
		}
	}
});
```

**Note:** Instance properties can be defined in the definition, however their initial value should be set in the constructor.

### Creating a class that extends another class

``` js
var Bar = Clazzy.create(
{
	extend : Foo,

	initialize : function ()
	{
		this.super();

		this.corge = 'corge';
	},

	baz : function ()
	{
		return 'bar';
	},

	baz : function (baz)
	{
		return 'super ' + this.super(baz);
	}
});
```

**Note:**

* Static methods are not inherited.
* If a method overrides one of its base class methods, you can invoke the overridden method through the use of the `super` method.

### Creating a class that includes another class

Clazzy provides a method of code reuse called includes. Behaving similarly to Ruby's mixins and PHP's traits, they enable a developer to reuse sets of methods freely in several independent classes defined in different class hierarchies.

``` js
var Baz = Clazzy.create(
{
	include : [Foo],

	moo : function ()
	{
		return 'moo';
	}
});
```

**Note:**

* Static methods are not included.
* The super method, when invoked from an included method, does not reference the hierarchy of the class it's included in.
* The precedence order is that an inherited member from a base class is overridden by an included member, which in turn are both overridden by a member from the current class.

## Getting started

Clazzy is available through the Node Package Manager (NPM), so you can install it like so:

``` sh
npm install clazzy
```

## Development

Grunt is used to handle the build process for this project. To perform a full build, use the `build` task:

``` sh
grunt build
```

To only run tests use the `test` task:

``` sh
grunt test
```

This also runs code quality checks using JSHint. Please refer to the `.jshintrc` file to familiar yourself with the rules.

## License

This project is released under the MIT License.
