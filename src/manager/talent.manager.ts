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

	public async getTalent(id: string): Promise<Talent> {
		const talent: Talent = await this.talentDatastore.getById(id);

		if (talent) {
			// TODO: CHECK THIS LINE
			talent.medias = JSON.parse(JSON.stringify(await this.mediaDatastore.getPublishedMediasByTalent(talent._id)));
		}

		return talent;
	}

	public deleteTempFiles(files: Array<string>) {
		files.forEach( (file) => {
			unlink(file, (err) => {
				if (err) {
					console.log(err);
				}
			});
		});
	}

	public async createTalent(body: any): Promise<Talent> {
		const promise1 = this.gravityCloudService.upload(body.listingImage);
		const promise2 = this.gravityCloudService.upload(body.listingCroppedImage);
		const promise3 = this.gravityCloudService.upload(body.profileImage);
		const promise4 = this.gravityCloudService.upload(body.profileCroppedImage);
		const values: Array<string> = await Promise.all([promise1, promise2, promise3, promise4]);

		this.deleteTempFiles([body.listingImage, body.listingCroppedImage, body.profileImage, body.profileCroppedImage]);	
		
		body.listingImage = values[0];
		body.listingCroppedImage = values[1];
		body.profileImage = values[2];
		body.profileCroppedImage = values[3];

		return this.talentDatastore.create(body);
	}

	public async getPaginated(currentPage: number, itemsPerPage: number, sortBy?: string, sortOrder?: number): Promise<any> {
		const skip = (currentPage - 1) * itemsPerPage;
		let sortOptions: any;

		// TODO: SQL Injection Error
		if (sortBy && sortOrder) {
			sortOptions = {
				[sortBy]: sortOrder
			}
		}

		const options = {
			skip: skip,
			limit: itemsPerPage,
			sort: sortOptions
		}

		const list: Array<Talent> = await this.talentDatastore.getManyByOptions({}, options);
		const total: number = await this.talentDatastore.count({});
		
		const data: any = {
			list: list,
			total: total
		}

		return data;
	}

	public updateTalentById(id: string, talent: Talent) {
		return this.talentDatastore.getOneByOptionsAndUpdate({
			_id: id
		}, talent);
	}
}