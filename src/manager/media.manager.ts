import { IceContainerService } from 'ice-container';

import { MediaDatastore } from '../datastore/media.datastore';

import { Media } from '../model/media.model';

export class MediaManager {
	private iceContainerService: IceContainerService;
	private mediaDatastore: MediaDatastore;

	constructor() {
		this.iceContainerService = IceContainerService.getInstance();
		this.mediaDatastore = this.iceContainerService.getDatastore(MediaDatastore.name) as MediaDatastore;
	}

	public getMedias(): Promise<Array<Media>> {
		return this.mediaDatastore.getAll();
	}

	public createMedia(body): Promise<Media> {
		return this.mediaDatastore.create(body);
	}

	public getMediasByTalentId(id: string) {
		return this.mediaDatastore.getManyByOptions({talent : id});
	}

	public updateMedias(body): Promise<Array<Media>> {
		return this.mediaDatastore.updateMedias(body);
	}
}