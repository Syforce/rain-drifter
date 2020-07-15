import { Schema } from 'ice-container';
import { Media } from './media.model';

export const VideoSchema: Schema = new Schema({
    preview: String,
    thumbnails: [String]
}, {
	timestamps: true
});

export interface Video extends Media {
    preview: string;
    thumbnails: [string];
}