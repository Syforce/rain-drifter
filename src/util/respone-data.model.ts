import { Image } from "src/model/image.model";
import { Video } from "src/model/video.model";
import { Talent } from "src/model/talent.model";
import { Media } from "src/model/media.model";

export interface ResponseData {
	list: Array<Media | Talent>;
	total: number;
}