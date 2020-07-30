import { IceContainerService } from 'ice-container';
import { GravityCloudService } from 'gravity-cloud';

import { TalentDatastore } from '../datastore/talent.datastore';
import { MediaDatastore } from '../datastore/media.datastore';

import { unlink } from 'fs';
import { Talent } from '../model/talent.model';
import { Media } from '../model/media.model';
import { ResponseData } from 'src/util/respone-data.model';

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

	public async getTalents(currentPage: number, itemsPerPage: number, sortBy: string, sortOrder: number): Promise<ResponseData> {
		let options: any = {};

		if (currentPage && itemsPerPage) {
			const skip = (currentPage - 1) * itemsPerPage;
			const limit = itemsPerPage;

			options.skip = skip;
			options.limit = limit;

			if (sortBy && sortOrder) {
				let sortOptions: any;

				sortOptions = {
					[sortBy]: sortOrder
				}

				options.sort = sortOptions;
			}
		}

		const list: Array<Talent> = await this.talentDatastore.getManyByOptions({}, options);
		const total: number = await this.talentDatastore.count();
		const data: ResponseData = {
			list: list,
			total: total
		}

		return data;
	}

	public async getTalent(id: string): Promise<Talent> {
		const talent: Talent = await this.talentDatastore.getById(id);

		if (talent) {
			// TODO: CHECK THIS LINE
			talent.medias = JSON.parse(JSON.stringify(await this.mediaDatastore.getPublishedMediasByTalent(talent._id)));
		}

		return talent;
	}

	public deleteTempFiles(data: string | Array<string>) {
		if (Array.isArray(data)) {
			data.forEach(file => {
				unlink(file, (err) => {
					if (err) {
						console.log(err);
					}
				});
			});
		} else {
			unlink(data, (err) => {
				if (err) {
					console.log(err);
				}
			});
		}
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

	
	public async updateTalent(body: any): Promise<Talent> {

		if ( !body.listingImage.includes("http://res.cloudinary.com") ) {
			const promise = this.gravityCloudService.upload(body.listingImage);
			const resolvedPromise: Array<string> = await Promise.all([promise]);
			this.deleteTempFiles(body.listingImage);
			body.listingImage = resolvedPromise[0];
		}

		if ( !body.profileImage.includes("http://res.cloudinary.com") ) {
			const promise = this.gravityCloudService.upload(body.profileImage);
			const resolvedPromise: Array<string> = await Promise.all([promise]);
			this.deleteTempFiles(body.profileImage);
			body.profileImage = resolvedPromise[0];
		}

		
		if ( !body.profileCroppedImage.includes("http://res.cloudinary.com") ) {
			const promise = this.gravityCloudService.upload(body.profileCroppedImage);
			const resolvedPromise: Array<string> = await Promise.all([promise]);
			this.deleteTempFiles(body.profileCroppedImage);
			body.profileCroppedImage = resolvedPromise[0];
		}

		if ( !body.listingCroppedImage.includes("http://res.cloudinary.com") ) {
			const promise = this.gravityCloudService.upload(body.listingCroppedImage);
			const resolvedPromise: Array<string> = await Promise.all([promise]);
			this.deleteTempFiles(body.listingCroppedImage);
			body.listingCroppedImage = resolvedPromise[0];
		}
		
		return this.talentDatastore.getOneByOptionsAndUpdate({
			_id: body._id
		}, body);
	}


	public updateTalentById(id: string, talent: Talent) {
		return this.talentDatastore.getOneByOptionsAndUpdate({
			_id: id
		}, talent);
	}
}