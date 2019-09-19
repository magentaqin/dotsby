# dotsby

#### Usage
** Build Docs **
```
// TODO
make build-docs
```

#### Dotsby In Development
Dotsby do not use SSR in development. Instead, we use client-side rendering.

**Run**
Make sure that graphql server successfully started before you run the app.
GraphQL server is starting at port 4000, and app is starting at port 3000.
```
make start-graphql-server
make rundev
```

#### Build Dotsby and Run
* build app
```
make build-app
make start-graphql-server
make runbuild
```


#### Global Packages For Development
* prisma