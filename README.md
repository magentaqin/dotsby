# dotsby
Dotsby is an API doc generator. It helps you deploy your API docs in seconds.

#### Features
* Markdown transformation support.
* Code Hightlight support.
* Doc Search support.

#### Usage
** Build Docs **
```
// TODO
yarn build-docs
```

#### Dotsby In Development
Dotsby do not use SSR in development. Instead, we use client-side rendering.

**Run**
Make sure that graphql server successfully started before you run the app.
GraphQL server is starting at port 4000, and app is starting at port 3000.
```
yarn start-graphql-server
yarn rundev
```

#### Build Dotsby and Run
* build app and watch changes
```
yarn start-graphql-server
yarn watch-runbuild
```


#### Global Packages For Development
* nodemon
* react-scripts