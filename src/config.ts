import { ServerConnectionConfig } from 'waterfall-gate';
import { ConnectionConfig } from 'ice-container';
import { FileStorageConfig } from 'rock-gather';
import { StorageConfig } from 'gravity-cloud';

const databaseConfig: ConnectionConfig = {
	host: process.env.MONGO_HQ || 'mongodb://localhost/dance'
};

const serverConfig: ServerConnectionConfig = {
	port: +process.env.PORT || 8111
}

const fileConfig: FileStorageConfig = {
	destination: './uploads',
	randomNames: true
}

const storageConfig: StorageConfig = {
	name: 'syforce',
	apiKey: '733675221936768',
	apiSecret: 'Efa6K4_TiioWE20EBQ2Gpzm3U-U'
};

export const CONFIG = {
	server: serverConfig,
	database: databaseConfig,
	file: fileConfig,
	storage: storageConfig,
};