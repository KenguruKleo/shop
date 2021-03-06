import {ApplicationConfig} from '@loopback/core';
import * as express from 'express';
import { Request, Response } from 'express';
import {ShopApplication} from "./application";
import * as path from 'path';
import * as http from "http";

export class ExpressServer {
	private app: express.Application;
	private lbApp: ShopApplication;
	private server: http.Server;
	private options: ApplicationConfig;

	constructor(options: ApplicationConfig = {}) {
		this.options = options;
		this.app = express();
		this.lbApp = new ShopApplication(options);

		this.app.use('/api', this.lbApp.requestHandler);

		// Custom Express routes
		this.app.get('/', function(_req: Request, res: Response) {
			res.sendFile(path.resolve('public/index.html'));
		});
		this.app.get('/hello', function(_req: Request, res: Response) {
			res.send('Hello world!');
		});

		// Serve static files in the public folder
		this.app.use(express.static('public'));
	}

	async boot() {
		await this.lbApp.boot();
	}

	public getApiPath(): string {
		return <string>`${this.options.rest.host}:${this.options.rest.port}`;
	}

	public async start() {
		await this.lbApp.start();
		const port = this.options.rest.port;
		const host = this.options.host;
		this.server = this.app.listen(port, host);
	}

	// For testing purposes
	public async stop() {
		if (!this.server) return;
		await this.lbApp.stop();
		this.server.close();
		this.server = <http.Server>{};
	}
}
