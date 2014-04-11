//   _____ _                     
//  / ____| |                    
// | |    | | __ _ _________   _ 
// | |    | |/ _` |_  /_  / | | |
// | |____| | (_| |/ / / /| |_| |
//  \_____|_|\__,_/___/___|\__, |
//                          __/ |
// ======================= |___/    
//               By Luke Phillips

(function (name, factory, context)
{
    if (typeof module !== 'undefined' && module.exports)
    {
        module.exports = factory.call(context);
    }
    else if (typeof define === 'function' && define.amd)
    {
        define(name, [], factory);
    }
    else
    {
        context[name] = factory.call(context);
    }
    
}) ('Clazzy', function ()
{
    'use strict';
    
    // We need to pass array-like objects, such as the arguments 
    // object, to Function.apply, however not all implementations yet 
    // allow array-like objects to be passed to it. So we need to 
    // convert them to an array, this can be done using Array.slice.
    // 
    // A further problem, is you can't slice array-like objects 
    // directly, like so:
    // 
    //    arguments.slice(0);
    // 
    // As they aren't arrays, however the method will still work if 
    // applied like this:
    // 
    //    Array.prototype.slice.call(arguments, 0);
    var slice = Array.prototype.slice;

    // The Object.hasOwnProperty method is not protected, which
    // allows an object to override it, making using the method
    // like this:
    // 
    //    object.hasOwnProperty('property');
    //    
    // Very unreliable, so we need to do this instead:
    // 
    //    Object.prototype.hasOwnProperty(object, 'property');
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // Keywords
    // --------------------------------------------------------------
    
    var SUPER       = 'super';
    var INITIALIZE  = 'initialize';
    var EXTEND      = 'extend';
    var STATIC      = 'static';
    var INCLUDE     = 'include';
    var FUNCTION    = 'function';
    var CONSTRUCTOR = 'constructor';
	
    // Helpers
	// --------------------------------------------------------------
	
    var createAnUnconstructedInstanceOfClass = (function ()
    {
        if (Object.create === undefined)
        {
            return function (clazz)
            {
				function Surrogate ()
				{
					// A surrogate function that does nothing. It
					// will allow us to create an object of a
					// prototype without running it's constructor.
				}
				
                Surrogate.prototype             = clazz.prototype;
                Surrogate.prototype.constructor = clazz;
                
                
                return new Surrogate();
            };
        }
        
        
        return function (clazz)
        {
            return Object.create(clazz.prototype);
        };

    }) ();

    var copyProperty = (function ()
    {
        // IE8 implements Object.defineProperty, however it only
        // works on DOM elements. So IE8 must also use a fall-back
        // method, requiring us to check for the implementation of
        // Object.defineProperties instead.
        if (Object.defineProperties === undefined)
        {
            return function (source, target, property)
            {
                target[property] = source[property];
            };
        }
        
        
        return function (source, target, property, deep)
        {
			var descriptor = getPropertyDescriptor(source, property, deep);
			
			
			if (descriptor !== undefined)
			{
				// Normally this would suffice: 
				// 
				//   target[signature] = methods[signature];
				// 
				// However for ECMA5 getters, this wouldn't work, as it
				// would be invoked, hence assigning the value being 
				// returned by the getter, rather than it's definition.
				Object.defineProperty(target, property, descriptor);
			}
        };
		
    }) ();

    var copyProperties = function (source, target, deep)
    {
    	for (var property in source)
    	{
    		if ( deep || hasOwnProperty.call(source, property) )
    		{
    			copyProperty(source, target, property, deep);
    		}
    	}
    };
	
	var getPropertyDescriptor = function (object, property, deep)
	{
		var descriptor = Object.getOwnPropertyDescriptor(object, property);
		
		
		if (descriptor !== undefined)
		{
			return descriptor;
		}
		
		
		if (deep)
		{
			var prototype = object;
			

			do
			{
				prototype = Object.getPrototypeOf(prototype);
				
				// Climb down the next kink of the prototype chain and
				// attempt to retrieve the property descriptor from
				// that kink.
				descriptor = Object.getOwnPropertyDescriptor(prototype, property);
			}
			while (prototype !== undefined && descriptor === undefined);
		}
		
		return descriptor;
	};
	
    // --------------------------------------------------------------
    
    var error = function ()
    {
    	throw new Error('Error calling super, this method does not override a parent method');
    };

    var wrap = function (method, signature, base)
    {
    	return function ()
    	{
    		var tmp = this[SUPER];
			
			
    		this[SUPER] = base.prototype[signature] || error;
			
			
    		var result;
			
    		try // To execute the method.
    		{
        		result = method.apply(
        			this, slice.call(arguments)
        		);
      		}
      		finally
      		{
      			this[SUPER] = tmp;
      		}
			
      		return result;
    	};
    };
	
    // --------------------------------------------------------------
	
	var Clazzy = 
	{
		create : function (definition)
		{
			if (definition === undefined)
			{
				definition = {};
			}
			
			
			// Constructor
			// --------------------------------------------
			
			var initialize;
			
			function Class ()
			{
				if (includes !== undefined)
				{
					for (var i = 0, l = includes.length; i < l; ++i)
					{
						includes[i].call(this);
					}
				}
				
				
				if (initialize !== undefined)
				{
					initialize.apply(
						this, slice.call(arguments)
					);
				}
			}
			
			
			// Extend
			// --------------------------------------------
			
			var base = definition[EXTEND];
			
			if (base === undefined)
			{
				base = Object;
			}
			else
			{
				Class.prototype = createAnUnconstructedInstanceOfClass(base);
				
				// Default the class initializer to the base class
				// constructor.
				initialize = base.prototype.constructor;
			}
			
			
			// Include
			// --------------------------------------------
			
			var includes = definition[INCLUDE];
			
			if (includes !== undefined)
			{
				for (var i = 0, l = includes.length; i < l; ++i)
				{
					var include = createAnUnconstructedInstanceOfClass(
						includes[i]
					);
					
					
					copyProperties(include, Class.prototype, true);
				}
			}
			
			
			// Methods
			// --------------------------------------------
			
			for (var property in definition)
			{
				if ( hasOwnProperty.call(definition, property) )
				{
					var member = definition[property];
					
					
					switch (property)
					{
						case INITIALIZE :
							
							initialize = wrap(member, CONSTRUCTOR, base);
							
						break;
						
						case EXTEND  :
						case INCLUDE : 
							
							// We have already dealt with these
							// properties.
							
						break;
						
						case STATIC :
							
							copyProperties(member, Class, false);
							
						break;

						case SUPER :

							throw new Error('Cannot create class, "super" is a reserved method name');
						
						default :
							
							if (typeof member === FUNCTION)
							{
								// Always wrap the method. Even if a
								// parent method doesn't exist at the
								// moment, as a method could later be
								// injected into the prototye.
								Class.prototype[property] = wrap(member, property, base);
							}
							else
							{
								copyProperty(definition, Class.prototype, property);
							}
					}
				}
			}
			
			Class.prototype.constructor = Class;
			

			return Class;
		},

		// ----------------------------------------------------------
		
		noConflict : (function (context)
		{
			var _Clazzy = context.Clazzy;
			
			
			return function ()
			{
				context.Clazzy = _Clazzy;
				
				
				return this;
			};

		}) (this)
	};
	
	// --------------------------------------------------------------
	
    return Clazzy;
	
}, this);