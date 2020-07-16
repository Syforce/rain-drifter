import { Schema } from 'ice-container';
import { Media } from './media.model';

export const ImageSchema: Schema = new Schema({
	thumbnail: String
}, {
	timestamps: true
});

export interface Image extends Media {
	thumbnail: string;
}