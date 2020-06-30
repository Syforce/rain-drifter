import { IceContainerService } from 'ice-container';
import { VideoDatastore } from '../datastore/video.datastore';
import { Video } from '../model/video.model';


export class VideoManager {
	private iceContainerService: IceContainerService;
	private videoDatastore: VideoDatastore;

	constructor() {
		this.iceContainerService = IceContainerService.getInstance();
		this.videoDatastore = this.iceContainerService.getDatastore(VideoDatastore.name) as VideoDatastore;
	}

	public getVideos(): Promise<Array<Video>> {
		return this.videoDatastore.getAll();
	}

	public createVideo(body): Promise<Video> {
		return this.videoDatastore.create(body);
	}
}