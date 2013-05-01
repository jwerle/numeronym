TEST_RUNNER := "spec"

build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

test:
	@mocha -R ${TEST_RUNNER}

.PHONY: clean test
