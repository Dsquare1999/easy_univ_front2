export interface TagEntity {
    id?: string;
    name : string;
    fee: number;
}

export interface TagState {
    tags : TagEntity[];
    status : "pending" | "fulfilled" | "rejected"
}