import { AbstractDatastore } from 'ice-container';
import { Video, VideoSchema } from '../model/video.model';

export class VideoDatastore extends AbstractDatastore<Video> {

    constructor() {
        super('Video', VideoSchema, 'Media');
    }
}