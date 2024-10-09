'use client'
import { programCreateAction, releveCreateAction, releveGenerateAction } from "@/core/application/actions/matiere.action";
import { useAppDispatch } from "@/core/application/hooks";
import { NoteSchema } from "@/core/application/schemas";
import { ClasseEntity, MatiereEntity, ReleveEntity } from "@/core/domain/entities/classe.entity"
import { CycleEntity } from "@/core/domain/entities/cycle.entity";
import { FiliereEntity } from "@/core/domain/entities/filiere.entity";
import { zodResolver } from "@hookform/resolvers/zod";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { set, z } from "zod";

interface RelevesComponentProps {
    cycle: CycleEntity | undefined;
    filiere: FiliereEntity | undefined;
    matiere: MatiereEntity;
    onRetour: (updatedReleves: ReleveEntity[]) => void;
}

const RelevesComponent = ({cycle, filiere, matiere, onRetour} : RelevesComponentProps) => {
    const dispatch = useAppDispatch();
    const ReleveTableRef = useRef<HTMLTableElement>(null);
    const [examType, setExamType] = useState("exam1");
    const [isLoading, setIsLoading] = useState(false);
    const [releveData, setReleveData] = useState<ReleveEntity[]>(matiere.releves);
    const releveColumns = [
        { data: "id", visible: false },
        { data: "name", title: "Nom et Prénoms" },
        { data: "exam1", title: "Devoir 1" },
        { data: "exam2", title: "Devoir 2" },
        { data: "moy_exams", title: "Moyenne Devoirs" },
        { data: "partial", title: "Partiel" },
        { data: "moy_general", title: "Moyenne Generale" },
        { data: "remedial", title: "Rattrapage" },
        { data: "decision", title: "Decision" },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm<z.infer<typeof NoteSchema>>({
        resolver: zodResolver(NoteSchema),
      });
    
      const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setExamType(e.target.value);
      };
      const getExamTitle = () => {
        switch (examType) {
          case "exam1":
            return "Devoir 1";
          case "exam2":
            return "Devoir 2";
          case "partial":
            return "Partiel";
          case "remedial":
            return "Rattrapage";
          default:
            return "Examen";
        }
      };

      const onSubmit = async (data: any) => {
        alert(JSON.stringify(data));
        setIsLoading(true);
        await dispatch(releveCreateAction(data))
            .unwrap()
            .then((response: any) => {
            if (response.success) {
                toast.success(response.message);
                setReleveData((prevData) =>
                    prevData?.map((releve) => {
                      if (releve.id && data.notes[releve.id]) {
                        const updatedReleve = { ...releve }; 
                        const noteData = data.notes[releve.id]; 
            
                        switch (data.examType) {
                          case 'exam1':
                            updatedReleve.exam1 = noteData.note || updatedReleve.exam1;
                            updatedReleve.observation_exam1 =
                              noteData.observation || updatedReleve.observation_exam1;
                            break;
                          case 'exam2':
                            updatedReleve.exam2 = noteData.note || updatedReleve.exam2;
                            updatedReleve.observation_exam2 =
                              noteData.observation || updatedReleve.observation_exam2;
                            break;
                          case 'partial':
                            updatedReleve.partial = noteData.note || updatedReleve.partial;
                            updatedReleve.observation_partial =
                              noteData.observation || updatedReleve.observation_partial;
                            break;
                          case 'remedial':
                            updatedReleve.remedial =
                              noteData.note || updatedReleve.remedial;
                            updatedReleve.observation_remedial =
                              noteData.observation || updatedReleve.observation_remedial;
                            break;
                          default:
                            break;
                        }
            
                        return updatedReleve;
                      }
                      return releve;
                    })
                  );
                reset();
            } else {
                toast.error(response.message);
            }
            })
            .catch((error) => {
            toast.error("Erreur lors de la création");
            console.error(error);
            });
        setIsLoading(false);
      };

    useEffect(() => {
        if (ReleveTableRef.current) {      
            $(ReleveTableRef.current).DataTable({
              searching: true,
              lengthChange: true,
              info: true,
              paging: true,
              columns: releveColumns,
            });
        }
        return () => {
            if (ReleveTableRef.current) {
                $(ReleveTableRef.current).DataTable().destroy();
            }
        };
    }, []);

    useEffect(() => {    
        if (ReleveTableRef.current) {
            const datatable = $(ReleveTableRef.current).DataTable();
            
            const filteredData = releveData?.map(releve => {
                const exam1 = releve.exam1 !== null ? parseFloat(releve.exam1) : 'N/A';
                const exam2 = releve.exam2 !== null ? parseFloat(releve.exam2) : 'N/A';
                const partial = releve.partial !== null ? parseFloat(releve.partial) : 'N/A';
                const remedial = releve.remedial !== null ? parseFloat(releve.remedial) : 'N/A';
                const moy_exams = (exam1 !== 'N/A' && exam2 !== 'N/A')
                    ? (parseFloat(releve.exam1) + parseFloat(releve.exam2)) / 2
                    : 'N/A';
                const moy_general = (typeof releve.exam1 === 'number' && typeof releve.exam2 === 'number' && typeof releve.partial === 'number')
                    ? (releve.exam1 + releve.exam2 + releve.partial) / 3
                    : 'N/A';
    
                return {
                    id: releve.id ? releve.id : '',
                    name: releve.student ? releve.student.user.firstname + ' ' + releve.student.user.lastname : '',
                    exam1: `<span title="${releve.observation_exam1 || ''}" 
                            class="${exam1 !== 'N/A' && exam1 < 10 ? 'text-danger' : ''}">
                            ${exam1}
                        </span>`,
                    exam2: `<span title="${releve.observation_exam2 || ''}" 
                            class="${exam2 !== 'N/A' && exam2 < 10 ? 'text-danger' : ''}">
                            ${exam2}
                        </span>`,
                    moy_exams: `<span class="${moy_exams !== 'N/A' && moy_exams < 10 ? 'text-danger' : ''}">
                                ${moy_exams}
                            </span>`,
                    partial: `<span title="${releve.observation_partial || ''}" 
                              class="${partial !== 'N/A' && partial < 10 ? 'text-danger' : ''}">
                              ${partial}
                          </span>`,
                    moy_general: `<span class="${moy_general !== 'N/A' && moy_general < 10 ? 'text-danger' : ''}">
                                ${moy_general}
                            </span>`,
                    remedial: `<span title="${releve.observation_remedial || ''}" 
                              class="${remedial !== 'N/A' && remedial < 10 ? 'text-danger' : ''}">
                              ${remedial}
                          </span>`,
                    decision: releve.status ? releve.status : 'N/A'
                };
            });
    
            datatable.clear().draw();
            datatable.rows.add(filteredData || []).draw();
            datatable.columns.adjust().draw();
        }
    }, [releveData, ReleveTableRef]);
    

    return ( 
        <section>
            <div className="dashboard-body">
                <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
                    <div className="breadcrumb mb-24">
                        <ul className="flex-align gap-4">
                            <li><a href="index.html" className="text-gray-200 fw-normal text-15 hover-text-main-600">EasyUniv</a></li>
                            <li> <span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span> </li>
                            <li><span className="text-main-600 fw-normal text-15">Classes<i className="ph ph-caret-right"></i></span></li>
                            <li><span className="text-gray-500 fw-normal text-15">{cycle?.name} - {filiere?.name}</span><i className="ph ph-caret-right text-gray-500"></i></li>
                            <li><span className="text-gray-500 fw-normal text-15 cursor-pointer" onClick={() => onRetour(releveData)}>{matiere.name}</span><i className="ph ph-caret-right text-gray-500"></i></li>
                            <li><span className="text-main-600 fw-normal text-15">Relevé de notes</span></li>
                        </ul>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" className="border btn bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-pill py-8 px-20">
                            <i className="ph ph-caret-plus"></i> Générer Relevé
                        </button>
                        <button type="button" className="border btn-main rounded-pill py-8 px-20" data-bs-toggle="modal" data-bs-target="#releveCreate">
                            <i className="ph ph-caret-plus"></i> Ajouter Note
                        </button>
                    </div>
                </div>


                <div
                    className="modal fade"
                    id="releveCreate"
                    tabIndex={-1}
                    aria-labelledby="releveCreateLabel"
                    aria-hidden="true"
                >
                <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h1 className="modal-title fs-5" id="releveCreateLabel">
                                Mettre à jour le relevé
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                ></button>
                        </div>
                        <div className="modal-body p-24 text-gray-800">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group mb-20">
                                    <label htmlFor="examType">Type d'examen</label>
                                    <select
                                    {...register("examType", { required: true })}
                                    className={`form-control ${errors.examType ? "is-invalid" : ""}`}
                                    onChange={handleExamChange}
                                    >
                                        <option value="exam1">Devoir 1</option>
                                        <option value="exam2">Devoir 2</option>
                                        <option value="partial">Partiel</option>
                                        <option value="remedial">Rattrapage</option>
                                    </select>
                                    {errors.examType && (
                                        <div className="invalid-feedback">Le type d'examen est requis</div>
                                    )}
                                </div>
                                <table className="table table-hover table-striped text-xs">
                                    <thead>
                                    <tr>
                                        <th>Nom et Prénoms</th>
                                        <th>{getExamTitle()}</th>
                                        <th>Observation</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {releveData?.map((releve) => {
                                            if (!releve.id) return null;

                                            return (
                                            <tr key={releve.id}>
                                                <td>
                                                <div className="h-full w-full flex items-center justify-start">
                                                    <img
                                                    src={
                                                        releve.student?.user?.profile
                                                        ? `${process.env.NEXT_PUBLIC_HOST}/storage/${releve.student?.user?.profile}`
                                                        : "/assets/images/user_placeholder.jpg"
                                                    }
                                                    alt="profile image"
                                                    className="w-20 h-20 rounded-circle"
                                                    />
                                                    <span className="ml-2">
                                                    {releve.student?.user.firstname} {releve.student?.user.lastname}
                                                    </span>
                                                </div>
                                                </td>
                                                <td>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={20}
                                                    {...register(`notes.${releve.id}.note`, {
                                                    valueAsNumber: true,
                                                    })}
                                                    className={`form-control ${errors?.notes?.[releve.id]?.note ? "is-invalid" : ""}`}
                                                    placeholder={'Note (' + getExamTitle()+')'}
                                                />
                                                {errors?.notes?.[releve.id]?.note && (
                                                    <div className="invalid-feedback">
                                                    {errors.notes[releve.id]?.note?.message}
                                                    </div>
                                                )}
                                                </td>
                                                <td>
                                                <input
                                                    type="text"
                                                    {...register(`notes.${releve.id}.observation`)}
                                                    className={`form-control ${
                                                    errors?.notes?.[releve.id]?.observation ? "is-invalid" : ""
                                                    }`}
                                                    placeholder={'Observation (' + getExamTitle()+')'}
                                                />
                                                {errors?.notes?.[releve.id]?.observation && (
                                                    <div className="invalid-feedback">
                                                    {errors.notes[releve.id]?.observation?.message}
                                                    </div>
                                                )}
                                                </td>
                                            </tr>
                                            );
                                        })}
                                        </tbody>

                                </table>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-main">
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                </div>



                <div className="card overflow-hidden">
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-12 flex items-center gap-4 justify-around text-xs">
                                <div className="mt-20 text-gray-900 px-20 py-10 rounded bg-main-50">
                                    <h5 className="text-left mb-10 text-main-600">Chargé</h5>
                                    <div className="w-full flex flex-wrap justify-between items-center">
                                        <strong>Nom Complet : </strong>
                                        <span>{matiere.teacher?.firstname} {matiere.teacher?.lastname}</span>
                                    </div>
                                    <div className="w-full flex flex-wrap justify-between items-center">
                                        <strong>Téléphone : </strong>
                                        <span>{matiere.teacher?.phone}</span>
                                    </div>
                                    <div className="w-full flex flex-wrap justify-between items-center">
                                        <strong>Email : </strong>
                                        <span>{matiere.teacher?.email}</span>
                                    </div>
                                </div>

                                <div className="mt-20 text-gray-900 px-20 py-10 rounded bg-main-50 ">
                                    <h5 className="text-left mb-10 text-main-600">Cycle</h5>
                                    <div className="w-full flex flex-wrap justify-between items-center">
                                        <strong>Nom du Cycle : </strong>
                                        <span>{cycle?.name}</span>
                                    </div>
                                    <div className="w-full flex flex-wrap justify-between items-center">
                                        <strong>Description : </strong>
                                        <span>{cycle?.description || 'Aucune description'}</span>
                                    </div>
                                    <div className="w-full flex flex-wrap justify-between items-center">
                                        <strong>Durée du Cycle : </strong>
                                        <span>{cycle?.duration} années</span>
                                    </div>
                                </div>

                                <div className="mt-20 text-gray-900 px-20 py-10 rounded bg-main-50">
                                    <h5 className="text-left mb-10 text-main-600">Filière</h5>
                                    <div className="w-full flex flex-wrap justify-between items-center">
                                        <strong>Nom de la Filière : </strong>
                                        <span>{filiere?.name}</span>
                                    </div>
                                    <div className="w-full flex flex-wrap justify-between items-center">
                                        <strong>Intitule : </strong>
                                        <span>{filiere?.slug || 'Aucun intitulé'}</span>
                                    </div>
                                    <div className="w-full flex flex-wrap justify-between items-center">
                                        <strong>Description : </strong>
                                        <span>{filiere?.description || 'Aucune description'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 p-15">
                                <table ref={ReleveTableRef} className="table table-striped text-xs"></table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
     );
}
 
export default RelevesComponent;