.PHONY: transform bootstrap build-docs

transform:
	./node_modules/.bin/nodemon --exec babel-node ./src/bin/transform.js

bootstrap:
	./node_modules/.bin/nodemon --exec babel-node ./src/bootstrap/index.js

build-docs:
	./node_modules/.bin/nodemon --exec babel-node ./src/bin/index.js