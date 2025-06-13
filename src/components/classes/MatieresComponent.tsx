'use client'

import { matiereCreateAction, matiereDeleteAction, matiereListAction, matiereUpdateAction } from "@/core/application/actions/matiere.action";
import { useAppDispatch } from "@/core/application/hooks";
import { ClasseEntity, MatiereEntity, ProgramEntity, ReleveEntity } from "@/core/domain/entities/classe.entity";
import { UserEntity } from "@/core/domain/entities/user.entity";
import { zodResolver } from "@hookform/resolvers/zod";
import Select  from "react-select";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreateMatiereSchema, CreateMatiereType, UniteType, UpdateMatiereSchema, UpdateMatiereType } from "@/core/application/schemas";
import RelevesComponent from "./RelevesComponent";
import ProgramsComponent from "./ProgramsComponent";
import { releveGenerateAction } from '@/core/application/actions/matiere.action';

interface MatieresComponentProps {
    classe: ClasseEntity;
    unites: UniteType[];
    teachers : UserEntity[] | undefined
    onRetour: (updatedMatieres: MatiereEntity[]) => void;
}
const MatieresComponent = ({classe, unites, teachers, onRetour} : MatieresComponentProps) => {

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [matiereData, setMatiereData] = useState<MatiereEntity[]>(classe.matieres ?? []);

    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [selectedUnite, setSelectedUnite] = useState<any>(null);
    const [selectPrograms, setSelectPrograms] = useState<boolean>(false);
    const [selectReleves, setSelectReleves] = useState<boolean>(false);
    const [selectedMatiere, setSelectedMatiere] = useState<MatiereEntity | undefined>(undefined);
    const [selectedPart, setSelectedPart] = useState<any>(null);

    const MatiereTableRef = useRef<HTMLTableElement>(null);

    const [editingMatiere, setEditingMatiere] = useState<MatiereEntity | null>(null);

    const handleDetailsClick = (matiere: MatiereEntity | undefined) => {
        setSelectedMatiere(matiere);
      };
    
    const handleReleveRetourClick = (updatedReleves: ReleveEntity[]) => {
        setSelectedMatiere(undefined);
        setMatiereData((prevData) =>
            prevData?.map((item) =>
                item.id === selectedMatiere?.id ? { ...item, releves: updatedReleves } : item
            )
        );
    };
    const handleProgramRetourClick = (updatedPrograms: ProgramEntity[]) => {
        setSelectedMatiere(undefined);
        setMatiereData((prevData) =>
            prevData?.map((item) =>
                item.id === selectedMatiere?.id ? { ...item, programs: updatedPrograms } : item
            )
        );
    };
    const matiereColumns = [
        { data: "id", visible: false },
        { data: "unite.code", title: "UE" },
        { data: "code", title: "Code" },
        { data: "name", title: "Intitulé" },
        { data: "teacher", title: "Chargé" },
        { data: "hours", title: "Quotat horaire" },
        { data: "coefficient", title: "Coefficient" },
        {
            title: "Actions",
            data: "modify",
            orderable: false,
            render: function (_data: any, _type: any, row: any) {
              return `<button class="matiere-programs btn btn-warning rounded-4 py-4 px-10 text-sm mr-1" data-id="${row.id}">Programmes</button>`+
                     `<button class="matiere-releves btn bg-emerald-600 hover:bg-emerald-800 rounded-4 py-4 px-10 text-sm mr-1" data-id="${row.id}">Relevés</button>`+
                     `<button class="matiere-update btn btn-main rounded-4 py-4 px-10 text-sm mr-1" data-bs-toggle="modal" data-bs-target="#matiereUpdate" data-id="${row.id}">Modifier</button>` +
                     `<button class="matiere-delete btn btn-danger rounded-4 py-4 px-10 text-sm" data-id="${row.id}">Supprimer</button>`
            }
        }
    ];

    useEffect(() => {
        if (MatiereTableRef.current) {      
            $(MatiereTableRef.current).DataTable({
              searching: true,
              lengthChange: true,
              info: true,
              paging: true,
              columns: matiereColumns,
            });

            const datatable = $(MatiereTableRef.current).DataTable()

            $(MatiereTableRef.current).on('click', '.matiere-update', function () {
                const rowId = $(this).data('id');
                const matiere = matiereData?.find((item) => item.id === rowId);
                if (matiere) {
                    setEditingMatiere(matiere);
                    setValueUpdate("code", matiere.code);
                    setValueUpdate("name", matiere.name);
                    setValueUpdate("unite", matiere.unite);
                    setValueUpdate("hours", matiere.hours);
                    setValueUpdate("coefficient", matiere.coefficient);
                    setValueUpdate("teacher", matiere.teacher?.id);
                    setValueUpdate("year_part", matiere.year_part);
                    setSelectedTeacher(teacherOptions?.find(option => option.value === matiere.teacher?.id))
                    setSelectedPart(partsOptions?.find(option => option.value === matiere.year_part.toString()))
                }
                
            });

            $(MatiereTableRef.current).on('click', '.matiere-releves', function () {
                setSelectPrograms(false);
                setSelectReleves(true);
                handleDetailsClick(matiereData?.find((item) => item.id === $(this).data('id')));
            });

            $(MatiereTableRef.current).on('click', '.matiere-programs', function () {
                setSelectPrograms(true);
                setSelectReleves(false);
                handleDetailsClick(matiereData?.find((item) => item.id === $(this).data('id')));
            });

            $(MatiereTableRef.current).on('click', '.matiere-delete', function () {
                const id = $(this).data('id');
                const matiere = matiereData?.find((item) => item.id === id);
                setIsLoading(true)
                if (matiere) {
                    dispatch(matiereDeleteAction({id}))
                        .unwrap()
                        .then((response: any) => {
                            if (response.success) {
                                toast.success("Matière supprimée avec succès");
                                setMatiereData((prevData) => [
                                    ...(prevData || []).filter((item) => item.id !== id),
                                ]);
                                resetCreate();
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
                
            });
        }
        return () => {
            if (MatiereTableRef.current) {
                $(MatiereTableRef.current).off('click', '.matiere-programs');
                $(MatiereTableRef.current).off('click', '.matiere-releves');
                $(MatiereTableRef.current).off('click', '.matiere-update');
                $(MatiereTableRef.current).off('click', '.matiere-delete');
                $(MatiereTableRef.current).DataTable().destroy();
            }
        };
    }, [matiereData]);

    useEffect(() => {    
        if (MatiereTableRef.current) {
            const datatable = $(MatiereTableRef.current).DataTable()   
            const filteredData = matiereData?.map(matiere => ({
                id: matiere.id ? matiere.id : '',
                unite: matiere.unite ? matiere.unite : '',
                code: matiere.libelle ? matiere.libelle : '',
                name: matiere.name ? matiere.name : '',
                teacher: matiere.teacher ? matiere.teacher.lastname + ' ' + matiere.teacher.firstname : 'Non défini',
                hours: matiere.hours ? matiere.hours : '',
                coefficient: matiere.coefficient ? matiere.coefficient : '',
            }));

            datatable.clear().draw();
            datatable.rows.add(filteredData || []).draw();
            datatable.columns.adjust().draw();
        }
    }, [matiereData, MatiereTableRef]);


    const {
        register: registerCreate,
        setValue: setValueCreate,
        handleSubmit: handleSubmitCreate,
        formState: { errors: errorsCreate },
        reset: resetCreate,
    } = useForm<CreateMatiereType>({
        resolver: zodResolver(CreateMatiereSchema),
    });
    
    const {
        register: registerUpdate,
        setValue: setValueUpdate,
        handleSubmit: handleSubmitUpdate,
        formState: { errors: errorsUpdate },
        reset: resetUpdate,
    } = useForm<UpdateMatiereType>({
        resolver: zodResolver(UpdateMatiereSchema),
    });


    const handleChangeTeacher = (selectedOption: any) => {
        if(selectedOption){
            setValueCreate("teacher", selectedOption.value);
        }
    };
    const handleChangeYearPart = (selectedOption: any) => {
        if(selectedOption){
            setValueCreate("year_part", parseInt(selectedOption.value));
        }
    };
    const handleChangeUnite = (selectedOption: any) => {
        if(selectedOption){
            setValueCreate("unite", selectedOption.value);
        }
    }


    const handleUpdateTeacher = (selectedOption: any) => {
        if(selectedOption){
            setValueUpdate("teacher", selectedOption.value);
            setSelectedTeacher(selectedOption);
        }
    };
    const handleUpdateYearPart = (selectedOption: any) => {
        if(selectedOption){
            setValueUpdate("year_part", parseInt(selectedOption.value));
            setSelectedPart(selectedOption);

        }
    };
    const handleUpdateUnite = (selectedOption: any) => { 
        if(selectedOption){
            setValueUpdate("unite", selectedOption.value);
            setSelectedUnite(selectedOption);
        }
    }


    const unitesOptions = unites.map(unite => ({
        value: unite.id,
        label: unite.name
    }));

    const teacherOptions = teachers?.map(teacher => ({
        value: teacher.id,
        label: (
            <div className="flex items-center">
                <img 
                    src={teacher?.profile ? `${process.env.NEXT_PUBLIC_HOST}/storage/${teacher?.profile}` :  "/assets/images/user_placeholder.jpg"} 
                    alt="" 
                    className="w-32 h-32 object-cover object-center rounded-full shadow-sm mr-2" 
                />
                <span className="text-gray-800">{teacher.lastname} {teacher.firstname}</span>
            </div>
        )
    }));

    
    const partsOptions = classe?.parts === "SEM"
    ? [
        { label: "1er semestre", value: "1" },
        { label: "2e semestre", value: "2" }
      ]
    : classe?.parts === "TRI"
    ? [
        { label: "1er trimestre", value: "1" },
        { label: "2e trimestre", value: "2" },
        { label: "3e trimestre", value: "3" }
      ]
    : [];

    const onSubmit = async (values: CreateMatiereType) => {
        values.classe = classe ? classe.id : "";
        setIsLoading(true)
        await dispatch(matiereCreateAction(values))
            .unwrap()
            .then((response: any) => {
                if (response.success) {
                    toast.success("Matière créée avec succès");
                    setMatiereData((prevData) => [
                        ...(prevData || []),
                        response.data,
                    ]);
                    resetCreate();
                } else {
                    toast.error(response.message);
                }
            })
            .catch((error) => {
                toast.error("Erreur lors de la création");
                console.error(error);
            });
        
        setEditingMatiere(null)
        setIsLoading(false);
  
    };

    const onUpdateSubmit = async (values: UpdateMatiereType) => {
        alert(JSON.stringify(values))
        values.classe = classe ? classe.id : "";
        alert(JSON.stringify(values))
        setIsLoading(true)
        if (editingMatiere) {
            values.id = editingMatiere.id ?? "";
            await dispatch(matiereUpdateAction(values))
                .unwrap()
                .then((response: any) => {
                    if (response.success) {
                        toast.success("Matière mise à jour avec succès");
                        setMatiereData((prevData) => 
                            prevData?.map((item) =>
                                item.id === response.data.id ? response.data : item
                            )
                        );
                        resetUpdate();
                    } else {
                        toast.error(response.message);
                    }
                })
                .catch((error) => {
                    toast.error("Erreur lors de la mise à jour");
                    console.error(error);
                });
        }
        
        setEditingMatiere(null)
        setIsLoading(false);
  
    };

    const handleGenerateReleve = async () => { 
        setIsLoading(true);
        if (!classe.id){
            toast.error("Impossible de générer le relevé. Veuillez préciser une matière !");
            setIsLoading(false);
            return;
        } 
        const id = classe.id
        await dispatch(releveGenerateAction({id}))
            .unwrap()
            .then((response: any) => {
                if (response.success) {
                    toast.success(response.message);
                    // setReleveData(response.data);
                } else {
                    toast.error(response.message);
                }
            })
            .catch((error) => {
                toast.error("Erreur lors de la génération du relevé");
                console.error(error);
            });
        setIsLoading(false);
    }


    return ( 
        selectedMatiere && selectReleves ? (
            <RelevesComponent cycle={classe?.cycle} filiere={classe?.filiere} matiere={selectedMatiere} onRetour={handleReleveRetourClick} />
        )
        :
        selectedMatiere && selectPrograms ? (
            <ProgramsComponent cycle={classe?.cycle} filiere={classe?.filiere} matiere={selectedMatiere} onRetour={handleProgramRetourClick} />
        )
        :
        (
        <section>
            <div className="dashboard-body">
                <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
                    <div className="breadcrumb mb-24">
                        <ul className="flex-align gap-4">
                            <li><a href="index.html" className="text-gray-200 fw-normal text-15 hover-text-main-600">EasyUniv</a></li>
                            <li> <span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span> </li>
                            <li><span className="text-main-600 fw-normal text-15 cursor-pointer" onClick={() => onRetour(matiereData)}>Classes<i className="ph ph-caret-right"></i></span></li>
                            <li><span className="text-gray-500 fw-normal text-15">{classe?.cycle.name} - {classe?.filiere.name}</span></li>
                        </ul>
                    </div>
                    <div className="flex gap-1">
                        <button type="button" className="border btn btn-warning rounded-pill py-8 px-20" data-bs-toggle="modal" data-bs-target="">
                            <i className="ph ph-plus"></i> Soumettre Emploi du Temps
                        </button>
                        <button type="button" className="border btn bg-emerald-600 hover:bg-emerald-800 active:bg-emerald-600 rounded-pill py-8 px-20" onClick={handleGenerateReleve}>
                            <i className="ph ph-plus"></i> Générer Résultat
                        </button>
                        <button type="button" className="border btn-main rounded-pill py-8 px-20 text-white" data-bs-toggle="modal" data-bs-target="#matiereCreate">
                            <i className="ph ph-plus"></i> Ajouter Matière
                        </button>
                    </div>
                    

                    <div className="modal fade" id="matiereCreate" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={handleSubmitCreate(onSubmit)}>
                                    
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="matiere-add-title">Ajouter une Matière</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <input 
                                            type="text" 
                                            id="code" 
                                            className="form-control mb-20" 
                                            placeholder="Code de l'ECUE" 
                                            {...registerCreate("code")} />
                                            {errorsCreate.code && <p className="text-danger">{errorsCreate.code.message}</p>}

                                        <input 
                                            type="text" 
                                            id="name" 
                                            className="form-control mb-20" 
                                            placeholder="Intitulé de la matière" 
                                            {...registerCreate("name")} />
                                            {errorsCreate.name && <p className="text-danger">{errorsCreate.name.message}</p>}

                                        <div className="mb-20 text-gray-800">
                                            <Select 
                                                id="unite"
                                                options={unitesOptions}
                                                placeholder="Sélectionnez Unité d'Enseignement"
                                                onChange={handleChangeUnite} 
                                                onBlur={() => {}} 
                                            />
                                            {errorsCreate.unite && <p className="text-danger">{errorsCreate.unite.message}</p>}
                                        </div>

                                        <div className="input-group mb-20">
                                            <input
                                                type="number"
                                                id="hours"
                                                className="form-control"
                                                placeholder="Quotat horaire"
                                                {...registerCreate("hours", {
                                                    setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                                                })}
                                            />

                                                
                                            <div className="input-group-append">
                                                <span className="input-group-text h-full" id="basic-addon2">heures</span>
                                            </div>
                                            {errorsCreate.hours && <p className="text-danger">{errorsCreate.hours.message}</p>}
                                        </div>
                                        <div className="input-group mb-20">
                                            <input
                                                type="number"
                                                id="coefficient"
                                                className="form-control"
                                                placeholder="Coefficient de la matière"
                                                {...registerCreate("coefficient", {
                                                    setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                                                })}
                                            />
                                                
                                            <div className="input-group-append">
                                                <span className="input-group-text h-full" id="basic-addon2">crédits</span>
                                            </div>
                                            {errorsCreate.coefficient && <p className="text-danger">{errorsCreate.coefficient.message}</p>}
                                        </div>

                                        <div className="mb-20 text-gray-800">
                                            <Select 
                                                id="year_part"
                                                options={partsOptions}
                                                placeholder="Sélectionnez une période de cycle"
                                                onChange={handleChangeYearPart} 
                                                onBlur={() => {}} 
                                            />
                                            {errorsCreate.year_part && <p className="text-danger">{errorsCreate.year_part.message}</p>}
                                        </div>

                                        <div className="mb-20 text-gray-800">
                                            <Select
                                                id="teacher"
                                                options={teacherOptions}
                                                placeholder="Sélectionnez un professeur"
                                                onChange={handleChangeTeacher} 
                                                onBlur={() => {}} 
                                                className="text-gray-800"
                                            />
                                            {errorsCreate.teacher && <p className="text-danger">{errorsCreate.teacher.message}</p>}

                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary py-9" data-bs-dismiss="modal">Fermer</button>
                                        <button
                                            type="submit"
                                            className="btn btn-main py-9"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Ajout en cours..." : "Ajouter"}
                                        </button>
                                    </div>
                                
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="matiereUpdate" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={handleSubmitUpdate(onUpdateSubmit)}>
                                    
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="matiere-add-title">Modifier une Matière</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <input 
                                            type="text" 
                                            id="updated-code" 
                                            className="form-control mb-20" 
                                            placeholder="Code de l'ECUE"
                                            {...registerUpdate("code")}
                                        />
                                        {errorsUpdate.code && <p className="text-danger">{errorsUpdate.code.message}</p>}

                                        <input 
                                            type="text" 
                                            id="updated-name" 
                                            className="form-control mb-20" 
                                            placeholder="Intitulé de la matière" 
                                            {...registerUpdate("name")} 
                                        />
                                        {errorsUpdate.name && <p className="text-danger">{errorsUpdate.name.message}</p>}
                                        <div className="mb-20 text-gray-800">
                                            <Select 
                                                id="updated-unite"
                                                options={unitesOptions}
                                                placeholder="Sélectionnez Unité d'Enseignement"
                                                onChange={handleUpdateUnite} 
                                                value={selectedUnite}
                                                menuPlacement="bottom"
                                                openMenuOnFocus={true}
                                                onBlur={() => {}} 
                                            />
                                            {errorsUpdate.unite && <p className="text-danger">{errorsUpdate.unite.message}</p>}
                                        </div>
                                        <div className="input-group mb-20">
                                            <input
                                                type="number"
                                                id="updated-hours"
                                                className="form-control"
                                                placeholder="Quotat horaire"
                                                {...registerUpdate("hours", {
                                                    setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                                                })}
                                            />

                                                
                                            <div className="input-group-append">
                                                <span className="input-group-text h-full" id="basic-addon2">heures</span>
                                            </div>
                                            {errorsUpdate.hours && <p className="text-danger">{errorsUpdate.hours.message}</p>}
                                        </div>
                                        <div className="input-group mb-20">
                                            <input
                                                type="number"
                                                id="updated-coefficient"
                                                className="form-control"
                                                placeholder="Coefficient de la matière"
                                                {...registerUpdate("coefficient", {
                                                    setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                                                })}
                                            />
                                                
                                            <div className="input-group-append">
                                                <span className="input-group-text h-full" id="basic-addon2">crédits</span>
                                            </div>
                                            {errorsUpdate.coefficient && <p className="text-danger">{errorsUpdate.coefficient.message}</p>}
                                        </div>

                                        <div className="mb-20 text-gray-800">
                                            <Select 
                                                id="updated-year_part"
                                                options={partsOptions}
                                                placeholder="Sélectionnez une période de cycle"
                                                onChange={handleUpdateYearPart} 
                                                value={selectedPart}
                                                menuPlacement="bottom"
                                                openMenuOnFocus={true}
                                                onBlur={() => {}} 
                                            />
                                            {errorsUpdate.year_part && <p className="text-danger">{errorsUpdate.year_part.message}</p>}
                                        </div>

                                        <div className="mb-20 text-gray-800">
                                            <Select
                                                id="updated-teacher"
                                                options={teacherOptions}
                                                placeholder="Sélectionnez un professeur"
                                                onChange={handleUpdateTeacher} 
                                                menuPlacement="top"
                                                openMenuOnFocus={true}
                                                value={selectedTeacher}
                                                onBlur={() => {}} 
                                                className="text-gray-800"
                                            />
                                            {errorsUpdate.teacher && <p className="text-danger">{errorsUpdate.teacher.message}</p>}

                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary py-9" data-bs-dismiss="modal">Fermer</button>
                                        <button
                                            type="submit"
                                            className="btn btn-main py-9"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Modification en cours..." : "Modifier"}
                                        </button>
                                    </div>
                                
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card overflow-hidden">
                    <div className="card-body p-0">
                        <table ref={MatiereTableRef} id="assignmentTable" className="table table-striped text-xs"></table>
                    </div>
                </div>
            </div>
        </section>
        )
        
     );
}
 
export default MatieresComponent;