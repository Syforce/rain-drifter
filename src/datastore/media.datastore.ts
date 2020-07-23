import { AbstractDatastore } from 'ice-container';

import { Media, MediaSchema } from '../model/media.model';

export class MediaDatastore extends AbstractDatastore<Media> {

	constructor() {
		super('Media', MediaSchema);
	}

	public updateMedias(medias: Array<Media>) {
		console.log(medias);
		const promises: Array<Promise<Media>> = new Array<Promise<Media>>();

		for (let i = 0; i < medias.length; i++) {
			const query = this.getOneByOptionsAndUpdate({
				_id: medias[i]._id
			}, medias[i]);

			promises.push(this.observe(query));
		}

		return Promise.all(promises);
	}

	public getPublishedMediasByTalent(id: string) {
		const query = this.model.find({
			talent: id,
			published: true
		});

		return this.observe(query);
	}
}