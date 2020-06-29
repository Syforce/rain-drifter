import { IceContainerService } from 'ice-container';
import { join } from 'path';
import * as Express from 'express';

import { TalentDatastore } from './datastore/talent.datastore';
import { MediaDatastore } from './datastore/media.datastore';

import { TalentManager } from './manager/talent.manager';

import { Talent } from './model/talent.model';

import { CONFIG } from './config';

class App {
	private iceContainerService: IceContainerService;
	private talentManager: TalentManager;

	public app: Express.Application;

	constructor() {
		this.init();
	}

	private init() {
		this.iceContainerService = IceContainerService.getInstance();

		this.app = Express();
		
		this.startDatabase();
		this.startServer();
	}

	private startDatabase() {
		this.iceContainerService.registerDatastore(TalentDatastore);
		this.iceContainerService.registerDatastore(MediaDatastore);

		this.iceContainerService.init(CONFIG.database);

		this.talentManager = new TalentManager();
	}

	private startServer() {
		const port = parseInt(process.env.PORT) || 3000;

		this.app.use((request, response, next) => {
			response.header('Access-Control-Allow-Origin', "*");
			response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
			response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
			next();
		});

		this.app.set('view engine', 'pug');
		this.app.set('views', join(__dirname, '../', 'views'));
		this.app.use(Express.static(join(__dirname, '../', 'public')));

		this.app.get('/', async (request, response) => {
			const talents: Array<Talent> = await this.talentManager.getTalents();

			response.render('talents', { talents });
		});

		this.app.get('/talent/:title', async (request, response) => {
			const title: string = request.params.title;
			const talent: Talent = await this.talentManager.getTalent(title);
console.log(123, talent);
			response.render('talent', { talent });
		});


		// this.app.get(/(^((?!api).)*$)(.*(?<!.js|.css|.png)$)/, (request, response) => {
		// 	response.sendfile(`${__dirname}/public/index.html`);
		// });

		// this.app.get(/(^((?!api\/admin).)*)/, (request, response) => {
		// 	response.status(200).json({msg: 'base 1'});
		// });

		// this.app.get('/api/admin/*', (request, response) => {
		// 	response.status(200).json({msg: 'base 2'});
		// });

		this.app.listen(port, () => {
			console.log(`Listening on port ${port}`);
		});
	}
}

export default new App().app;