.PHONY: transform bootstrap

transform:
	node ./src/bin/transform.js

bootstrap:
	./node_modules/.bin/nodemon --exec babel-node ./src/bootstrap/index.js