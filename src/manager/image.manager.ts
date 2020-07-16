import { IceContainerService } from 'ice-container';
import { ImageDatastore } from '../datastore/image.datastore';
import { Image } from '../model/image.model';
import { GravityCloudService } from 'gravity-cloud';
import { unlink } from 'fs';
import { TalentDatastore } from '../datastore/talent.datastore';
import { Talent } from '../model/talent.model';

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

	public getImages(): Promise<Array<Image>> {
		return this.imageDatastore.getAll();
	}

	public async createImage(body: any): Promise<Image> {
		// CLOUDINARY UPLOAD
		const urlOriginalImage: string = await this.gravityCloudService.upload(body.path);
		const urlThumbnail: string = await this.gravityCloudService.upload(body.thumbnail);

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