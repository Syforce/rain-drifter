import { Schema } from 'ice-container';
import { Media } from './media.model';

export const VideoSchema: Schema = new Schema({
	 
}, {
	timestamps: true
});

export interface Video extends Media {
	
}