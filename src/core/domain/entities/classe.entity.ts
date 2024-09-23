import { CycleEntity } from "./cycle.entity";
import { FiliereEntity } from "./filiere.entity";
import { TagEntity } from "./tag.entity";
import { UserEntity } from "./user.entity";

export interface ClasseEntity {
    id ?: string;
    filiere : FiliereEntity;
    cycle : CycleEntity;
    year: number;
}

export interface ClasseState {
    classes : ClasseEntity[];
    status : "pending" | "fulfilled" | "rejected"
}

export interface StudentEntity {
    id ?: string;
    classe : ClasseEntity;
    user : UserEntity;
    tag?: TagEntity;
    titre?: string;
    statut: string;
    file?: string;
    created_at?: string;
    updated_at?: string;
}