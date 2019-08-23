.PHONY: start-graphql-server dev build-app build-docs

start-graphql-server:
	node ./src/server.js
dev:
	./node_modules/.bin/react-scripts start
build-app:
		./node_modules/.bin/react-scripts build
build-docs:
	./node_modules/.bin/nodemon --exec babel-node ./src/bin/index.js