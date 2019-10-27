const application = require('./src');

module.exports = application;

if (require.main === module) {
	// Run the application
	const config = {
		rest: {
			// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
			// @ts-ignore
			port: +process.env.PORT || 3000,
			host: process.env.HOST || 'localhost',
			openApiSpec: {
				// useful when used with OpenAPI-to-GraphQL to locate your application
				setServersFromRequest: true,
			},
			// Use the LB4 application as a route. It should not be listening.
			listenOnStart: false,
		},
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	application.main(config).catch((err: any) => {
		console.error('Cannot start the application.', err);
		process.exit(1);
	});
}
