import { AbstractDatastore } from 'ice-container';

import { Talent, TalentSchema } from '../model/talent.model';

export class TalentDatastore extends AbstractDatastore<Talent> {

	constructor() {
		super('Talent', TalentSchema);    
	}
}