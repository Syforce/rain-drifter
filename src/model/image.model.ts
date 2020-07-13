import { Schema } from 'ice-container';
import { Media } from './media.model';

export const ImageSchema: Schema = new Schema({
	 
}, {
	timestamps: true
});

export interface Image extends Media {
	
}