import { AbstractRouter, Request } from 'waterfall-gate';
import { ImageManager } from '../manager/image.manager';
import { Image } from '../model/image.model';

export class ImageRouter extends AbstractRouter {
    private imageManager: ImageManager = new ImageManager();

    public initRoutes() {
        this.get({
            url: '/api/images',
            callback: this.getImages.bind(this)
        });
        
        this.post({
            url: '/api/image',
            callback: this.createImage.bind(this)
        });
    }

    private getImages(request: Request): Promise<Array<Image>> {
        return this.imageManager.getImages();
    }
    
    private createImage(request: Request): Promise<Image> {
        const body = request.body;

        return this.imageManager.createImage(body);
    }
}
