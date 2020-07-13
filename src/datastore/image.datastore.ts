import { AbstractDatastore } from 'ice-container';
import { Image, ImageSchema } from '../model/image.model';

export class ImageDatastore extends AbstractDatastore<Image> {

    constructor() {
        super('Image', ImageSchema, 'Media');
    }
}