import { AbstractRouter, Request } from 'waterfall-gate';
import { MediaManager } from '../manager/media.manager';
import { Media } from '../model/media.model';
import { ResponseData } from 'src/util/respone-data.model';

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

        this.put({
            url: '/api/medias',
            callback: this.updateMedias.bind(this)
        });
    }

    private getMediasByTalentId(request: Request) {
        const id: string = request.params.id;
        return this.mediaManager.getMediasByTalentId(id);
    }

    private getMedias(request: Request): Promise<ResponseData> {
        const currentPage: number = +request.query.currentPage;
        const itemsPerPage: number = +request.query.itemsPerPage;
        const sortBy: string = request.query.sortBy as string;
        const sortOrder: number = +request.query.sortOrder;

        return this.mediaManager.getMedias(currentPage, itemsPerPage, sortBy, sortOrder);
    }
    
    private createMedia(request: Request): Promise<Media> {
        const body = request.body;

        return this.mediaManager.createMedia(body);
    }

    private updateMedias(request: Request): Promise<Array<Media>> {
        const body = request.body;
        return this.mediaManager.updateMedias(body);
    }
}
