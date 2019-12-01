require('dotenv').config();

import {ApplicationConfig} from '@loopback/core';

import {ShopApplication} from './application';
import {ExpressServer} from "./server";

export {ExpressServer, ShopApplication};

export async function main(options: ApplicationConfig = {}) {
  const server = new ExpressServer(options);
  await server.boot();
  await server.start();

  const url = server.getApiPath();
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);
}
