module.exports = numeronym

var numbers = [
  'zero', 'one', 'two', 'three', 
  'four', 'five', 'six', 
  'seven', 'eight', 'nine', 
  'ten', 'eleven', 'twelve',
  'thirteen'
];

var letters = {
	  a : ['a']
	, b : ['b']
	, c : ['c', 'se', 'see']
	, d : ['d', 'ee', 'eee']
	, e : ['e', 'e', 'dee']
	, f : ['f', 'ef']
	, g : ['g', 'ge', 'gee']
	, h : ['h', 'ach', 'ache']
	, i : ['i', 'ey', 'eye']
	, j : ['j', 'ja', 'jai', 'jay']
	, k : ['k', 'ka', 'kay', 'ca', 'cay']
	, l : ['l', 'el']
	, m : ['m', 'em']
	, n : ['n', 'en']
	, o : ['o', 'oh']
	, p : ['p', 'pe']
	, q : ['q', 'qu', 'queq', 'queue', 'cu', 'cue']
	, r : ['r', 'ar', 'are']
	, s : ['s', 'es', 'ess']
	, t : ['t', 'tee', 'tea']
	, u : ['u', 'yu', 'you']
	, v : ['v', 'vea']
	, w : ['w']
	, x : ['x', 'ex']
	, y : ['y', 'why']
	, z : ['z', 'zee']
};

var conjunctions = [
  'and', 'or', 'so', 'but', 'yet', 'until', 'before', 'after'
];


var prepositions = [
  'about', 'above', 'across', 'after', 'against', 'along', 
  'among', 'around', 'at', 'before', 'behind', 'below', 
  'beneath', 'beside', 'between', 'beyond', 'but', 'by', 
  'despite', 'down', 'during', 'except', 'for', 'from', 
  'in', 'inside', 'into', 'like', 'near', 'of', 'off', 
  'on', 'onto', 'out', 'outside', 'over', 'past', 'since', 
  'through', 'throughout', 'till', 'to', 'toward', 'under', 
  'underneath', 'until', 'up', 'upon', 'with', 'within', 'without'
];

var words = {
	100 : ['hundred'],
	1000 : ['thousand'],
	1000000 : ['million'],
	1000000000 : ['billion'],
	1000000000000 : ['trillion'],

	'b' : ['byte', 'bite'],
	'kb' : ['kilobyte', 'kilobite'],
	'mb' : ['megabyte', 'megabite'],
	'gb' : ['gigabyte', 'gigabite'],
	'tb' : ['terabyte', 'terabite'],

	'k'  : ['thousand', 1000],
	'MM'  : ['million', 1000000]
};


function backwards (array, handle) {
	for (var i = array.length - 1; i >= 0; i--) {
		handle(array[i], i, array);
	}
}


// in memory numeronym table
var table = {};

// in memory reverse lookup
var lookup = {}


/**
  * @public
  * @function numeronym
  * @param {String} word
  * @param {String|Object} alias
  */
function numeronym (word, alias) {
	var parts
	// ensure string
	if (typeof word !== 'string')
		throw new TypeError("expecting string");

	// options object may be in the alias argument
	var options = (typeof alias === 'object') ? alias : {}
	// maybe they know whats best and they
	// can set their own value, save us from working
	if (typeof alias === 'string') {
		table[word] = alias;
		return true;
	}

	// it may already exist
	if (!alias && table[word])
		return table[word];

	var original = word

	// everything done in lowercase unless other wise stated
	if (!options.preserve)
		word = word.toLowerCase();

	// fix white space
  word = word.replace(/\s+/g, ' ');

  // drop apostrophe s "'s"
  word = word.replace(/'s/gi,'');

	//drop all not letter or numeric character or whitespace
	word = word.replace(/[^a-zA-Z0-9\/-\s]+/g,'');

	// drop prepositions
	prepositions.map(function (preposition) {
		var regex = new RegExp('\\s+'+ preposition +'\\s+', 'g')
  	word = word.replace(regex, ' ');
  });

	// drop	conjunctions
  conjunctions.map(function (conjunction) {
		var regex = new RegExp('\\s+'+ conjunction +'\\s+', 'g')
  	word = word.replace(regex, ' ');
  });

	// iterate over each
  numbers.map(function (number, i) {
    if (!!~word.indexOf(String(number))) {
    	word = word.replace(new RegExp(number, 'g'), i);
    }
  });

  Object.keys(letters).map(function (letter) {
  	var charset = letters[letter]
  	  , matched = false
  	if (charset.length > 1) {
  		charset.shift();
  		charset.map(function (set) {
  			if (!!~word.indexOf(set) && set !== letter) {
  				word = word.replace(new RegExp(set, 'g'), letter)
  			}
  		});
  	}
  });

  if (options.regex) parts = word.split(options.regex)
  else parts = word.split(' '); // stash parts delimited by a white space
	parts = parts.filter(function (part) { return !!part? true : false });
	word = parts.join(' ')

	if (options.replace && options.replace instanceof RegExp) 
		word = word.replace(options.replace, options.replacement || '');

	if (options.nospace)
		word = word.replace(/\s+/g, '');
	

	Object.keys(words).map(function (symbol) {
		words[symbol].map(function (alias) {
			word = word.replace(new RegExp('('+ alias +')\\s+', 'g'), symbol+ ' ');
		});
	});
 	
  if (word.length > 10) {
  	switch (true) {
  		case (parts.length === 1) :
  		case (options.combine) :
  			if (options.format) break;
		  	var a = word[0]
			  	  , b = word[word.length - 1]
			  	if (a != b) {
			  		word = [a, word.length -2, b].join('')
			  	}
		  break;
	  }
  }

  if (options.acronym) {
  	var acronym = ''
  	parts.map(function (part) { acronym += part[0]; });
  	word = acronym;
  }

  // update parts
  parts = word.split(' ');


  if (options.format && Array.isArray(options.format)) {
  	var action = options.format.map.bind(options.format)
  	
  	if (options.reverse) 
  		action = backwards.bind(null, options.format)

		action(function (format, index) {
			// ensure we are modifying a part that exists
			if (! parts[index]) return
			
			var part = parts[index]
			var variables = {
					length : part.length,
					self   : part,
					index  : index
				}

			if (format === false || format === null)
				parts.splice(index, 1);

			if ((/#[0-9]\[[0-9]+\]+/gi).test(format)) {
				var i = Number(format.match(/#([0-9]+)\[/)[1])
				if (typeof i === 'number' && !isNaN(i)) {
					if ((/^</).test(format)) {
						var subi = Number(format.match(/#[0-9]+\[([0-9]+)\]/)[1])
						part = parts[i][subi]
					}
					else {
						part = parts[i];
					}
					
					format = format.replace(new RegExp(/[<]#[0-9]+\[([0-9]+)\]/), part)
				}
			}
			else if ((/#[0-9|\s]+\{/).test(format)) {
				var i = Number(format.match(/#([0-9]+)\{/)[1])
				if (typeof i === 'number' && !isNaN(i)) {
					if ((/#[0-9]+\{(.*)\}/).test(format)) {
						var subvariables = {
							length : parts[i].length,
							self   : parts[i],
							index  : index
						}
						
						format = format.replace(/^#[0-9]+\{(.*)\}/, '$1');
						Object.keys(subvariables).map(function (variable) {
							if (format.match('%'+ variable)) {
								parts[index] = format.replace('%'+ variable, subvariables[variable]);
								format = format.replace(format)
							}
						});

					}
				}
				
			}


			if ((/%[a-z]/gi).test(format)) {

				Object.keys(variables).map(function (variable) {
					if (format.match('%'+ variable)) {
						parts[index] = format.replace('%'+ variable, variables[variable])
					}
				});
			}

			// single char index
			if ((/^%[0-9]+$/).test(format)) {
				var i = format.match(/%([0-9]+)/)[1]
				parts[index] = parts[index][i];
			}
			// char range
			else if ((/^%[0-9]+-[0-9]|-+$/).test(format)) {
				var match, range = [], substr = ''
				match = format.match(/^%([0-9]+)-/)
				range.push(Number(match && match[1] || 0))
				match = format.match(/-([0-9])$/)
				range.push(Number(match && match[1] || parts[index].length))
				
				if (range[1] > parts[index].length) 
					range[1] = parts[index].length;

				if (typeof range[0] === 'number' && !isNaN(range[0]) && typeof range[1] === 'number' && !isNaN(range[1])) {
					for (var i = range[0]; i < range[1]; i++) {
						substr += parts[index][i];
					}

					parts[index] = substr
				}
			}
		});
  }

  
  // regroup gents
  word = parts.join(' ');
  // drop whitespace
  word = word.replace(/\s+/g, '');
  // add space to space identifiers
  word = word.replace(/%s/g, ' ');
  word = word.replace(/%n/g, '\n');
  word = word.replace(/%t/g, '\t');
  word = word.replace(/%r/g, '\r');

  // to upper case?
  if (options.upper)
  	word = word.toUpperCase();

  // stash in table
  table[original] = word;
  lookup[word] = original;
  // hopefully they like it
 	return word
}

numeronym.get = function (word) {
	return (typeof word === 'undefined')? table :table[word] || undefined;
};

numeronym.lookup = function (numeronym) {
	return (typeof numeronym === 'undefined')? lookup :lookup[numeronym] || undefined;;
};

numeronym.create = function () {
	return numeronym.apply(null, arguments);
};