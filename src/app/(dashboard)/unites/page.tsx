"use client"

import $ from "jquery";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { uniteCreateAction, uniteListAction } from "@/core/application/actions/unite.action";
import { useAppDispatch } from "@/core/application/hooks";
import { UniteSchema, UniteType } from "@/core/application/schemas/unite.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Form } from "@/components/ui/form";

const Unite = () => {
    require('datatables.net-bs5');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const dispatch = useAppDispatch();
    const [uniteData, setUniteData] = useState<UniteType[] | undefined>(undefined);

    const tableRef = useRef<HTMLTableElement>(null);

    const uniteColumns = useMemo(()  => {
        return [
            { data: "code", title: "Code" },
            { data: "name", title: "Nom" },
            { data: "description", title: "Description" },
            {
                title: "Actions",
                data: "modify",
                orderable: false,
                render: function (_data: any, _type: any, row: any) {
                return `<button class="btn btn-main rounded-4 py-4 px-10 text-sm mr-1" data-bs-toggle="modal" data-bs-target="#uniteCreate" data-id="${row.id}">Modifier</button>` +
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
                    columns: uniteColumns,
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
    }, [uniteColumns]);

    useEffect(() => {
        dispatch(uniteListAction())
          .unwrap()
          .then((unites) => {
            setUniteData(unites.data);
          })
          .catch((error) => {
            console.error("Failed to fetch unites: ", error.message || error);
            alert("Erreur : " + (error.message || error));
          });
    }, [dispatch]);


    useEffect(() => {    
        if (tableRef.current) {
            const datatable = $(tableRef.current).DataTable()

            datatable.clear().draw();
            datatable.rows.add(uniteData || []).draw();
            datatable.columns.adjust().draw();
        }
    }, [uniteData, tableRef]);

    const form = useForm<UniteType>({
        resolver: zodResolver(UniteSchema),
        defaultValues: {
          code: "",
          name: "",
          description: "",
        },
      });
    
    const onSubmit = async (values: UniteType) => {
        setIsLoading(true)
        await dispatch(uniteCreateAction(values))
            .unwrap()
            .then((response: any) => {
              console.log(response)
              if(response.success){
                toast.success(response.message);
                setUniteData((prevData) => [
                    ...(prevData || []),
                    {
                        code: response.data.code,
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
                            <li><span className="text-main-600 fw-normal text-15">Unités d'enseignement</span></li>
                        </ul>
                    </div>
                    <button type="button" className="border btn-main rounded-pill py-8 px-20 text-white" data-bs-toggle="modal" data-bs-target="#uniteCreate">
                        <i className="ph ph-plus"></i> Ajouter Unité d'Enseignement
                    </button>
                    
                    <div className="modal fade" id="uniteCreate" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="exampleModalLabelOne">Ajouter une Unité d'Enseignement</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <input 
                                            type="text" 
                                            id="code" 
                                            className="form-control mb-20" 
                                            placeholder="Ajouter un code à l'unité d'enseignement" 
                                            {...form.register("code")} />

                                        <input 
                                            type="text" 
                                            id="name" 
                                            className="form-control mb-20" 
                                            placeholder="Ajouter un nom à l'unité d'enseignement" 
                                            {...form.register("name")} />
                                        
                                        <textarea 
                                            className="form-control" 
                                            id="description" 
                                            placeholder="Ajouter une description à l'unité d'enseignement"
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
 
export default Unite;