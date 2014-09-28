exports.property = function(name, value, transformer) {

	transformer = transformer || function(v, set) { set(v); };

	var listeners = [];

	return {

		name: name,
		
		get: function() {
			return value;
		},

		set: function(v) {
			transformer(v, function(actualValue) {
				value = actualValue;
				for (var i = 0, len = listeners.length; i < len; i += 2) {
					listeners[i].call(listeners[i+1], value);
				}
			});
		},

		connect: function(fn, ctx) {
			ctx = ctx || null;
			listeners.push(fn, ctx);
			fn.call(ctx, value);
			return remover(listeners, fn, ctx);
		}

	};

}

exports.signal = function(name) {

	var listeners = [];
    
	return {

		name: name,

		emit: function() {
			for (var i = 0, len = listeners.length; i < len; i += 2) {
				listeners[i].apply(listeners[i+1], arguments);
			}
		},

		connect: function(fn, ctx) {
			ctx = ctx || null;
			listeners.push(fn, ctx);
			return remover(listeners, fn, ctx);
		}

	}

}

//
// Helpers

function remover(lst, fn, ctx) {
	var removed = false;
	return function() {
		if (removed) return;
		removed = true;
		for (var i = lst.length - 2; i >= 0; i -= 2) {
			if (lst[i] === fn && lst[i+1] === ctx) {
				lst.splice(i, 2);
				return;
			}
		}
	}
}