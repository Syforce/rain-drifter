import { ConnectionConfig } from 'ice-container';
import { ServerConnectionConfig } from 'waterfall-gate';

const databaseConfig: ConnectionConfig = {
	host: process.env.MONGO_HQ || 'mongodb://localhost/dance'
};

const serverConfig: ServerConnectionConfig = {
	port: +process.env.PORT || 8111
}

export const CONFIG = {
	server: serverConfig,
	database: databaseConfig,
};