import { Schema } from 'ice-container';

import { Media } from './media.model';

export const TalentSchema: Schema = new Schema({
	title: String,
	published: Boolean,
	twitter: String,
	instagram: String,
	facebook: String,
	linkedin: String,
	website: String,
	about: String,
	listingImage: String,
	profileImage: String,
	listingCroppedImage: String,
	profileCroppedImage: String,
    medias: [{
        type: Schema.ObjectId,
        ref: 'Media'
    }]
}, {
	timestamps: true
});

export interface Talent {
	_id?: string;
	title: string;
	published: boolean;
	twitter?: string;
	instagram?: string;
	facebook?: string;
	linkedin?: string;
	website?: string;
	about?: string;
	listingImage?: string;
	profileImage?: string;
	listingCroppedImage?: string;
	profileCroppedImage?: string;
	medias?: Array<Media>;
}