export interface CycleEntity {
    id ?: string;
    name : string;
    slug ?: string;
    description : string;
    duration: number;
}

export interface CycleState {
    cycles : CycleEntity[];
    status : "pending" | "fulfilled" | "rejected"
}