import { AbstractRouter, Request } from 'waterfall-gate';
import { VideoManager } from '../manager/video.manager';
import { Video } from '../model/video.model';
import { ResponseData } from 'src/util/respone-data.model';
import { RockGatherService } from 'rock-gather';

export class VideoRouter extends AbstractRouter {
    private videoManager: VideoManager = new VideoManager();
    private rockGatherService: RockGatherService;

    constructor(routeMap) {
        super(routeMap);

        this.rockGatherService = RockGatherService.getInstance();
    }

    public initRoutes() {
        this.get({
            url: '/api/videos',
            callback: this.getVideos.bind(this)
        });
        
        this.post({
            url: '/api/video',
            callback: this.createVideo.bind(this)
        });

        this.post({
            url: '/api/video/:id',
            callback: this.updateVideo.bind(this),
            middleware: [this.rockGatherService.getMiddleware(['thumbnailImageFile'])]
        });

        this.get({
            url: '/api/video/:id',
            callback: this.getVideo.bind(this)
        });
    }

    private getVideos(request: Request): Promise<ResponseData> {
        const currentPage: number = +request.query.currentPage;
        const itemsPerPage: number = +request.query.itemsPerPage;
        const sortBy: string = request.query.sortBy as string;
        const sortOrder: number = +request.query.sortOrder;

        return this.videoManager.getVideos(currentPage, itemsPerPage, sortBy, sortOrder);
    }

    private getVideo(request: Request): Promise<Video> {
        const id: string = request.params.id;

        return this.videoManager.getVideo(id);
    }
    
    private createVideo(request: Request): Promise<Video> {
        const body = request.body;

        return this.videoManager.createVideo(body);
    }

    private updateVideo(request: Request): Promise<Video> {
        let body: any = JSON.parse(JSON.stringify(request.body));

        let thumbnailImage: any;
        if ((request as any).files.thumbnailImageFile ) {
            console.log('aiciiii');
            thumbnailImage = (request as any).files.thumbnailImageFile[0].path;
        } else {
            thumbnailImage = request.body.selectedThumbnail;
        }
        body.selectedThumbnail = thumbnailImage;
        console.log(body.selectedThumbnail);

        return this.videoManager.updateVideo(body);
    }
}

