"use client"

import { Button } from "@/components/ui/button";

import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';

import $, { data } from "jquery";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/core/application/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { MatiereEntity } from "@/core/domain/entities/classe.entity";
import { matiereCreateAction, matiereListAction } from "@/core/application/actions/matiere.action";


import { UserEntity } from "@/core/domain/entities/user.entity";
import Select from 'react-select';
import { MatiereSchema } from "@/core/application/schemas";

DataTable.use(DT);

const Matieres = () => {

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [matiereData, setMatiereData] = useState<MatiereEntity[] | undefined>(undefined);
    const [teachers, setTeachers] = useState<UserEntity[] | undefined>(undefined);

    const tableRef = useRef<HTMLTableElement>(null);

    const matiereColumns = [
        { data: "id", visible: false },
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
              return `<button class="btn btn-main rounded-4 py-4 px-10 text-sm mr-1" data-bs-toggle="modal" data-bs-target="#matiereCreateModal" data-id="${row.id}">Modifier</button>` +
                     `<button class="btn btn-danger rounded-4 py-4 px-10 text-sm" data-id="${row.id}">Supprimer</button>`

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
              columns: matiereColumns,
            });

        }
        return () => {
            if (tableRef.current) {
                $(tableRef.current).DataTable().destroy();
            }
        };
    }, []);

    useEffect(() => {
        dispatch(matiereListAction())
          .unwrap()
          .then((matieres) => {
            console.log(matieres)
            setMatiereData(matieres.data);
            setTeachers(matieres.teachers);
          })
          .catch((error) => {
            console.error("Failed to fetch classes: ", error.message || error);
            alert("Erreur : " + (error.message || error));
          });
        
    }, [dispatch]);


    useEffect(() => {    
        if (tableRef.current) {
            const datatable = $(tableRef.current).DataTable()   
            const filteredData = matiereData?.map(matiere => ({
                id: matiere.id ? matiere.id : '',
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
    }, [matiereData, tableRef]);



      const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
      } = useForm<z.infer<typeof MatiereSchema>>({
        resolver: zodResolver(MatiereSchema),
        defaultValues: {
            code : "",
            name : "",
            hours : 1,
            coefficient : 1,
            year_part : 1

        },
    });
    
    const handleChange = (selectedOption: any) => {
        setValue("teacher", selectedOption ? selectedOption.value : null);
    };
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


    const onSubmit = async (values: z.infer<typeof MatiereSchema>) => {
        alert(JSON.stringify(values))
        setIsLoading(true)
        await dispatch(matiereCreateAction(values))
            .unwrap()
            .then((response: any) => {
              console.log(response)
              if(response.success){
                toast.success(response.message);
                setMatiereData((prevData) => [
                    ...(prevData || []),
                    response.data,
                ])

                reset();
                
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

    return ( 
        <section>
            <div className="dashboard-body">
                <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
                    <div className="breadcrumb mb-24">
                        <ul className="flex-align gap-4">
                            <li><a href="index.html" className="text-gray-200 fw-normal text-15 hover-text-main-600">Dashboard</a></li>
                            <li> <span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span> </li>
                            <li><span className="text-main-600 fw-normal text-15">Classes</span></li>
                        </ul>
                    </div>
                    <button type="button" className="border btn-main rounded-pill py-8 px-20" data-bs-toggle="modal" data-bs-target="#cycleCreate">
                        <i className="ph ph-caret-plus"></i> Ajouter Matière
                    </button>
                    
                    <div className="modal fade" id="cycleCreate" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="cycle-add-title">Ajouter une Matière</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <input 
                                            type="text" 
                                            id="code" 
                                            className="form-control mb-20" 
                                            placeholder="Code de l'ECUE" 
                                            {...register("code")} />

                                        <input 
                                            type="text" 
                                            id="name" 
                                            className="form-control mb-20" 
                                            placeholder="Intitulé de la matière" 
                                            {...register("name")} />

                                        <div className="input-group mb-20">
                                            <input
                                                type="number"
                                                id="hours"
                                                className="form-control"
                                                placeholder="Quotat horaire"
                                                {...register("hours", {
                                                    setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                                                })}
                                            />
                                                
                                            <div className="input-group-append">
                                                <span className="input-group-text h-full" id="basic-addon2">heures</span>
                                            </div>
                                        </div>
                                        <div className="input-group mb-20">
                                            <input
                                                type="number"
                                                id="coefficient"
                                                className="form-control"
                                                placeholder="Coefficient de la matière"
                                                {...register("coefficient", {
                                                    setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                                                })}
                                            />
                                                
                                            <div className="input-group-append">
                                                <span className="input-group-text h-full" id="basic-addon2">crédits</span>
                                            </div>
                                        </div>

                                        <div className="mb-20">
                                            <Select 
                                                id="teacher"
                                                options={teacherOptions}
                                                placeholder="Sélectionnez un professeur"
                                                onChange={handleChange} 
                                                onBlur={() => {}} 
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
 
export default Matieres;