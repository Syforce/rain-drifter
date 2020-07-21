import { AbstractRouter, Request } from 'waterfall-gate';
import { MediaManager } from '../manager/media.manager';
import { Media } from '../model/media.model';

export class MediaRouter extends AbstractRouter {
    private mediaManager: MediaManager = new MediaManager();

    public initRoutes() {
        this.get({
            url: '/api/medias',
            callback: this.getMedias.bind(this)
        });

        this.get({
            url: '/api/medias/talent/:id',
            callback: this.getMediasByTalentId.bind(this)
        });
        
        this.post({
            url: '/api/media',
            callback: this.createMedia.bind(this)
        });
    }

    private getMediasByTalentId(request: Request) {
        const id: string = request.params.id;
        return this.mediaManager.getMediasByTalentId(id);
    }

    private getMedias(request: Request): Promise<Array<Media>> {
        return this.mediaManager.getMedias();
    }
    
    private createMedia(request: Request): Promise<Media> {
        const body = request.body;

        return this.mediaManager.createMedia(body);
    }
}
