import { AbstractDatastore } from 'ice-container';

import { Talent, TalentSchema } from '../model/talent.model';

export class TalentDatastore extends AbstractDatastore<Talent> {

	constructor() {
		super('Talent', TalentSchema);
	}

	public getSorted(sortOptions) {
		const query = this.model.find().sort([[sortOptions.sortBy, sortOptions.sortOrder]]);

		return this.observe(query);
	}
}