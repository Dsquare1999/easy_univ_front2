"use client";
import {
  MatiereEntity,
  ProgramEntity,
} from "@/core/domain/entities/classe.entity";
import { CycleEntity } from "@/core/domain/entities/cycle.entity";
import { FiliereEntity } from "@/core/domain/entities/filiere.entity";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProgramSchema, ReportProgramSchema } from "@/core/application/schemas";
import { set, z } from "zod";
import { useAppDispatch } from "@/core/application/hooks";
import { programCreateAction, programDeleteAction, programReportAction, programUpdateAction } from "@/core/application/actions/matiere.action";
import { toast } from "react-toastify";
import { setStatus } from "@/core/application/slices/user.slice";

interface ProgramsComponentProps {
  cycle: CycleEntity | undefined;
  filiere: FiliereEntity | undefined;
  matiere: MatiereEntity;
  onRetour: (updatedPrograms: ProgramEntity[]) => void;
}

const ProgramsComponent = ({
  cycle,
  filiere,
  matiere,
  onRetour,
}: ProgramsComponentProps) => {
  const [programData, setProgramData] = useState<ProgramEntity[]>(
    matiere?.programs
  );
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [programSelected, setProgramSelected] = useState<ProgramEntity | null>(null)
  const [reason, setReason] = useState<string>("");

  useEffect(() => {
    setProgramData(matiere?.programs);
  }, [matiere]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof ProgramSchema>>({
    resolver: zodResolver(ProgramSchema),
  });

  const {
    register: reportRegister,
    handleSubmit: reportHandleSubmit,
    formState: { errors : reportErrors },
    reset : reportReset,
  } = useForm<z.infer<typeof ReportProgramSchema>>({
    resolver: zodResolver(ReportProgramSchema),
  });

  const handleUpdate = (programId: string) => {
    const program = programData?.find((program) => program.id === programId);
    if (program) {
      setIsUpdate(true);
      setProgramSelected(program);
    }
  }

  const handleStatusChange = (status: string, id?: string) => {
    setIsLoading(true);
    const program = programData?.find((program) => program.id === id);
    if(!program) {
      toast.error("Programme introuvable");
      setIsLoading(false);
      return;
    }
    if(reason === "" && status !== "EFFECTUE") {
      toast.error("Veuillez entrer une raison pour ce statut");
      setIsLoading(false);
      return
    }
    if(status === "EFFECTUE") {
      setReason("Aucune observation")
    }

    if (program && reason) {
      dispatch(programUpdateAction({ 
        id: program.id, 
        classe: matiere.classe,
        teacher: matiere.teacher?.id,
        matiere: matiere.id,
        day: program.day,
        h_begin: program.h_begin,
        h_end: program.h_end,
        status: status,
        observation: reason 
      })).unwrap()
        .then((response: any) => {
          if (response.success) {
            toast.success("Statut mis à jour avec succès");
            setProgramData((programs) => {
              const program = programs.map((program) =>
                program.id === response.data.id ? response.data : program
              );
              return program;
            });
            
          } else {
            toast.error(response.message);
          }
        })
        .catch((error) => {
          toast.error("Erreur lors de la mise à jour");
          console.error(error);
        });
      }
    setReason("");
    setIsLoading(false);
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const program = programData?.find((program) => program.id === id);
    if (program) {
      await dispatch(programDeleteAction({id}))
        .unwrap()
        .then((response: any) => {
          if (response.success) {
            toast.success("Programmation supprimée avec succès");
            setProgramData((programs) => programs.filter((program) => program.id !== id));
          } else {
            toast.error(response.message);
          }
        })
        .catch((error) => {
          toast.error("Erreur lors de la suppression");
          console.error(error);
        });
    }
    setIsLoading(false);
  }



  useEffect(() => {
    if (isUpdate && programSelected) {
      reset({
        day: programSelected.day,
        h_begin: programSelected.h_begin,
        h_end: programSelected.h_end,
        classe: matiere.classe,
        matiere: matiere.id,
        teacher: matiere.teacher?.id,
      });
    }
  }, [isUpdate, programSelected]);

  const onSubmit = async (values: any) => {
    setIsLoading(true);
  
    if (isUpdate) {
      await dispatch(programUpdateAction({ id: programSelected?.id, ...values }))
        .unwrap()
        .then((response: any) => {
          if (response.success) {
            toast.success("Programmation mise à jour avec succès");
            reset();
            setProgramData((programs) => {
              const program = programs.map((program) =>
                program.id === response.data.id ? response.data : program
              );
              return program;
            });
            setIsUpdate(false); 
          } else {
            toast.error(response.message);
          }
        })
        .catch((error) => {
          toast.error("Erreur lors de la mise à jour");
          console.error(error);
        });
    } else {
      await dispatch(programCreateAction(values))
        .unwrap()
        .then((response: any) => {
          if (response.success) {
            toast.success("Programmation ajoutée avec succès");
            setProgramData([...programData, response.data]);
            reset();
          } else {
            toast.error(response.message);
          }
        })
        .catch((error) => {
          toast.error("Erreur lors de la création");
          console.error(error);
        });
    }
    setIsLoading(false);
  };

  const onSubmitReport = async (values: any) => {
    setIsLoading(true);
    values.reported_id = programSelected?.id;
    await dispatch(programReportAction(values))
      .unwrap()
      .then((response: any) => {
        if (response.success) {

          setProgramData((prevPrograms) => {
            const updatedPrograms = prevPrograms.map((program) =>
              program.id === response.data[0].id ? response.data[0] : program
            );
  
            return [...updatedPrograms, response.data[1]];
          });
  
          toast.success("Programmation reportée avec succès");
          reportReset();
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        toast.error("Erreur lors du report");
        console.error(error);
      });
    setIsLoading(false);
  };

  return (
    <section>
      <div className="dashboard-body">
        <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
          <div className="breadcrumb mb-24">
            <ul className="flex-align gap-4">
              <li>
                <a
                  href="index.html"
                  className="text-gray-200 fw-normal text-15 hover-text-main-600"
                >
                  EasyUniv
                </a>
              </li>
              <li>
                {" "}
                <span className="text-gray-500 fw-normal d-flex">
                  <i className="ph ph-caret-right"></i>
                </span>{" "}
              </li>
              <li>
                <span className="text-main-600 fw-normal text-15">
                  Classes<i className="ph ph-caret-right"></i>
                </span>
              </li>
              <li>
                <span className="text-gray-500 fw-normal text-15">
                  {cycle?.name} - {filiere?.name}
                </span>
                <i className="ph ph-caret-right text-gray-500"></i>
              </li>
              <li>
                <span
                  className="text-gray-500 fw-normal text-15 cursor-pointer"
                  onClick={() => onRetour(programData)}
                >
                  {matiere.name}
                </span>
                <i className="ph ph-caret-right text-gray-500"></i>
              </li>
              <li>
                <span className="text-main-600 fw-normal text-15">
                  Programme
                </span>
              </li>
            </ul>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              className="border btn-main rounded-pill py-8 px-20"
              data-bs-toggle="modal"
              data-bs-target="#programCreate"
            >
              <i className="ph ph-caret-plus"></i> Ajouter Programme
            </button>
          </div>
        </div>

        <div
          className="modal fade"
          id="programCreate"
          tabIndex={-1}
          aria-labelledby="programCreateLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
            <div className="modal-content radius-16 bg-base">
              <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                <h1 className="modal-title fs-5" id="programCreateLabel">
                  
                  {isUpdate ? "Mettre à jour une programmation" : "Ajouter une programmation"}
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
                  <div className="row">
                    <input type="hidden" value={matiere.classe} {...register("classe")} />
                    <input type="hidden" value={matiere.id} {...register("matiere")} />
                    <input
                      type="hidden"
                      value={matiere.teacher?.id}
                      {...register("teacher")}
                    />

                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Jour :
                      </label>
                      <input
                        type="date"
                        className={`form-control radius-8 text-gray-700 ${
                          errors.day ? "is-invalid" : ""
                        }`}
                        placeholder="Entrez la date"
                        {...register("day")}
                      />
                      {errors.day && (
                        <p className="text-danger">{errors.day.message}</p>
                      )}
                    </div>

                    <div className="col-md-6 mb-20">
                      <label
                        htmlFor="h_begin"
                        className="form-label fw-semibold text-primary-light text-sm mb-8 text-gray-700"
                      >
                        Heure début
                      </label>
                      <div className="position-relative">
                        <input
                          className={`form-control radius-8 bg-base ${
                            errors.h_begin ? "is-invalid" : ""
                          }`}
                          id="h_begin"
                          type="time"
                          {...register("h_begin")}
                        />

                        {errors.h_begin && <p className="text-danger">{errors.h_begin.message}</p>}
                         
                      </div>
                    </div>

                    <div className="col-md-6 mb-20">
                      <label
                        htmlFor="h_end"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Heure fin
                      </label>
                      <div className="position-relative">
                        <input
                          className={`form-control radius-8 bg-base text-gray-700 ${
                            errors.h_end ? "is-invalid" : ""
                          }`}
                          id="h_end"
                          type="time"
                          {...register("h_end")}
                        />
                        {errors.h_end && <p className="text-danger">{errors.h_end.message}</p>}

                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-center gap-8 mt-24">
                      <button
                        type="reset"
                        disabled={isLoading}
                        className="btn bg-danger-600 hover-bg-danger-800 border-danger-600 hover-border-danger-800 text-md px-24 py-12 radius-8"
                        onClick={() => reset()}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="btn bg-main-600 hover-bg-main-800 border-main-600 hover-border-main-800 text-md px-24 py-12 radius-8"
                        disabled={isLoading}
                      >
                        {isUpdate ? isLoading ? "Mise à jour en cours" : "Mettre à jour" : isLoading? "Ajout en cours" : "Ajouter"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="programReport"
          tabIndex={-1}
          aria-labelledby="programReportLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
            <div className="modal-content radius-16 bg-base">
              <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                <h1 className="modal-title fs-5" id="programReportLabel">
                  Reporter une programmation
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-24 text-gray-800">
                <form onSubmit={reportHandleSubmit(onSubmitReport)}>
                  <div className="row">
                    <input type="hidden" value={matiere.classe} {...reportRegister("classe")} />
                    <input type="hidden" value={matiere.id} {...reportRegister("matiere")} />
                    <input
                      type="hidden"
                      value={matiere.teacher?.id}
                      {...reportRegister("teacher")}
                    />
                    <input type="hidden" value="REPORTE" {...reportRegister("reported_status")} />

                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Raison :
                      </label>
                      <input
                        type="text"
                        {...reportRegister("reported_observation")}
                        className={`form-control radius-8 text-gray-700`}
                        placeholder="Entrez la raison de ce report"
                      />
                    </div>
                    <h5 className="text-left my-10 text-main-600">Programmation du report</h5>
                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Jour :
                      </label>
                      <input
                        type="date"
                        className={`form-control radius-8 text-gray-700 ${
                          reportErrors.day ? "is-invalid" : ""
                        }`}
                        placeholder="Entrez la date"
                        {...reportRegister("day")}
                      />
                      {reportErrors.day && (
                        <p className="text-danger">{reportErrors.day.message}</p>
                      )}
                    </div>

                    <div className="col-md-6 mb-20">
                      <label
                        htmlFor="h_begin"
                        className="form-label fw-semibold text-primary-light text-sm mb-8 text-gray-700"
                      >
                        Heure début
                      </label>
                      <div className="position-relative">
                        <input
                          className={`form-control radius-8 bg-base ${
                            reportErrors.h_begin ? "is-invalid" : ""
                          }`}
                          id="h_begin"
                          type="time"
                          {...reportRegister("h_begin")}
                        />

                        {reportErrors.h_begin && <p className="text-danger">{reportErrors.h_begin.message}</p>}
                         
                      </div>
                    </div>

                    <div className="col-md-6 mb-20">
                      <label
                        htmlFor="h_end"
                        className="form-label fw-semibold text-primary-light text-sm mb-8"
                      >
                        Heure fin
                      </label>
                      <div className="position-relative">
                        <input
                          className={`form-control radius-8 bg-base text-gray-700 ${
                            reportErrors.h_end ? "is-invalid" : ""
                          }`}
                          id="h_end"
                          type="time"
                          {...reportRegister("h_end")}
                        />
                        {reportErrors.h_end && <p className="text-danger">{reportErrors.h_end.message}</p>}

                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-center gap-8 mt-24">
                      <button
                        type="reset"
                        disabled={isLoading}
                        className="btn bg-danger-600 hover-bg-danger-800 border-danger-600 hover-border-danger-800 text-md px-24 py-12 radius-8"
                        onClick={() => reset()}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="btn bg-main-600 hover-bg-main-800 border-main-600 hover-border-main-800 text-md px-24 py-12 radius-8"
                        disabled={isLoading}
                      >
                        {isLoading ? "Report en cours" : "Reporter" }
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="programSetStatus"
          tabIndex={-1}
          aria-labelledby="programSetStatusLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
            <div className="modal-content radius-16 bg-base">
              <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                <h1 className="modal-title fs-5" id="programSetStatusLabel">
                  Annuler une programmation
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-24 text-gray-800">
                    <div className="col-12 mb-20">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Raison :
                      </label>
                      <input
                        type="text"
                        id="raison"
                        onChange={(e) => setReason(e.target.value)}
                        className={`form-control radius-8 text-gray-700`}
                        placeholder="Entrez la raison de ce statut"
                      />
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-8 mt-24">
                      <button
                        type="reset"
                        disabled={isLoading}
                        className="btn bg-danger-600 hover-bg-danger-800 border-danger-600 hover-border-danger-800 text-md px-24 py-12 radius-8"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleStatusChange('ANNULE', programSelected?.id)}
                        className="btn bg-main-600 hover-bg-main-800 border-main-600 hover-border-main-800 text-md px-24 py-12 radius-8"
                        disabled={isLoading}
                      >
                        {isLoading ? "Mise à jour en cours" : "Mettre à jour"}
                      </button>
                    </div>
              </div>
              
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="card-body p-0">
            <div className="row p-16">
              <div className="col-4">
                <div className="mt-20 text-gray-900 px-10 py-10 rounded bg-main-50">
                  <h5 className="text-left mb-10 text-main-600">Chargé</h5>
                  <div className="w-full flex flex-wrap justify-between items-center">
                    <strong>Nom Complet : </strong>
                    <span>
                      {matiere.teacher?.firstname} {matiere.teacher?.lastname}
                    </span>
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

                <div className="mt-20 text-gray-900 px-10 py-10 rounded bg-main-50 ">
                  <h5 className="text-left mb-10 text-main-600">Cycle</h5>
                  <div className="w-full flex flex-wrap justify-between items-center">
                    <strong>Nom du Cycle : </strong>
                    <span>{cycle?.name}</span>
                  </div>
                  <div className="w-full flex flex-wrap justify-between items-center">
                    <strong>Description : </strong>
                    <span>{cycle?.description || "Aucune description"}</span>
                  </div>
                  <div className="w-full flex flex-wrap justify-between items-center">
                    <strong>Durée du Cycle : </strong>
                    <span>{cycle?.duration} années</span>
                  </div>
                </div>

                <div className="mt-20 text-gray-900 px-10 py-10 rounded bg-main-50">
                  <h5 className="text-left mb-10 text-main-600">Filière</h5>
                  <div className="w-full flex flex-wrap justify-between items-center">
                    <strong>Nom de la Filière : </strong>
                    <span>{filiere?.name}</span>
                  </div>
                  <div className="w-full flex flex-wrap justify-between items-center">
                    <strong>Intitule : </strong>
                    <span>{filiere?.slug || "Aucun intitulé"}</span>
                  </div>
                  <div className="w-full flex flex-wrap justify-between items-center">
                    <strong>Description : </strong>
                    <span>{filiere?.description || "Aucune description"}</span>
                  </div>
                </div>
              </div>
              <div className="col-8">
                {programData?.length === 0 && (
                  <div className="alert alert-info">
                    Aucun programme n'est disponible pour cette matière
                  </div>
                )}
                {programData?.map((program, index) => (
                  <div
                    className="card gap-4 mt-24 overflow-hidden bg-main-50"
                    id={program?.id}
                    key={index}
                  >
                    <div className="card-body p-16 flex justify-between">
                      <div>
                        <h5 className="text-main-600">{matiere?.name}
                          {program.status === 'EN ATTENTE' && <>
                            <i data-bs-toggle="modal"
                              data-bs-target="#programCreate" 
                              onClick={() => handleUpdate(program?.id)} 
                              className="ml-2 ph ph-pencil p-4 rounded-full bg-main-700 text-white">
                            </i>
                            <i
                              onClick={() => handleDelete(program?.id)} 
                              className="ml-2 ph ph-trash p-4 rounded-full bg-danger text-white">
                            </i>
                          </>}
                        </h5> 
                        <p className="text-main-600">{matiere?.libelle}</p>
                      </div>
                      <div>
                        <div className="w-full flex flex-wrap justify-between items-center">
                          <strong className="mr-2">Jour : </strong>
                          <span>{program?.day || "Aucune description"}</span>
                        </div>
                        <div className="w-full flex flex-wrap justify-between items-center">
                          <strong className="mr-2">Horaire : </strong>
                          <span>
                            {program?.h_begin} - {program?.h_end}
                          </span>
                        </div>
                        <div className="w-full flex flex-wrap justify-between items-center">
                          <strong className="mr-2">Statut : </strong>
                          <span
                            className={
                              program?.status === "ANNULE" ||
                              program?.status === "REPORTE"
                                ? "text-danger"
                                : program?.status === "EFFECTUE"
                                ? "text-emerald-600"
                                : ""
                            }
                          >
                            {program?.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {program?.status === "REPORTE" ||
                    program?.status === "ANNULE" ||
                    program?.status === "EFFECTUE" ? (
                      <div className="p-16">
                        {program?.status === "ANNULE" && (
                          <>
                            <div className="alert alert-danger">
                              Ce programme a été annulé
                              <div className="w-full flex flex-wrap items-center">
                                <strong className="text-danger mr-2">
                                  Raison :{" "}
                                </strong>
                                <span>{program?.observation}</span>
                              </div>
                            </div>
                          </>
                        )}
                        {program?.status === "REPORTE" && (
                          <>
                            <div className="alert alert-warning">
                              Ce programme a été reporté
                              <div className="w-full flex flex-wrap items-center">
                                <strong className="text-warning mr-2">
                                  Raison :{" "}
                                </strong>
                                <span>{program?.observation}</span>
                              </div>
                              <p className="text-right">
                                <strong>Reporté</strong> au{" "}
                                <a href={"#" + program.report?.id}>
                                  {program.report?.day} -{" "}
                                  {program.report?.h_begin} :{" "}
                                  {program.report?.h_end}
                                </a>
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="card-footer">
                        <div className="flex justify-between">
                          <button
                            type="button"
                            className="border btn btn-main rounded-pill py-8 px-20"
                            onClick={() => handleStatusChange("EFFECTUE", program.id)}
                          >
                            <i className="ph ph-check-fat"></i> Marquer effectué
                          </button>
                          <button
                            type="button"
                            className="border btn bg-emerald-500 hover:bg-emerald-700 rounded-pill py-8 px-20"
                            onClick={() => handleUpdate(program?.id)} 
                            data-bs-toggle="modal"
                            data-bs-target="#programReport"
                          >
                            <i className="ph ph-calendar"></i> Marquer reporté
                          </button>
                          <button
                            type="button"
                            className="border btn btn-danger rounded-pill py-8 px-20"
                            onClick={() => handleUpdate(program?.id)} 
                            data-bs-toggle="modal"
                            data-bs-target="#programSetStatus"
                          >
                            <i className="ph ph-x"></i> Marquer annulé
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsComponent;
