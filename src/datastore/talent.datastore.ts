import { AbstractDatastore } from 'ice-container';

import { Talent, TalentSchema } from '../model/talent.model';
import { Media } from 'src/model/media.model';

export class TalentDatastore extends AbstractDatastore<Talent> {

	constructor() {
		super('Talent', TalentSchema);
	}

	public removeMediaById(options, id: string) {
		const query = this.model.findOneAndUpdate(options, { $pull: { medias: id } }, { new: true });

		return this.observe(query);
	}

	public addMediaToTalent(options, media: Media) {
		const query = this.model.findOneAndUpdate(options, { $push: { medias: media } }, { new: true });

		return this.observe(query);
	}
}