import { IceContainerService } from 'ice-container';
import { ImageDatastore } from '../datastore/image.datastore';
import { Image } from '../model/image.model';
import { GravityCloudService } from 'gravity-cloud';
import { unlink } from 'fs';
import { TalentDatastore } from '../datastore/talent.datastore';
import { Talent } from '../model/talent.model';
import { ResponseData } from 'src/util/respone-data.model';

export class ImageManager {
	private iceContainerService: IceContainerService;
	private imageDatastore: ImageDatastore;
	private gravityCloudService: GravityCloudService;
	private talentDatastore: TalentDatastore;

	constructor() {
		this.iceContainerService = IceContainerService.getInstance();
		this.gravityCloudService = GravityCloudService.getInstance();

		this.imageDatastore = this.iceContainerService.getDatastore(ImageDatastore.name) as ImageDatastore;
		this.talentDatastore = this.iceContainerService.getDatastore(TalentDatastore.name) as TalentDatastore;
	}

	public async getImages(currentPage: number, itemsPerPage: number, sortBy: string, sortOrder: number): Promise<ResponseData> {
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

		const list: Array<Image> = await this.imageDatastore.getManyByOptions({}, options);
		const total: number = await this.imageDatastore.count();
		const data: ResponseData = {
			list: list,
			total: total
		}

		return data;
	}

	public async getImageById(id: string): Promise<Image> {
		return this.imageDatastore.getById(id);
	}

	public async createImage(body: any): Promise<Image> {
		// CLOUDINARY UPLOAD
		const promise1 = this.gravityCloudService.upload(body.path);
		const promise2 = this.gravityCloudService.upload(body.thumbnail);
		const values: Array<string> = await Promise.all([promise1, promise2]);
		const urlOriginalImage: string = values[0];
		const urlThumbnail: string = values[1];

		unlink(body.path, (err) => {
			if (err) {
				console.log(err);
			}
		});
		unlink(body.thumbnail, (err) => {
			if (err) {
				console.log(err);
			}
		});

		// UPDATE IMAGE URLS
		body.path = urlOriginalImage;
		body.thumbnail = urlThumbnail;

		// ADD IMAGE ON TALENT'S MEDIA ARRAY
		const talent: Talent = await this.talentDatastore.getById(body.talent);
		const image: Image = await this.imageDatastore.create(body);

		talent.medias.push(image);

		const options = {
			_id: talent._id
		}
		const update = {
			medias: talent.medias
		}
		
		this.talentDatastore.getOneByOptionsAndUpdate(options, update);

		return image;
	}
}