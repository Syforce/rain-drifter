import { IceContainerService } from 'ice-container';
import { VideoDatastore } from '../datastore/video.datastore';
import { TalentDatastore } from '../datastore/talent.datastore'
import { MediaDatastore } from '../datastore/media.datastore';
import { Video } from '../model/video.model';
import { Talent } from 'src/model/talent.model';
import { ResponseData } from 'src/util/respone-data.model';


export class VideoManager {
    private iceContainerService: IceContainerService;
    private videoDatastore: VideoDatastore;
    private talentDatastore: TalentDatastore;
    private mediaDatastore: MediaDatastore;

    constructor() {
        this.iceContainerService = IceContainerService.getInstance();
        this.videoDatastore = this.iceContainerService.getDatastore(VideoDatastore.name) as VideoDatastore;
        this.talentDatastore = this.iceContainerService.getDatastore(TalentDatastore.name) as TalentDatastore;
        this.mediaDatastore = this.iceContainerService.getDatastore(MediaDatastore.name) as MediaDatastore;
    }

    public async getVideos(currentPage: number, itemsPerPage: number, sortBy: string, sortOrder: number): Promise<ResponseData> {
        let options: any = {};

        if (currentPage && itemsPerPage) {
            const skip = (currentPage - 1) * itemsPerPage;
            const limit = itemsPerPage;

            options.skip = skip;
            options.limit = limit;

            if (sortBy && sortOrder) {
                let sortOptions: any;

                sortOptions = {
                    [sortBy]: sortOrder
                }

                options.sort = sortOptions;
            }
        }

        const list: Array<Video> = await this.videoDatastore.getManyByOptions({}, options);
        const total: number = await this.videoDatastore.count();
        const data: ResponseData = {
            list: list,
            total: total
        }

        return data;
    }

    public async createVideo(body): Promise<Video> {
        const talent: Talent = await this.talentDatastore.getById(body.talent);
        const video: Video = await this.videoDatastore.create(body);

        talent.medias.push(video);

        const options = {
            _id: talent._id
        }
        const update = {
            medias: talent.medias
        }

        this.talentDatastore.getOneByOptionsAndUpdate(options, update);

        return video;
    }

    public getVideo(id: string): Promise<Video> {
        return this.videoDatastore.getById(id);
    }

    public async updateVideo(id: string, item: Video): Promise<Video> {
        const oldVideo = await this.mediaDatastore.getById(id);
        const newVideo = await this.videoDatastore.getOneByOptionsAndUpdate({ _id: id }, item);

        if (oldVideo.talent !== item.talent) {
            const updateOldTalentPromise = this.talentDatastore.removeMediaById({ _id: oldVideo.talent }, id);
            const updtateNewTalentPromise = this.talentDatastore.addMediaToTalent({ _id: newVideo.talent }, newVideo);
            await Promise.all([updateOldTalentPromise, updtateNewTalentPromise]);
        }

        return newVideo;
    }
}