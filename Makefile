.PHONY: start-graphql-server dev build-app build-docs

start-graphql-server:
	node ./src/server.js
rundev:
	./node_modules/.bin/react-scripts start
build-app:
		./node_modules/.bin/react-scripts build
runbuild:
	./node_modules/.bin/nodemon --exec babel-node ./src/bin/bootstrap.js
build-docs:
	./node_modules/.bin/nodemon --exec babel-node ./src/bin/index.js