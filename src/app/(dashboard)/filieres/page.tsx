"use client"

import $ from "jquery";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { filiereCreateAction, filiereListAction } from "@/core/application/actions/filiere.action";
import { useAppDispatch } from "@/core/application/hooks";
import { FiliereEntity } from "@/core/domain/entities/filiere.entity";
import { FiliereSchema } from "@/core/application/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Form } from "@/components/ui/form";

const Filiere = () => {
    require('datatables.net-bs5');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const dispatch = useAppDispatch();
    const [filiereData, setFiliereData] = useState<FiliereEntity[] | undefined>(undefined);

    const tableRef = useRef<HTMLTableElement>(null);

    const filiereColumns = useMemo(()  => {
        return [
            { data: "name", title: "Nom" },
            { data: "description", title: "Description" },
            {
                title: "Actions",
                data: "modify",
                orderable: false,
                render: function (_data: any, _type: any, row: any) {
                return `<button class="btn btn-main rounded-4 py-4 px-10 text-sm mr-1" data-bs-toggle="modal" data-bs-target="#filiereCreate" data-id="${row.id}">Modifier</button>` +
                        `<button class="btn btn-danger rounded-4 py-4 px-10 text-sm" data-id="${row.id}">Supprimer</button>`

                }
            }
        ];
    }, []);

    useEffect(() => {
        const initDataTable = () => {
            if (tableRef.current) {
                $(tableRef.current).DataTable().destroy();
                $(tableRef.current).DataTable({
                    searching: true,
                    lengthChange: true,
                    info: true,
                    paging: true,
                    columns: filiereColumns,
                });
            }
        };

        const loadDataTables = async () => {
            if (typeof window !== "undefined" && window.$ && window.jQuery.fn.DataTable) {
                initDataTable();
            } else {
                const interval = setInterval(() => {
                    if (window.$ && window.jQuery.fn.DataTable) {
                        initDataTable();
                        clearInterval(interval);
                    }
                }, 1000);
            }
        };

        loadDataTables();

        return () => {
            if (tableRef.current) {
                $(tableRef.current).DataTable().destroy();
            }
        };
    }, [filiereColumns]);

    useEffect(() => {
        dispatch(filiereListAction())
          .unwrap()
          .then((filieres) => {
            setFiliereData(filieres.data);
          })
          .catch((error) => {
            console.error("Failed to fetch filières: ", error.message || error);
            alert("Erreur : " + (error.message || error));
          });
    }, [dispatch]);


    useEffect(() => {    
        if (tableRef.current) {
            const datatable = $(tableRef.current).DataTable()

            datatable.clear().draw();
            datatable.rows.add(filiereData || []).draw();
            datatable.columns.adjust().draw();
        }
    }, [filiereData, tableRef]);

    const form = useForm<z.infer<typeof FiliereSchema>>({
        resolver: zodResolver(FiliereSchema),
        defaultValues: {
          name: "",
          description: "",
        },
      });
    
    const onSubmit = async (values: z.infer<typeof FiliereSchema>) => {
        setIsLoading(true)
        await dispatch(filiereCreateAction(values))
            .unwrap()
            .then((response: any) => {
              console.log(response)
              if(response.success){
                toast.success(response.message);
                setFiliereData((prevData) => [
                    ...(prevData || []),
                    {
                        name: response.data.name,
                        description: response.data.description,
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

    return (
    <>
        <section>
            <div className="dashboard-body">
                <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
                    <div className="breadcrumb mb-24">
                        <ul className="flex-align gap-4">
                            <li><a href="index.html" className="text-gray-200 fw-normal text-15 hover-text-main-600">Dashboard</a></li>
                            <li> <span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span> </li>
                            <li><span className="text-main-600 fw-normal text-15">Filières</span></li>
                        </ul>
                    </div>
                    <button type="button" className="border btn-main rounded-pill py-8 px-20 text-white" data-bs-toggle="modal" data-bs-target="#filiereCreate">
                        <i className="ph ph-plus"></i> Add Filière
                    </button>
                    
                    <div className="modal fade" id="filiereCreate" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabelOne">Ajouter une Filière</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <input 
                                            type="text" 
                                            id="name" 
                                            className="form-control mb-20" 
                                            placeholder="Ajouter un nom à la filière" 
                                            {...form.register("name")} />
                                        
                                        <textarea 
                                            className="form-control" 
                                            id="description" 
                                            placeholder="Ajouter une description à la filière"
                                            {...form.register("description")} />
                                        
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
                        <table ref={tableRef} className="table table-striped"></table>
                    </div>
                </div>
            </div>
        </section>
    </>
     );
}
 
export default Filiere;