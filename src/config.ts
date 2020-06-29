import { ConnectionConfig } from 'ice-container';

const databaseConfig: ConnectionConfig = {
	host: process.env.MONGO_HQ || 'mongodb://localhost/dance'
};

export const CONFIG = {
	database: databaseConfig,
};