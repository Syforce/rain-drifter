import { IceContainerService } from 'ice-container';

import { MediaDatastore } from '../datastore/media.datastore';

import { Media } from '../model/media.model';
import { ResponseData } from 'src/util/respone-data.model';

export class MediaManager {
	private iceContainerService: IceContainerService;
	private mediaDatastore: MediaDatastore;

	constructor() {
		this.iceContainerService = IceContainerService.getInstance();
		this.mediaDatastore = this.iceContainerService.getDatastore(MediaDatastore.name) as MediaDatastore;
	}

	public async getMedias(currentPage, itemsPerPage, sortBy, sortOrder): Promise<ResponseData> {
		let options: any = {};

        if (currentPage && itemsPerPage) {
            const skip = (currentPage - 1) * itemsPerPage;
			const limit = itemsPerPage;

            options.skip = skip;
			options.limit = limit;
			options.sort =  {createdAt: -1};

            if (sortBy && sortOrder) {
                let sortOptions: any;

                sortOptions = {
                    [sortBy]: sortOrder
                }

                options.sort = sortOptions;
            }
        }

        const list: Array<Media> = await this.mediaDatastore.getManyByOptions({}, options);
        const total: number = await this.mediaDatastore.count();
        const data: ResponseData = {
            list: list,
            total: total
        }

        return data;
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