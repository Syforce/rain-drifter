import { Schema } from 'ice-container';
import { Media } from './media.model';

export const VideoSchema: Schema = new Schema({
    preview: String,
    original: String,
    thumbnails: [String],
    selectedThumbnail: String
}, {
    timestamps: true
});

export interface Video extends Media {
    preview: string;
    original: string;
    thumbnails: [string];
    selectedThumbnail: string;
}