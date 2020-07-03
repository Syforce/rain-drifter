import { IceContainerService } from 'ice-container';

import { TalentDatastore } from '../datastore/talent.datastore';
import { MediaDatastore } from '../datastore/media.datastore';

import { Talent } from '../model/talent.model';
import { Media } from '../model/media.model';

export class TalentManager {
	private iceContainerService: IceContainerService;
	private talentDatastore: TalentDatastore;
	private mediaDatastore: MediaDatastore;

	constructor() {
		this.iceContainerService = IceContainerService.getInstance();
		this.talentDatastore = this.iceContainerService.getDatastore(TalentDatastore.name) as TalentDatastore;
		this.mediaDatastore = this.iceContainerService.getDatastore(MediaDatastore.name) as MediaDatastore;
	}

	public getTalents(): Promise<Array<Talent>> {
		return this.talentDatastore.getAll();
	}

	public async getTalent(title: string): Promise<Talent> {
		const talent: Talent = await this.talentDatastore.getOneByOptions({
			title
		});

		if (talent) {
			talent.medias = JSON.parse(JSON.stringify(await this.mediaDatastore.getPublishedMediasByTalent(talent._id)));
		}

		return talent;
	}

	public createTalent(body): Promise<Talent> {
		return this.talentDatastore.create(body);
	}

	public getSortedTalents(sortBy: string, orderBy: number): Promise<Array<Talent>> {
		const options = {
			sort: {}
		}
		options.sort[sortBy] = orderBy;
		console.log(options);
		return this.talentDatastore.getManyByOptions(options);
	}
}