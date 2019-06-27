.PHONY: run

run:
	NODE_ENV=local ./node_modules/.bin/webpack-dev-server --config webpack.config.js --hot