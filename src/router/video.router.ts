import { AbstractRouter, Request } from 'waterfall-gate';
import { VideoManager } from '../manager/video.manager';
import { Video } from '../model/video.model';
import { ResponseData } from 'src/util/respone-data.model';

export class VideoRouter extends AbstractRouter {
    private videoManager: VideoManager = new VideoManager();

    public initRoutes() {
        this.get({
            url: '/api/videos',
            callback: this.getVideos.bind(this)
        });
        
        this.post({
            url: '/api/video',
            callback: this.createVideo.bind(this)
        });

        this.get({
            url: '/api/video/:id',
            callback: this.getVideo.bind(this)
        });

        this.put({
            url: '/api/video/:id',
            callback: this.updateVideo.bind(this)
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
        const id: string = request.params.id;
        const item: Video = request.body;
        
        return this.videoManager.updateVideo(id, item);
    }
}

