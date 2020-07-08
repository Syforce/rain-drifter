import { AbstractRouter, Request } from 'waterfall-gate';
import { TalentManager } from '../manager/talent.manager';
import { Talent } from '../model/talent.model';

export class TalentRouter extends AbstractRouter {
    private talentManager: TalentManager = new TalentManager();

    public initRoutes() {
        this.get({
            url: '/api/talents',
            callback: this.getTalents.bind(this)
        });

        this.post({
            url: '/api/talent',
            callback: this.createTalent.bind(this)
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
        const body = request.body;

        return this.talentManager.createTalent(body);
    }
}
