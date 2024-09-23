export interface FiliereEntity {
    id ?: string;
    name : string;
    slug ?: string;
    description : string;
}

export interface FiliereState {
    filieres : FiliereEntity[];
    status : "pending" | "fulfilled" | "rejected"
}