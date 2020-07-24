import { AbstractRouter, Request } from 'waterfall-gate';
import { ImageManager } from '../manager/image.manager';
import { Image } from '../model/image.model';
import { RockGatherService } from 'rock-gather';
import { ResponseData } from 'src/util/respone-data.model';

export class ImageRouter extends AbstractRouter {
    private imageManager: ImageManager = new ImageManager();
    private rockGatherService: RockGatherService;

    constructor(routeMap) {
        super(routeMap);

        this.rockGatherService = RockGatherService.getInstance();
    }

    public initRoutes() {
        this.get({
            url: '/api/images',
            callback: this.getImages.bind(this)
        });

        this.get({
            url: '/api/image/:id',
            callback: this.getImageById.bind(this)
        });
        
        this.post({
            url: '/api/image',
            callback: this.createImage.bind(this),
            middleware: [this.rockGatherService.getMiddleware(['originalImage', 'thumbnailImage'])]
        });
    }

    private getImages(request: Request): Promise<ResponseData> {
        const currentPage: number = +request.query.currentPage;
        const itemsPerPage: number = +request.query.itemsPerPage;
        const sortBy: string = request.query.sortBy as string;
        const sortOrder: number = +request.query.sortOrder;

        return this.imageManager.getImages(currentPage, itemsPerPage, sortBy, sortOrder);
    }

    private getImageById(request: Request): Promise<Image> {
        const id: string = request.params.id;
        return this.imageManager.getImageById(id);
    }
    
    private createImage(request: Request): Promise<Image> {
        let body: any = JSON.parse(JSON.stringify(request.body));
        const originalImage = (request as any).files.originalImage[0].path;
        const thumbnail = (request as any).files.thumbnailImage[0].path;

        body.path = originalImage;
        body.thumbnail = thumbnail;

        return this.imageManager.createImage(body);
    }
}
