import { IceContainerService } from 'ice-container';
import { ImageDatastore } from '../datastore/image.datastore';
import { Image } from '../model/image.model';

export class ImageManager {
	private iceContainerService: IceContainerService;
	private imageDatastore: ImageDatastore;

	constructor() {
		this.iceContainerService = IceContainerService.getInstance();
		this.imageDatastore = this.iceContainerService.getDatastore(ImageDatastore.name) as ImageDatastore;
	}

	public getImages(): Promise<Array<Image>> {
		return this.imageDatastore.getAll();
	}

	public createImage(body): Promise<Image> {
		return this.imageDatastore.create(body);
	}
}