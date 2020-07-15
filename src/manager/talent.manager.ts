import { IceContainerService } from 'ice-container';
import { GravityCloudService } from 'gravity-cloud';

import { TalentDatastore } from '../datastore/talent.datastore';
import { MediaDatastore } from '../datastore/media.datastore';

import { unlink } from 'fs';
import { Talent } from '../model/talent.model';
import { Media } from '../model/media.model';

export class TalentManager {
	private iceContainerService: IceContainerService;
	private talentDatastore: TalentDatastore;
	private mediaDatastore: MediaDatastore;
	private gravityCloudService: GravityCloudService;

	constructor() {
		this.iceContainerService = IceContainerService.getInstance();
		this.gravityCloudService = GravityCloudService.getInstance();
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
			// TODO: CHECK THIS LINE
			talent.medias = JSON.parse(JSON.stringify(await this.mediaDatastore.getPublishedMediasByTalent(talent._id)));
		}

		return talent;
	}

	public async createTalent(body: any): Promise<Talent> {
		await this.gravityCloudService.upload(body.listingImage);
		unlink(body.listingImage, (err) => {
			if (err) {
				console.log(err);
			}
		});

		return this.talentDatastore.create(body);
	}

	public async getPaginated(currentPage: number, itemsPerPage: number, sortBy?: string, sortOrder?: number): Promise<any> {
		const skip = (currentPage - 1) * itemsPerPage;
		let sortOptions: any;
		let data: any;

		// TODO: SQL Injection Error
		if (sortBy && sortOrder) {
			sortOptions = {
				[sortBy]: sortOrder
			}
		}

		const list: Array<Talent> = await this.talentDatastore.getPaginated(skip, itemsPerPage, sortOptions);
		const total: number = await this.talentDatastore.count();

		data = {
			list: list,
			total: total
		}

		return data;
	}
}