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
            url: '/api/talents',
            callback: this.getSortedTalents.bind(this)
        })

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
        return this.talentManager.getTalents();
    }
    
    private getTalent(request: Request): Promise<Talent> {
        const title: string = request.params.title;

        return this.talentManager.getTalent(title);
    }

    private createTalent(request: Request): Promise<Talent> {
        const body = request.body;
        console.log(body);

        return this.talentManager.createTalent(body);
    }

    private getSortedTalents(request: Request): Promise<Array<Talent>> {
        const sortBy: string = request.query.sortBy as string;
        const orderBy: number = +request.query.orderBy;

        return this.talentManager.getSortedTalents(sortBy, orderBy);
    }
}
