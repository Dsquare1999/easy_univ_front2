export interface UniteEntity {
    id ?: string;
    name : string;
    code : string;
    slug ?: string;
    description : string;
}

export interface UniteState {
    unites : UniteEntity[];
    status : "pending" | "fulfilled" | "rejected"
}