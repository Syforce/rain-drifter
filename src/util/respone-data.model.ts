import { Talent } from "src/model/talent.model";
import { Media } from "src/model/media.model";

export interface ResponseData {
	list: Array<Media | Talent>;
	total: number;
}