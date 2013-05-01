describe("numeronym", function () {
	var n = require('../')
		,	assert = require('assert')
		, noop = function () {}

	it ("should convert and/or define a numeronyms from a words", noop);

// console.log('[numeronym]:'
// 	, numeronym('canine')
// 	, numeronym('internationalization')
// 	, numeronym('accessibility')
// 	, numeronym('Andreessen Horowitz', {combine: true, nospace: true})
// 	, numeronym('10 thousand client',  {upper: true, format: ['<#2[0]%self', '%self', false]})
// 	, numeronym('consumability',       {format: ['%0-5', '%length']})
// 	, numeronym('canonicalisation',    {format: ['%5-', '%length']})
// 	, numeronym('Cristiano Ronaldo',   {upper: true, reverse: true, format: ['%0', '#0{%length}']})
// 	, numeronym('documentation')
// 	, numeronym('electrolysis')
// 	, numeronym('Eyjafjallajökull')
// 	, numeronym('Group of Eight',       {acronym: true, upper: true})
// 	, numeronym('The Mighty Big Dads',  {acronym: true, upper: true})
// )
	
	it("should accept simple words", function () {
		var k9   = n('canine')
			,	i18n = n('internationalization')
			,	a11y = n('accessibility');

		assert.ok(k9 === 'k9', "failed to convert 'canine' to k9");
		assert.ok(i18n === 'i18n', "failed to convert 'internationalization' to i18n");
		assert.ok(a11y === 'a11y', "failed to convert 'accessibility' to a11y");
	});

	it("should accept simple paramters", function () {
		var a16z = n('Andreessen Horowitz', {combine: true, nospace: true});
		assert.ok(a16z === 'a16z', "failed to convert 'Andreessen Horowitz' to 'a16z");
	});

	it("should accept substring format syntax for a single character", function () {
		var d = n('documentation', {format: ['%0']})
		assert.ok(d === 'd', "failed to convert 'documentation' to 'd");
	});

	it("should accept substring format syntax for a character range", function () {
		var consu = n('consumability', {format: ['%0-5']})
		assert.ok(consu === 'consu', "failed to convert 'consumability' to 'consu'");
	});

	it("should accept substring format syntax for starting at a given index and ending at the end of the string", function () {
		var icalisation = n('canonicalisation', {format: ['%5-', '%length']});
		assert.ok(icalisation === 'icalisation', "failed to convert 'canonicalisation' to 'icalisation'");
	});

	it("should convert phrases to acronyms", function () {
		var TMBD = n('The Mighty Big Dads',  {acronym: true, upper: true});
		assert.ok(TMBD === 'TMBD', "failed to convert 'The Mighty Big Dads' to 'TMBD'");
	});

	it("should accept regex grouping syntax", function () {
		var fb = n('FaceBook', {regex: /([a-z]{4})([a-z]{4})/i, format: ['%0', '%0']});
		assert.ok(fb === 'fb', "failed to convert 'FaceBook' to 'fb")
	});

	it("should accept append formatting syntax", function () {
		var C10K = n('10 thousand client',  {upper: true, format: ['<#2[0]%self', '%self', false]});
		assert.ok(C10K === 'C10K', "failed to convert '10 thousand client' to 'C10K");
	});

	it("should allow scoped formatting variable syntax", function () {
		var C9 = n('Cristiano Ronaldo', {upper: true, reverse: true, format: ['%0', '#0{%length}']})
		assert.ok(C9 === 'C9', "failed to convert 'Cristiano Ronaldo' to 'C9");
	});

	it("should accept replacement regex", function () {
		var twttr = n('twitter', {replace: /[aeiou]+/gi});
		assert.ok(twttr === 'twttr', "failed to convert 'twitter' to 'twttr");
	});
});