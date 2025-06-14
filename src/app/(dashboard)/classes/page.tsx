"use client"

import $ from "jquery";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/core/application/hooks";
import { CycleEntity } from "@/core/domain/entities/cycle.entity";
import { useForm } from "react-hook-form";
import { ClasseSchema, UniteType } from "@/core/application/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Form } from "@/components/ui/form";
import { FiliereEntity } from "@/core/domain/entities/filiere.entity";
import { ClasseEntity, MatiereEntity } from "@/core/domain/entities/classe.entity";
import { classeCreateAction, classeListAction, studentCreateAction, studentLeaveAction } from "@/core/application/actions/classe.action";
import MatieresComponent from "@/components/classes/MatieresComponent";
import { UserEntity } from '@/core/domain/entities/user.entity';
import CalendarProgramsComponent from '@/components/classes/CalendarProgramsComponent';
import { useSession } from "next-auth/react";

const Classes = () => {
    require('datatables.net-bs5');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { data: session } = useSession();
    const [tableData, setTableData] = useState([]);

    const [tabSelected, setTabSelected] = useState<'Matiere' | 'Program' | 'Classe'>('Classe');
    const [selectedClasse, setSelectedClasse] = useState<ClasseEntity | undefined>(undefined);
    
    const [classeData, setClasseData] = useState<ClasseEntity[] | undefined>(undefined);
    const [filiereData, setFiliereData] = useState<FiliereEntity[] | undefined>(undefined);
    const [uniteData, setUniteData] = useState<UniteType[]>([]);
    const [cycleData, setCycleData] = useState<CycleEntity[] | undefined>(undefined);
    const [myClassesData, setMyClassesData] = useState<string[] | undefined>(undefined);
    const [teacherData, setTeacherData] = useState<UserEntity[] | undefined>(undefined);

    const [shouldFetchClasses, setShouldFetchClasses] = useState(0);

    const toggleAction = (tab:'Matiere' | 'Program' | 'Classe') => {
        setTabSelected(tab);
    }

    const tableRef = useRef<HTMLTableElement>(null);

    const classeColumns = [
        { data: "id", visible: false },
        { data: "cycle", title: "Cycle" },
        { data: "filiere", title: "Filière" },
        { data: "year", title: "Année" },
        { 
            data: "parts", 
            title: "Calendrier",
            render: function (_data: any, _type: any, row: any) {
                return row.parts === 'TRI' ? 'Trimestre' : 'Semestre';
            }
        },
        { data: "academic_year", title: "Année Académique" },
        { data: "classe", visible: false },
        {
            title: "Actions",
            data: "registered",
            orderable: false,
            render: function (_data: any, _type: any, row: any) {
              return _data ? 
                        `<button class="open-matieres btn btn-main rounded-4 py-4 px-10 text-sm">Matières</button> `+
                        `<button class="open-teachers btn bg-emerald-600 hover:bg-emerald-800 active:bg-emerald-800 rounded-4 py-4 px-10 text-sm">Enseignants</button> `+
                        `<button class="open-students btn btn-warning rounded-4 py-4 px-10 text-sm">Etudiants</button> `+
                        `<button class="open-programs btn bg-gray-400 hover:bg-gray-600 active:bg-gray-600 rounded-4 py-4 px-10 text-sm">Programmes</button> `+
                        `<button class="counter-inscription btn btn-danger rounded-4 py-4 px-10 text-sm mr-2" data-id="${row.id}">Sortir</button>`
                        :
                        `<button class="inscription border btn btn-main rounded-pill py-6 px-10 text-sm" data-id="${row.id}">S'inscrire</button>`;

            }
        }
    ];

    useEffect(() => {
        if (tableRef.current) {      
            $(tableRef.current).DataTable({
              searching: true,
              lengthChange: true,
              info: true,
              paging: true,
              columns: classeColumns,
            });

            const datatable = $(tableRef.current).DataTable()

            $(tableRef.current).on('click', '.inscription', function () {
                const rowId = $(this).data('id');
                const rowData = datatable.row($(this).parents('tr')).data();
                
                setIsLoading(false)
                dispatch(studentCreateAction({
                    classe: rowId,
                    user: session?.user?.id ?? ''
                })).unwrap()
                .then((response: any) => {
                    console.log(response)
                    
                })
                .catch((error : any) => {
                    toast.error("Impossible d'exécuter la requête");
                    console.log(error)
                })
                .finally(() => {
                    setIsLoading(false)
                    setShouldFetchClasses((prev) => prev + 1); 
                });
            });

            $(tableRef.current).on('click', '.open-programs', function () {
                const rowData = datatable.row($(this).parents('tr')).data();
                
                setSelectedClasse(rowData.classe)
                setTabSelected('Program')
            });

            $(tableRef.current).on('click', '.open-matieres', function () {
                const rowData = datatable.row($(this).parents('tr')).data();
                
                setSelectedClasse(rowData.classe)
                toggleAction('Matiere')
            });

            $(tableRef.current).on('click', '.counter-inscription', function () {
                const rowId = $(this).data('id');
                const rowData = datatable.row($(this).parents('tr')).data();
                
                setIsLoading(false)
                dispatch(studentLeaveAction({
                    classe: rowId,
                    user: session?.user?.id ?? ''
                })).unwrap()
                    .then((response: any) => {
                        console.log(response);
                    })
                    .catch((error : any) => {
                        toast.error("Impossible d'exécuter la requête");
                        console.log(error)
                    })
                    .finally(() => {
                        setIsLoading(false)
                        setShouldFetchClasses((prev) => prev + 1);
                    });
                    
            });
        }

      
        return () => {
            if (tableRef.current) {
                $(tableRef.current).off('click', '.inscription');
                $(tableRef.current).off('click', '.open-matieres');
                $(tableRef.current).off('click', '.open-programs');
                $(tableRef.current).off('click', '.counter-inscription');
                $(tableRef.current).DataTable().destroy();
            }
        };
    }, [classeData]);

    useEffect(() => {
        console.log("useEffect triggered"); 
        dispatch(classeListAction())
        .unwrap()
        .then((classes) => {
            console.log(classes)

            setMyClassesData(classes.my_classes?.map((instance : any) => instance.classe))
            setFiliereData(classes.filieres);  
            setUniteData(classes.unites); 
            setCycleData(classes.cycles);
            setClasseData(classes.data);
            setTeacherData(classes.teachers);

            console.log("oui, je suis ici")

            const filteredData = classes.data?.map((classe : any) => ({
                id: classe.id ? classe.id : '',
                filiere: classe.filiere ? classe.filiere.name : '',
                cycle: classe.cycle ? classe.cycle.name : '',
                year: classe.year,
                academic_year: classe.academic_year,
                parts: classe.parts,
                classe: classe,
                registered : classe.id ? classes.my_classes?.map((instance : any) => instance.classe)?.includes(classe.id) ?? undefined : false
            }));
            console.log("Filtered data", filteredData)
            setTableData(filteredData);


        })
        .catch((error) => {
            console.error("Failed to fetch classes: ", error.message || error);
            alert("Erreur : " + (error.message || error));
        });
    }, [dispatch]);


    useEffect(() => {    
        console.log("Table data", tableData)
        if (tableRef.current) {
            const datatable = $(tableRef.current).DataTable()   
            
            datatable.clear().draw();
            datatable.rows.add(tableData || []).draw();
            datatable.columns.adjust().draw();
        }
    }, [tableData, tableRef]);



    const form = useForm<z.infer<typeof ClasseSchema>>({
        resolver: zodResolver(ClasseSchema),
        defaultValues: {
            filiere: "",
            cycle: "", 
            year: 1,
            parts: "",
            academic_year: "",
        },
    });
    
    const onSubmit = async (values: z.infer<typeof ClasseSchema>) => {
        setIsLoading(true)
        await dispatch(classeCreateAction(values))
            .unwrap()
            .then((response: any) => {
              console.log(response)
              if(response.success){
                toast.success(response.message);
                setClasseData((prevData) => [
                    ...(prevData || []),
                    {
                        id: response.data.id,
                        filiere: response.data.filiere,
                        cycle: response.data.cycle,
                        year: response.data.year,
                        parts: response.data.parts,
                        academic_year: response.data.academic_year,
                    }
                ]);

                form.reset();
                
              }else{
                if(response.data.errors.password){
                  response.data.errors.password.map((error:string) => {
                    toast.error(error)
                  })
                }
                if(response.data.errors.email){
                  response.data.errors.email.map((error:string) => {
                    toast.error(error)
                  })
                }
                
              }
            })
            .catch((error : any) => {
              toast.error("Impossible d'exécuter la requête");
              console.log(error)
            })
            .finally(() => {
              setIsLoading(false)
            });
  
    };

    const handleRetourClick = (updatedMatieres: MatiereEntity[]) => {
        setTabSelected('Classe')
        setClasseData((prevData) => {
            if(prevData){
                return prevData.map(classe => {
                    if(classe.id === selectedClasse?.id){
                        return {
                            ...classe,
                            matieres: updatedMatieres
                        }
                    }
                    return classe
                })
            }
            return prevData
        })
    };

    const handleProgramRetourClick = (classeData: ClasseEntity[]) => {
        setTabSelected('Classe')
        setClasseData(classeData)
    }
    return ( 
        <>
        {tabSelected==='Classe' && <section>
            <div className="dashboard-body">
                <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
                    <div className="breadcrumb mb-24">
                        <ul className="flex-align gap-4">
                            <li><a href="index.html" className="text-gray-200 fw-normal text-15 hover-text-main-600">Dashboard</a></li>
                            <li> <span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span> </li>
                            <li><span className="text-main-600 fw-normal text-15">Classes</span></li>
                        </ul>
                    </div>
                    
                    <div className="flex gap-1"> 

                        <button type="button" className="border btn-main rounded-pill py-8 px-20 text-white" data-bs-toggle="modal" data-bs-target="#cycleCreate">
                            <i className="ph ph-plus"></i> Ajouter Classe
                        </button>
                    </div>
                    
                    <div className="modal fade" id="cycleCreate" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="cycle-add-title">Ajouter une Classe</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-20">
                                            <label htmlFor="filiere" className="form-label text-secondary">Choisir le cycle</label>
                                            <select 
                                                id="filiere" 
                                                className="form-control" 
                                                {...form.register("cycle")}
                                            >
                                                <option value="">Sélectionnez un cycle</option>
                                                {cycleData?.map(cycle => (
                                                    <option key={cycle.id} value={cycle.id}>
                                                        {cycle.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-20">
                                            <label htmlFor="filiere" className="form-label text-secondary">Choisir une Filière</label>
                                            <select 
                                                id="filiere" 
                                                className="form-control" 
                                                {...form.register("filiere")}
                                            >
                                                <option value="">Sélectionnez une filière</option>
                                                {filiereData?.map(filiere => (
                                                    <option key={filiere.id} value={filiere.id}>
                                                        {filiere.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-20">
                                            <label htmlFor="filiere" className="form-label text-secondary">Choisir l'année d'étude</label>
                                            <div className="input-group">
                                                <input
                                                    type="number"
                                                    id="year"
                                                    className="form-control"
                                                    placeholder="Année"
                                                    {...form.register("year", {
                                                        setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                                                    })}
                                                />
                                                    
                                                <div className="input-group-append">
                                                    <span className="input-group-text h-full" id="basic-addon2">année</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-20">
                                            <label htmlFor="parts" className="form-label text-secondary">Choisir une découpage du calendrier scolaire</label>
                                            <select 
                                                id="parts" 
                                                className="form-control" 
                                                {...form.register("parts")}
                                            >
                                                <option value="">Sélectionnez une valeur</option>
                                                <option value="TRI">
                                                    Trimestre
                                                </option>
                                                <option value="SEM">
                                                    Semestre
                                                </option>
                                            </select>
                                        </div>

                                        <div className="mb-20">
                                            <label htmlFor="academic_year" className="form-label text-secondary">Choisir l'année académique</label>
                                            <select
                                                id="academic_year"
                                                className="form-control"
                                                {...form.register("academic_year", {
                                                    required: "L'année académique est requise."
                                                })}
                                            >
                                                <option value="">Sélectionnez une année</option>
                                                {[...Array(10)].map((_, i) => {
                                                    const year = new Date().getFullYear() + i;
                                                    return (
                                                        <option key={year} value={year}>
                                                            {year}
                                                        </option>
                                                    );
                                                })}
                                            </select>
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
                            </Form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card overflow-hidden">
                    <div className="card-body p-0">
                        <table ref={tableRef} id="assignmentTable" className="table table-striped"></table>
                    </div>
                </div>
            </div>
        </section>}
        {
            tabSelected==='Matiere' && selectedClasse!==undefined && (
                <>
                    <MatieresComponent classe={selectedClasse} unites={uniteData} teachers={teacherData} onRetour={handleRetourClick}/>
                </>
            )
        }
        {
            tabSelected==='Program' && classeData!== undefined && (
                <>
                    <CalendarProgramsComponent classes={classeData} onRetour={handleProgramRetourClick} />
                </>
            )
        }
        </>

     );
}
 
export default Classes;