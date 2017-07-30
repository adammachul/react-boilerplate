module.exports = {
    host: process.env.NODE_HOST || 'localhost',
    port: process.env.PORT,
    app: {
        htmlAttributes: { lang: 'en' },
        title: 'MyReactBoilerplate',
        titleTemplate: 'MRB- %s',
        meta: [
            {
                name: 'description',
                content: 'My react boilerplate',
            },
        ]
    }
}
