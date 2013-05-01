numeronym
======

Convert and/or define numeronyms from words


## install
You can install it with `npm(1)`
### npm
```sh
$ npm install numeronym
```

or use `component(1)`
### component
```sh
$ npm install jwerle/numeronym
```

## usage
#### numeronym(word)
`numeronym()` tries its best to create a numeronym representation of a word you provide. It is simple
to use and may be useful to someone out there. It was fun to make.

To start using numeronym, just pass it a string argument. All numeronym's created are stored in an internal
table

```js
var n = require('numeronym');

console.log( n('canine') ); // k9
console.log( n('internationalization') ); // i18n

```

## api
#### numeronym(word, [alias|options])
Accepts a word as an argument. An optional `alias` or `options` object can be passed as well. In the case
of a string `alias` provied, the creation of a numeronym is skipped and the alias is used as the value.


#### numeronym.get(word)
Returns the numeronym associated with the provided word

```js
var n = require('numeronym');

n('internationalization'); // i18n
n.get('internationalization'); // i18n
```

#### numeronym.lookup(numeronym)
Returns the string used to create numeronym

```js
var n = require('numeronym');

n.lookup'k9'); // canine
```


## pattern syntax
TODO ..


## test
```sh
$ make test
```

## author
joseph werle

## license
MIT
