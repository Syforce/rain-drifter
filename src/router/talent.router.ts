import { AbstractRouter, Request } from 'waterfall-gate';
import { TalentManager } from '../manager/talent.manager';
import { Talent } from '../model/talent.model';
import { RockGatherService } from 'rock-gather';

export class TalentRouter extends AbstractRouter {
    private talentManager: TalentManager = new TalentManager();
    private rockGatherService: RockGatherService;

    constructor(routeMap) {
        super(routeMap);

        this.rockGatherService = RockGatherService.getInstance();
    }

    public initRoutes() {
        this.get({
            url: '/api/talents',
            callback: this.getTalents.bind(this)
        });

        this.post({
            url: '/api/talent',
            callback: this.createTalent.bind(this),
            middleware: [this.rockGatherService.getMiddleware('storeImage')]
        });

        this.get({
            url: '/api/talent/:title',
            callback: this.getTalent.bind(this)
        })
    }

    private getTalents(request: Request): Promise<Array<Talent>> {
        const currentPage: number = +request.query.currentPage;
        const itemsPerPage: number = +request.query.itemsPerPage;
        const sortBy: string = request.query.sortBy as string;
        const sortOrder: number = +request.query.sortOrder;

        return this.talentManager.getPaginated(currentPage, itemsPerPage, sortBy, sortOrder);
    }
    
    private getTalent(request: Request): Promise<Talent> {
        const title: string = request.params.title;

        return this.talentManager.getTalent(title);
    }

    private createTalent(request: Request): Promise<Talent> {
        let body = request.body;
        const listingImage = ((request as any).file.path);
        body['listingImage'] = listingImage;

        return this.talentManager.createTalent(body);
    }
}
