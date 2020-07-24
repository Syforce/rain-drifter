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
            middleware: [this.rockGatherService.getMiddleware(['profileImage', 'profileCroppedImage', 'listingImage', 'listingCroppedImage'])]
        });

        this.post({
            url: '/api/talent/:id',
            callback: this.updateTalent.bind(this),
            middleware: [this.rockGatherService.getMiddleware(['profileImage', 'profileCroppedImage', 'listingImage', 'listingCroppedImage'])]
        });

        // This needs to be updated because of the conflict with the route below
        this.get({
            url: '/api/talent/:id',
            callback: this.getTalent.bind(this)
        })

        // this.put({
        //     url: '/api/talent/:id',
        //     callback: this.updateTalentById.bind(this)
        // })

    }

    private getTalents(request: Request): Promise<Array<Talent>> {
        const currentPage: number = +request.query.currentPage;
        const itemsPerPage: number = +request.query.itemsPerPage;
        const sortBy: string = request.query.sortBy as string;
        const sortOrder: number = +request.query.sortOrder;

        if (currentPage && itemsPerPage) {
            return this.talentManager.getPaginated(currentPage, itemsPerPage, sortBy, sortOrder);
        } else {
            return this.talentManager.getTalents();
        }
    }
    
    private getTalent(request: Request): Promise<Talent> {
        const id: string = request.params.id;
        return this.talentManager.getTalent(id);
    }

    private createTalent(request: Request): Promise<Talent> {
        let body: any = JSON.parse(JSON.stringify(request.body));
        const listingImage = (request as any).files.listingImage[0].path;
        const listingCroppedImage = (request as any).files.listingCroppedImage[0].path;
        const profileImage = (request as any).files.profileImage[0].path;
        const profileCroppedImage = (request as any).files.profileCroppedImage[0].path;
        body.listingImage = listingImage;
        body.profileImage = profileImage;
        body.listingCroppedImage = listingCroppedImage;
        body.profileCroppedImage = profileCroppedImage;
        
        return this.talentManager.createTalent(body);
    }

    private updateTalent(request: Request): Promise<Talent> {
        console.log("am ajuns la server");
        
        let body: any = JSON.parse(JSON.stringify(request.body));
        body.medias = JSON.parse(body.medias);
        // body.medias.forEach(element => {
        //     element = JSON.parse(element);
        // });
        console.log('body', body);

        const listingImage = (request as any).files.listingImage[0].path;
        const listingCroppedImage = (request as any).files.listingCroppedImage[0].path;
        const profileImage = (request as any).files.profileImage[0].path;
        const profileCroppedImage = (request as any).files.profileCroppedImage[0].path;
        body.listingImage = listingImage;
        body.profileImage = profileImage;
        body.listingCroppedImage = listingCroppedImage;
        body.profileCroppedImage = profileCroppedImage;
        
        return this.talentManager.updateTalent(body);
    }

    private updateTalentById(request: Request): Promise<Talent> {
        const id: string = request.params.id;
        const body = request.body;

        return this.talentManager.updateTalentById(id, body);
    }

}
