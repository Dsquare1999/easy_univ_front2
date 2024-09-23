import { RequestEnum } from "../enums/request.enum";

export interface RequestState {
    PENDING : RequestEnum.PENDING;
    FULFILLED : RequestEnum.FULFILLED;
    REJECTED : RequestEnum.REJECTED;
}