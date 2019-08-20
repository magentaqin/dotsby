const path = require('path');
// const Descriptor = require('doxo').RamlDescriptor;

// const api = new Descriptor(path.resolve(__dirname, './api.raml'));

module.exports = {
    apiPath: path.resolve(__dirname, './api.raml'),
    docTitle: 'Fix Simulator Backend API',
    mainRoutes: [
        {
            name: 'Overview',
            dir: 'overview',
            home: 'index.md',
            pages: [
            ],
        },
        // {
        //     name: 'Script Requests',
        //     dir: 'script',
        //     home: 'index.md',
        //     pages: [
        //         api.filter(/^\/script\./),
        //     ],
        // },
        // {
        //     name: 'Order Requests',
        //     dir: 'order',
        //     home: 'index.md',
        //     pages: [
        //         api.filter(/^\/order\./),
        //     ],
        // },
        {
            name: 'Lua api',
            dir: 'lua',
            home: 'index.md',
            pages: [
            ],
        },
    ],
};