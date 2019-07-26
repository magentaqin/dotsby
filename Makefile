.PHONY: bootstrap

package-app:
	rm -rf ./build && NODE_ENV=prod ./node_modules/.bin/webpack --config webpack.config.js

bootstrap:
	./node_modules/.bin/babel-node ./src/bootstrap/bootstrap.js