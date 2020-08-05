import { IceContainerService } from 'ice-container';
import { WaterfallGateService } from 'waterfall-gate';
import { RockGatherService } from 'rock-gather';
import { GravityCloudService } from 'gravity-cloud';
import { join } from 'path';
import * as Express from 'express';

import { TalentDatastore } from './datastore/talent.datastore';
import { MediaDatastore } from './datastore/media.datastore';
import { ImageDatastore } from './datastore/image.datastore';
import { VideoDatastore } from './datastore/video.datastore';

import { TalentRouter } from './router/talent.router';
import { MediaRouter } from './router/media.router';
import { ImageRouter } from './router/image.router';
import { VideoRouter } from './router/video.router';

import { CONFIG } from './config';

class App {
	private iceContainerService: IceContainerService;
	private waterfallGateService: WaterfallGateService;
	private rockGatherService: RockGatherService;
	private gravityCloudService: GravityCloudService;

	public app;

	constructor() {
		this.init();
	}

	private init() {
		this.iceContainerService = IceContainerService.getInstance();
		this.waterfallGateService = WaterfallGateService.getInstance();
		this.rockGatherService = RockGatherService.getInstance();
		this.gravityCloudService = GravityCloudService.getInstance();

		this.app = Express();
		
		this.startDatabase();
		this.startServer();
		this.startStorage();
	}

	private startDatabase() {
		this.iceContainerService.registerDatastore(TalentDatastore);
		this.iceContainerService.registerDatastore(MediaDatastore);
		this.iceContainerService.registerDatastore(ImageDatastore);
		this.iceContainerService.registerDatastore(VideoDatastore);

		this.iceContainerService.init(CONFIG.database);
	}

	private startStorage() {
		this.rockGatherService.init(CONFIG.file);
		this.gravityCloudService.init(CONFIG.storage);
	}

	private startServer() {
		this.app.use((request, response, next) => {
			response.header('Access-Control-Allow-Origin', "*");
			response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
			response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
			next();
		});

		this.waterfallGateService.registerRouter(TalentRouter);
		this.waterfallGateService.registerRouter(MediaRouter);
		this.waterfallGateService.registerRouter(ImageRouter);
		this.waterfallGateService.registerRouter(VideoRouter);

		 this.waterfallGateService.init(CONFIG.server, true);

// 		this.app.set('view engine', 'pug');
// 		this.app.set('views', join(__dirname, '../', 'views'));
// 		this.app.use(Express.static(join(__dirname, '../', 'public')));

// 		this.app.get('/', async (request, response) => {
// 			const talents: Array<Talent> = await this.talentManager.getTalents();

// 			response.render('talents', { talents });
// 		});

// 		this.app.get('/talent/:title', async (request, response) => {
// 			const title: string = request.params.title;
// 			const talent: Talent = await this.talentManager.getTalent(title);
// console.log(123, talent);
// 			response.render('talent', { talent });
// 		});


		// this.app.get(/(^((?!api).)*$)(.*(?<!.js|.css|.png)$)/, (request, response) => {
		// 	response.sendfile(`${__dirname}/public/index.html`);
		// });

		// this.app.get(/(^((?!api\/admin).)*)/, (request, response) => {
		// 	response.status(200).json({msg: 'base 1'});
		// });

		// this.app.get('/api/admin/*', (request, response) => {
		// 	response.status(200).json({msg: 'base 2'});
		// });

		// this.app.listen(port, () => {
		// 	console.log(`Listening on port ${port}`);
		// });
	}
}

export default new App().app;