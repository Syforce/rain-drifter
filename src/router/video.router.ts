import { AbstractRouter, Request } from 'waterfall-gate';
import { VideoManager } from '../manager/video.manager';
import { Video } from '../model/video.model';

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
    }

    private getVideos(request: Request): Promise<Array<Video>> {
        return this.videoManager.getVideos();
    }
    
    private createVideo(request: Request): Promise<Video> {
        const body = request.body;

        return this.videoManager.createVideo(body);
    }
}

