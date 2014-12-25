module.exports = (function ()
{
	'use strict';
	
	// Subject
	// --------------------------------------------------------------
	
	var Clazzy = require('../src/Clazzy');
	
	// Tests
	// --------------------------------------------------------------
	
	var Tests =
	{
		'test creating a class with no definition' : function (test)
		{
			// Act
			var Foo = Clazzy.create(
			{
			});
			
			var foo = new Foo();
			
			// Assert
			test.equal(typeof Foo, 'function', 'a class is returned, which is a just a constructor function');
			
			test.strictEqual(Foo.prototype.constructor, Foo, 'each instance of a class has a constructor property referencing said class');
			
			test.ok(foo instanceof Foo, 'the `instanceof` operator asserts an instance of the class is an instance of said class');

			// Done
			test.done();
		},

		'test creating a class with a constructor using the `initialize` definition' : function (test)
		{
			// Act
			var Foo = Clazzy.create(
			{
				initialize : function (foo)
				{
					this.bar = 'foo';
					this.baz = foo;
				}
			});
			
			var foo = new Foo('foo');

			// Assert
			test.equal(foo.bar, 'foo', 'the constructor is executed when the class is instantiated using the `new` operator');

			test.equal(foo.baz, 'foo', 'arguments passed to the class at instantiation are passed on to the constructor');

			test.equal(typeof Foo.prototype.initialize, 'undefined', 'the constructor is not available as an instance member');

			// Done
			test.done();
		},

		'test creating a class with instance members' : function (test)
		{
			// Act
			var Foo = Clazzy.create(
			{
				bar : function ()
				{
				}
			});

			// Assert
			test.equal(typeof Foo.prototype.bar, 'function', 'any definition properties which are not: `extend`, `include`, `static`, `initialize` or `super` are treated as instance members');

			// Done
			test.done();
		},

		'test creating a class with class members using the `static` definition' : function (test)
		{
			// Act
			var Foo = Clazzy.create(
			{
				static :
				{
					bar : function ()
					{
					}
				}
			});
			
			var foo = new Foo();

			// Assert
			test.equal(typeof Foo.bar, 'function', 'static members are accessible directly through the class');

			test.equal(typeof foo.bar, 'undefined', 'static members are not accessible through an instance of the class');

			// Done
			test.done();
		},

		'test creating a class that extends a class using the `extend` definition' : function (test)
		{
			// Act
			var Foo = Clazzy.create(
			{
				initialize : function ()
				{
					this.foo = 'foo';
				},

				bar : function ()
				{
					return 'foo';
				},

				baz : function ()
				{
					return 'foo';
				},

				static :
				{
					qux : function ()
					{
						return 'foo';
					}
				}
			});

			var Bar = Clazzy.create(
			{
				extend : Foo,

				baz : function ()
				{
					return 'bar';
				}
			});
			
			var bar = new Bar();

			// Assert
			test.ok(bar instanceof Bar, 'the `instanceof` operator still asserts an instance of the class is an instance of said class');

			test.ok(bar instanceof Foo, 'the `instanceof` operator will also assert an instance of the class is an instance of the base of said class');
			
			test.equal(typeof Bar.prototype.bar, 'function', 'instance members from the base class are inherited by the extending class');
			
			test.equal(typeof Bar.qux, 'undefined', 'static members from the base class are not to be inherited by the extending class');

			test.equal(bar.baz(), 'bar', 'instance members from the extending class override instance members from the base class');

			test.equal(bar.foo, 'foo', 'if the extending class has not defined a constructor, the base constructor is executed called instead when instantiated using the `new` operator');

			// Done
			test.done();
		},

		'test creating a class that includes a class using the `include` definition' : function (test)
		{
			// Act
			var Foo = Clazzy.create(
			{
				initialize : function ()
				{
					this.foo = 'foo';
				},

				bar : function ()
				{
					return 'foo';
				},

				static :
				{
					baz : function ()
					{
						return 'foo';
					}
				}
			});

			var Bar = Clazzy.create(
			{
				include : [Foo]
			});

			var Baz = Clazzy.create(
			{
				bar : function ()
				{
					return 'baz';
				}
			});

			var Qux = Clazzy.create(
			{
				include : [Foo, Baz]
			});

			var bar = new Bar();
			var qux = new Qux();
			
			// Assert
			test.ok(!(bar instanceof Foo), 'the included class does not become a part of the inheritance hierarchy of the including class');

			test.equal(typeof Bar.prototype.bar, 'function', 'the included class instance members become instance members of the indluding class');

			test.equal(typeof Bar.baz, 'undefined', 'static members from the included class do not become instance members of the including class');

			test.equal(bar.foo, 'foo', 'the constructor of the included class is executed when the including class is instantiated using the `new` operator');

			test.equal(qux.bar(), 'baz', 'class includes are included in a FIFO (first in, first out) fashion');

			// Done
			test.done();
		},

		'test the super method' : function (test)
		{
			// Act
			var Foo = Clazzy.create(
			{
				bar : function ()
				{
					return this.super();
				}
			});

			var Bar = Clazzy.create(
			{
				initialize : function ()
				{
					this.foo = 'bar';
				},

				bar : function ()
				{
					return 'bar';
				},

				baz : function ()
				{
					return 'bar';
				},

				qux : function (qux)
				{
					return qux;
				}
			});

			var Baz = Clazzy.create(
			{
				extend : Bar, include : [Foo],

				initialize : function ()
				{
					this.super();
				},

				baz : function ()
				{
					return 'super ' + this.super();
				},

				qux : function (qux)
				{
					return this.super(qux);
				},

				corge : function ()
				{
					return this.super();
				}
			});

			var baz = new Baz();

			// Assert
			test.equal(baz.baz(), 'super bar', 'the super method can be used to call the base method of the method it is called in');

			test.equal(baz.foo, 'bar', 'the super method calls the base constructor when called inside a constructor');

			test.equal(baz.qux('baz'), 'baz', 'arguments passed to the super method are passed on to the base method');

			test.throws(function ()
			{
				Clazzy.Create(
				{
					super : function ()
					{
					}
				});

			}, Error, 'an error is thrown when the super method is used as an instance method name, as it is reserved');

			test.throws(function ()
			{
				baz.bar();

			}, Error, 'included methods cannot access base methods of the indluding class using the super method, as includes do not have knowledge of where it is being included');

			test.throws(function ()
			{
				baz.corge();

			}, Error, 'an error is thrown when the super method is called within a method that does not have a base method');

			test.equal(typeof Baz.prototype.super, 'undefined', 'the super method is not available as an instance method outside of method calls');

			// Done
			test.done();
		},

		'test order of precedence for inherited, included and current methods' : function (test)
		{
			// Act
			var Foo = Clazzy.create(
			{
				foo : function ()
				{
					return 'foo';
				}
			});

			var Bar = Clazzy.create(
			{
				foo : function ()
				{
					return 'bar';
				}
			});

			var Baz = Clazzy.create(
			{
				include : [Foo], extend : Bar
			});

			var Qux = Clazzy.create(
			{
				include : Foo,
				
				foo : function ()
				{
					return 'qux';
				}
			});

			var baz = new Baz();
			var qux = new Qux();

			// Assert
			test.equal(baz.foo(), 'foo', 'an inherited member from a base class is overriden by an included member');

			test.equal(qux.foo(), 'qux', 'an included member is overriden by a member from the current class');

			// Done
			test.done();
		}
	};

	// --------------------------------------------------------------
	
	return Tests;

}) ();