import { CycleEntity } from "./cycle.entity";
import { FiliereEntity } from "./filiere.entity";
import { TagEntity } from "./tag.entity";
import { UserEntity } from "./user.entity";

export interface ClasseEntity {
    id ?: string;
    filiere : FiliereEntity;
    cycle : CycleEntity;
    year: number;
    academic_year: string;
    parts: string;
    status?: number;
    matieres?: MatiereEntity[];
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

export interface MatiereEntity {
    id ?: string;
    name : string;
    code : string;
    unite: string;
    classe: string;
    coefficient: number;
    hours: number;
    libelle : string;
    teacher?: UserEntity;
    year_part: number;
    releves: ReleveEntity[];
    programs: ProgramEntity[];
}

export interface ReleveEntity {
    id ?: string;
    classe: string;
    student: StudentEntity;
    matiere: string;
    exam1: string;
    exam2: string;
    partial: string;
    remedial: string;
    status: string;
    observation_exam1: string;
    observation_exam2: string;
    observation_partial: string;
    observation_remedial: string;
}

export interface ProgramEntity {
    id : string;
    day : string;
    h_begin : string;
    h_end : string;
    status: string;
    observation: string;
    report: ProgramEntity | null;
}