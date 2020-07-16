import { IceContainerService } from 'ice-container';
import { ImageDatastore } from '../datastore/image.datastore';
import { Image } from '../model/image.model';
import { GravityCloudService } from 'gravity-cloud';
import { unlink } from 'fs';

export class ImageManager {
	private iceContainerService: IceContainerService;
	private imageDatastore: ImageDatastore;
	private gravityCloudService: GravityCloudService;

	constructor() {
		this.iceContainerService = IceContainerService.getInstance();
		this.gravityCloudService = GravityCloudService.getInstance();

		this.imageDatastore = this.iceContainerService.getDatastore(ImageDatastore.name) as ImageDatastore;
	}

	public getImages(): Promise<Array<Image>> {
		return this.imageDatastore.getAll();
	}

	public async createImage(body: any): Promise<Image> {
		const url: string = await this.gravityCloudService.uploadLarge(body.path);

		unlink(body.path, (err) => {
			if (err) {
				console.log(err);
			}
		});
		
		body.path = url;
		
		return this.imageDatastore.create(body);
	}
}