"use client"

import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";

import $ from "jquery";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/core/application/hooks";
import { CycleEntity } from "@/core/domain/entities/cycle.entity";
import { useForm } from "react-hook-form";
import { ClasseSchema, StudentSchema, StudentValidationSchema } from "@/core/application/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Form } from "@/components/ui/form";
import { FiliereEntity } from "@/core/domain/entities/filiere.entity";
import { ClasseEntity, StudentEntity } from "@/core/domain/entities/classe.entity";
import { classeCreateAction, classeListAction, studentCreateAction, studentListAction, studentRefusalAction, studentValidationAction } from "@/core/application/actions/classe.action";
import DOMPurify from 'dompurify';
import { TagEntity } from "@/core/domain/entities/tag.entity";
import { UserEntity } from "@/core/domain/entities/user.entity";
import Select from 'react-select';


const Students = () => {
    require('datatables.net-bs5');
    const ReactQuill = require('react-quill');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const dispatch = useAppDispatch();

    const [cycles, setCycles] = useState<CycleEntity[] | undefined>(undefined);
    const [filieres, setFilieres] = useState<FiliereEntity[] | undefined>(undefined);
    const [classes, setClasses] = useState<ClasseEntity[] | undefined>(undefined);
    const [users, setUsers] = useState<UserEntity[] | undefined>(undefined);
    
    const [cycleData, setCycleData] = useState<CycleEntity[] | undefined>(undefined);
    const [studentData, setStudentData] = useState<StudentEntity[] | undefined>([]);

    const [selectedStudent, setSelectedStudent] = useState<StudentEntity | undefined>(undefined);
    const [tagData, setTagData] = useState<TagEntity[] | undefined>(undefined);

    const [refusing, setRefusing] = useState<boolean>(false);
    const [why, setWhy] = useState<string>("");


    // Fonction pour ouvrir le modal et stocker les détails de l'étudiant sélectionné
    const handleOpenModal = (student : StudentEntity | undefined) => {
        setSelectedStudent(student);
    };

    const tableRef = useRef<HTMLTableElement>(null);

    const classeColumns = [
        { data: "id", visible: false },

        { data: "name", title: "Nom" },
        { data: "cycle", title: "Cycle" },
        { data: "filiere", title: "Filière" },
        { data: "title", title: "titre" },
        { data: "year", title: "Année" },

        { data: "student", visible: false },
        { data: "statut", title: "Statut" },
        {
            title: "Actions",
            data: "modify",
            orderable: false,
            render: function (_data: any, _type: any, row: any) {
                return `<button class="btn btn-main rounded-4 py-4 px-10 text-sm mr-1" data-bs-toggle="modal" data-bs-target="#studentDetail" data-id="${row.id}">Détails</button>`;
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

            $(tableRef.current).on('click', 'tbody tr', function () {
                const rowData = datatable.row(this).data();
                handleOpenModal(rowData.student);
                
                $("#hiddenModalButton").trigger('click');
            });
        }

        return () => {
            if (tableRef.current) {
                $(tableRef.current).off('click', 'tbody tr');
                $(tableRef.current).DataTable().destroy();
            }
        };
    }, []);

    useEffect(() => {
        dispatch(studentListAction())
          .unwrap()
          .then((students) => {
            console.log('students', students)
            setStudentData(students.data);
            setTagData(students.tags);
          })
          .catch((error) => {
            console.error("Failed to fetch classes: ", error.message || error);
            alert("Erreur : " + (error.message || error));
          });
        
    }, [dispatch]);


    useEffect(() => {    
        if (tableRef.current) {
            const datatable = $(tableRef.current).DataTable()   
            if(studentData){
                console.log("studentData", studentData)
                const filteredData = studentData?.map(student => ({
                    id: student.id ? student.id : '',
                    name: student.user.firstname ? student.user.firstname+' '+student.user.lastname : '',
                    filiere: student.classe.filiere ? student.classe.filiere.name : '',
                    cycle: student.classe.cycle ? student.classe.cycle.name : '',
                    title: student.titre? student.titre : 'Non défini',
                    year: student.classe.year? student.classe.year : '',
                    statut: student.statut? student.statut : '',

                    student: student
                }));

                datatable.clear().draw();
                datatable.rows.add(filteredData || []).draw();
                datatable.columns.adjust().draw();
            }
        }
    }, [studentData, tableRef]);

    useEffect(() => {
        dispatch(classeListAction())
            .unwrap()
            .then((classes) => {
                console.log('classes', classes)
                setClasses(classes.data);
                setFilieres(classes.filieres);
                setCycles(classes.cycles);
                setUsers(classes.users);
            })
            .catch((error) => {
                console.error("Failed to fetch classes: ", error.message || error);
                alert("Erreur : " + (error.message || error));
            }); 
    }, [dispatch, setClasses, setFilieres, setCycles]);


    const form = useForm<z.infer<typeof StudentSchema>>({
        resolver: zodResolver(StudentSchema),
        defaultValues: {
          classe: "",
          user: ""
        },
    });
    
    const handleChange = (selectedOption: any) => {
        form.setValue("user", selectedOption ? selectedOption.value : null);
    };
    const handleClasseChange = (selectedOption: any) => {
        form.setValue("classe", selectedOption ? selectedOption.value : null);
    };

    const onSubmit = async (values: z.infer<typeof StudentSchema>) => {
        console.log("Form values:", values);
        setIsLoading(true)
        await dispatch(studentCreateAction(values))
            .unwrap()
            .then((response: any) => {
              console.log(response)
              if(response.success){
                toast.success(response.message);
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


    const userOptions = users?.map(user => ({
        value: user.id,
        label: (
            <div className="flex items-center">
                <img
                    src={user?.profile ? `${process.env.NEXT_PUBLIC_HOST}/storage/${user?.profile}` :  "/assets/images/user_placeholder.jpg"} 
                    alt="Profile image" 
                    className="w-32 h-32 object-cover object-center rounded-full shadow-sm mr-2" 
                />
                <span className="text-gray-800">{user.lastname} {user.firstname}</span>
            </div>
        )
    }));

    const classesOptions = classes?.map(classe => ({
        value: classe.id,
        label: (
            <div className="flex items-center gap-4 justify-between">
                <div className="flex flex-col">
                    <span className="text-main">Cycle</span>
                    <span className="text-gray-800 text-xs">{classe.cycle.name}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-main">Filière</span>
                    <span className="text-gray-800 text-xs">{classe.filiere.name}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-main">Academic (Year)</span>
                    <span className="text-gray-800 text-xs">{classe.academic_year} ({classe.year} années)</span>
                </div>
            </div>
        )
    }));


    
    const form2 = useForm<z.infer<typeof StudentValidationSchema>>({
        resolver: zodResolver(StudentValidationSchema),
    });
    
    const onSubmit2 = async (values: z.infer<typeof StudentValidationSchema>) => {
        values.student = selectedStudent?.id
        setIsLoading(true)
        await dispatch(studentValidationAction(values))
            .unwrap()
            .then((response: any) => {
              console.log(response)
              if(response.success){
                toast.success(response.message);

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


    const handleRejet = async () => {
        if(why === ""){
            toast.warning("La raison du refus de l'inscription est requise");
        }else{
            const values = {
                why : why,
                student: selectedStudent?.id,
            }

            setIsLoading(true)
            await dispatch(studentRefusalAction(values))
                .unwrap()
                .then((response: any) => {
                console.log(response)
                if(response.success){
                    toast.success(response.message);
                    setWhy("")
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
        }
        


        
    }
    const limitWords = (text: string, limit:number) => {
        const words = text?.split(" ");
        if (words.length > limit) {
          return words.slice(0, limit).join(" ") + "...";
        }
        return text;
    };

    return ( 
        <section>
            <div className="dashboard-body">
                {/* ---------- Student Detail Modal  --------------- */}
                <button
                    id="hiddenModalButton"
                    type="button"
                    className="d-none"
                    data-bs-toggle="modal"
                    data-bs-target="#studentDetail"
                    >
                    Ouvrir Détails
                </button>
                <div className="modal fade" id="studentDetail" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="mentor-card rounded-8 overflow-hidden">
                                    <div className="mentor-card__cover position-relative">
                                        <img src={selectedStudent?.user?.cover ? `${process.env.NEXT_PUBLIC_HOST}/storage/${selectedStudent?.user?.cover}` : "/assets/images/setting_cover_img.png"} alt="" className="cover-img" />
                                        <button type="button" className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"> 
                                            <i className="ph ph-plus d-flex"></i> 
                                            <span className="text">Follow</span>
                                        </button>
                                    </div>
                                    <div className="mentor-card__content text-center">
                                        <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                                            <a href="setting.html" className="">
                                                <img src={selectedStudent?.user?.profile ? `${process.env.NEXT_PUBLIC_HOST}/storage/${selectedStudent?.user?.profile}` :  "/assets/images/user_placeholder.jpg"} alt="" className="mentor-card__img cover-img" />
                                            </a>
                                        </div>
                                        <h5 className="mb-0">
                                            <a href="setting.html">{selectedStudent?.user.lastname} {selectedStudent?.user.firstname}</a>
                                        </h5>
                                        <span className="text-13 text-gray-500">Etudiante</span>

                                        {selectedStudent?.user.bio && <div 
                                            className="mt-20 text-gray-600 text-14 text-line-2" 
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(limitWords(selectedStudent?.user.bio, 20)) }} 
                                        />}

                                        <div className="mt-20 text-gray-900 border border-gray-100 px-8 py-6">
                                            <h5 className="text-left mb-10 text-main-600">Utilisateur</h5>
                                            <div className="w-full flex flex-wrap justify-between items-center">
                                                <strong>Nom Complet : </strong>
                                                <span>{selectedStudent?.user.lastname} {selectedStudent?.user.firstname}</span>
                                            </div>
                                            <div className="w-full flex flex-wrap justify-between items-center">
                                                <strong>Téléphone : </strong>
                                                <span>{selectedStudent?.user.phone}</span>
                                            </div>
                                            <div className="w-full flex flex-wrap justify-between items-center">
                                                <strong>Email : </strong>
                                                <span>{selectedStudent?.user.email}</span>
                                            </div>
                                        </div>

                                        <div className="mt-20 text-gray-900 border border-gray-100 px-8 py-6">
                                            <h5 className="text-left mb-10 text-main-600">Cycle</h5>
                                            <div className="w-full flex flex-wrap justify-between items-center">
                                                <strong>Nom du Cycle : </strong>
                                                <span>{selectedStudent?.classe.cycle.name}</span>
                                            </div>
                                            <div className="w-full flex flex-wrap justify-between items-center">
                                                <strong>Description : </strong>
                                                <span>{selectedStudent?.classe.cycle.description || 'Aucune description'}</span>
                                            </div>
                                            <div className="w-full flex flex-wrap justify-between items-center">
                                                <strong>Durée du Cycle : </strong>
                                                <span>{selectedStudent?.classe.cycle.duration} années</span>
                                            </div>
                                        </div>

                                        <div className="mt-20 text-gray-900 border border-gray-100 px-8 py-6">
                                            <h5 className="text-left mb-10 text-main-600">Filière</h5>
                                            <div className="w-full flex flex-wrap justify-between items-center">
                                                <strong>Nom de la Filière : </strong>
                                                <span>{selectedStudent?.classe.filiere.name}</span>
                                            </div>
                                            <div className="w-full flex flex-wrap justify-between items-center">
                                                <strong>Description : </strong>
                                                <span>{selectedStudent?.classe.filiere.description || 'Aucune description'}</span>
                                            </div>
                                        </div>

                                        {selectedStudent?.statut === "PRE-INSCRIT" ? (
                                            <div className="mt-20 text-gray-900 border border-gray-100 px-8 py-6">
                                                <button 
                                                    className="btn btn-main w-full"
                                                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_HOST}/storage/inscriptions/${selectedStudent?.file}`, '_blank')}
                                                >
                                                    Voir fiche de préinscription
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {!refusing && <Form {...form2}>
                                                    <form onSubmit={form2.handleSubmit(onSubmit2)} className="mt-20 text-gray-900 border border-gray-100 px-8 py-6">
                                                    <h5 className="text-left mb-10 text-main-600">Inscription</h5>
                                                        <div className="mb-3 flex flex-wrap justify-around items-center " >
                                                            <div className="form-check form-check-inline my-5">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="titleBRS"
                                                                    value="BRS"
                                                                    {...form2.register("titre")}
                                                                />
                                                                <label className="ml-4" htmlFor="titleBRS">
                                                                    BRS
                                                                </label>
                                                            </div>
                                                            <div className="form-check form-check-inline my-5">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="titleATP"
                                                                    value="ATP"
                                                                    {...form2.register("titre")}
                                                                />
                                                                <label className="ml-4" htmlFor="titleATP">
                                                                    ATP
                                                                </label>
                                                            </div>
                                                            <div className="form-check form-check-inline my-5">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    id="titleSPR"
                                                                    value="SPR"
                                                                    {...form2.register("titre")}

                                                                />
                                                                <label className="ml-4" htmlFor="titleSPR">
                                                                    SPR
                                                                </label>
                                                            </div>
                                                        </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="tagSelect" className="form-label">Choisir un Tag :</label>
                                                        <select
                                                            id="tagSelect"
                                                            className="form-select"
                                                            {...form2.register("tag")} 
                                                        >
                                                            <option value="">Sélectionnez un tag</option>
                                                            {tagData?.map(tag => (
                                                                <option key={tag?.id} value={tag?.id}>
                                                                {tag?.name} ({tag.fee} Fcfa)
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="mt-20 flex justify-center items-center gap-5">
                                                        <button className="btn btn-danger" onClick={()=>setRefusing(true)} disabled={isLoading}>
                                                            Rejeter
                                                        </button>
                                                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                                            {isLoading ? "Inscription en cours..." : "Inscrire"}
                                                        </button>
                                                    </div>
                                                        
                                                    </form>
                                                </Form>}
                                                {refusing && (
                                                    <div className="col-12 mt-20 text-gray-900 border border-gray-100 px-8 py-6">
                                                        <h5 className="text-left mb-10 text-main-600">Rejet</h5>
                                                            <div className="editor">
                                                                <ReactQuill
                                                                    theme="snow"
                                                                    value={why}
                                                                    onChange={setWhy}
                                                                    placeholder="Editez la raison du refus de son inscription ..."
                                                                />
                                                            </div>
                                                        

                                                        <div className="mt-20 flex justify-center items-center gap-5">
                                                            <button onClick={handleRejet} className="btn btn-danger" disabled={isLoading}>
                                                                {isLoading ? "Rejet en cours..." : "Rejeter"}
                                                            </button>
                                                            <button onClick={()=>setRefusing(false)} className="btn btn-secondary" disabled={isLoading}>
                                                                Annuler
                                                            </button>
                                                        </div>
                                                  </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>

                <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
                    <div className="breadcrumb mb-24">
                        <ul className="flex-align gap-4">
                            <li><a href="index.html" className="text-gray-200 fw-normal text-15 hover-text-main-600">Dashboard</a></li>
                            <li> <span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span> </li>
                            <li><span className="text-main-600 fw-normal text-15">Etudiants</span></li>
                        </ul>
                    </div>
                    <button type="button" className="border btn-main rounded-pill py-8 px-20 text-white" data-bs-toggle="modal" data-bs-target="#studentCreate">
                        <i className="ph ph-plus"></i> Ajouter un étudiant
                    </button>
                    
                    <div className="modal fade" id="studentCreate" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="cycle-add-title">Ajouter un étudiant</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-20">
                                            <label htmlFor="add-student-user" className="form-label">Choisir un utilisateur</label>
                                            <Select 
                                                id="add-student-user"
                                                options={userOptions}
                                                placeholder="Sélectionnez un utilisateur"
                                                onChange={handleChange} 
                                                onBlur={() => {}} 
                                                className="z-20"
                                            />
                                        </div>
                                        <div className="mb-20">
                                            <label htmlFor="add-student-classe" className="form-label">Choisir la classe</label>
                                            <Select 
                                                id="add-student-classe"
                                                options={classesOptions}
                                                placeholder="Sélectionnez une classe"
                                                onChange={handleClasseChange} 
                                                onBlur={() => {}} 
                                                className="z-10"	
                                            />
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
        </section>
     );
}
 
export default Students;