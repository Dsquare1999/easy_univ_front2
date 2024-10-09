import { RequestState } from "./request.entity";

export interface UserEntity {
    firstname : string;
    lastname : string;
    email : string;
    phone : string;
    profile : string;
    cover : string;
    created_at : string;
    updated_at : string;
    id : string;
    bio : string;
    type: number;
}

export interface UserState {
    isLoggedIn : boolean;
    // status : RequestState["PENDING"] | RequestState["FULFILLED"] | RequestState["REJECTED"];
    status : "pending" | "fulfilled" | "rejected"
}