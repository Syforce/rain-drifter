import { Schema } from 'ice-container';

export const MediaSchema: Schema = new Schema({
	title: String,
	published: {
		type: Boolean,
		default: false
	},
	talent: {
		type: Schema.Types.ObjectId,
		ref: 'Talent'
	}
}, {
	timestamps: true
});

export interface Media {
	_id?: string;
	title: string;
	talent: string;
	published: boolean;
}