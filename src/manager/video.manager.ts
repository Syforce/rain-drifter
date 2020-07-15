import { IceContainerService } from 'ice-container';
import { VideoDatastore } from '../datastore/video.datastore';
import { TalentDatastore } from '../datastore/talent.datastore'
import { Video } from '../model/video.model';
import { Talent } from 'src/model/talent.model';


export class VideoManager {
	private iceContainerService: IceContainerService;
    private videoDatastore: VideoDatastore;
    private talentDatastore: TalentDatastore;

	constructor() {
		this.iceContainerService = IceContainerService.getInstance();
        this.videoDatastore = this.iceContainerService.getDatastore(VideoDatastore.name) as VideoDatastore;
        this.talentDatastore = this.iceContainerService.getDatastore(TalentDatastore.name) as TalentDatastore;
	}

	public getVideos(): Promise<Array<Video>> {
		return this.videoDatastore.getAll();
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
}