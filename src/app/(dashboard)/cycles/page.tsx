'use client'

import $ from "jquery";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "@/core/application/hooks";
import { cycleCreateAction, cycleListAction } from "@/core/application/actions/cycle.action";
import { CycleEntity } from "@/core/domain/entities/cycle.entity";
import { useForm } from "react-hook-form";
import { CycleSchema } from "@/core/application/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Form } from "@/components/ui/form";

const Cycles = () => {
    require('datatables.net-bs5');

    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [cycleData, setCycleData] = useState<CycleEntity[] | undefined>(undefined);

    const tableRef = useRef<HTMLTableElement>(null);

    const cycleColumns = useMemo(() => {
        return [
            { data: "name", title: "Nom" },
            { data: "description", title: "Description" },
            { data: "duration", title: "Durée" },
            {
                title: "Actions",
                data: "modify",
                orderable: false,
                render: function (_data: any, _type: any, row: any) {
                return `<button class="btn btn-main rounded-4 py-4 px-10 text-sm mr-1" data-bs-toggle="modal" data-bs-target="#cycleCreate" data-id="${row.id}">Modifier</button>` +
                        `<button class="btn btn-danger rounded-4 py-4 px-10 text-sm" data-id="${row.id}">Supprimer</button>`

                }
            }
        ];
    }, []);
    
    useEffect(() => {
        if (tableRef.current) {      
            $(tableRef.current).DataTable({
              searching: true,
              lengthChange: true,
              info: true,
              paging: true,
              columns: cycleColumns,
            });
        }
      
        return () => {
          if (tableRef.current) {
            $(tableRef.current).DataTable().destroy();
          }
        };
    }, []);

    useEffect(() => {
        dispatch(cycleListAction())
          .unwrap()
          .then((cycles) => {
            setCycleData(cycles.data);
          })
          .catch((error) => {
            console.error("Failed to fetch cycles: ", error.message || error);
            alert("Erreur : " + (error.message || error));
          });
        
    }, [dispatch]);


    useEffect(() => {    
        if (tableRef.current) {
            const datatable = $(tableRef.current).DataTable()

            datatable.clear().draw();
            datatable.rows.add(cycleData || []).draw();
            datatable.columns.adjust().draw();
        }
    }, [cycleData, tableRef]);



    const form = useForm<z.infer<typeof CycleSchema>>({
        resolver: zodResolver(CycleSchema),
        defaultValues: {
          name: "",
          description: "",
          duration: 1,
        },
      });
    
    const onSubmit = async (values: z.infer<typeof CycleSchema>) => {
        setIsLoading(true)
        await dispatch(cycleCreateAction(values))
            .unwrap()
            .then((response: any) => {
              console.log(response)
              if(response.success){
                toast.success(response.message);
                setCycleData((prevData) => [
                    ...(prevData || []),
                    {
                        name: response.data.name,
                        description: response.data.description,
                        duration: response.data.duration
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
        
        <section>
            <div className="dashboard-body">
                <div className="breadcrumb-with-buttons mb-24 flex-between flex-wrap gap-8">
                    <div className="breadcrumb mb-24">
                        <ul className="flex-align gap-4">
                            <li><a href="index.html" className="text-gray-200 fw-normal text-15 hover-text-main-600">Dashboard</a></li>
                            <li> <span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span> </li>
                            <li><span className="text-main-600 fw-normal text-15">Cycles</span></li>
                        </ul>
                    </div>
                    <button type="button" className="border btn-main rounded-pill py-8 px-20 text-white" data-bs-toggle="modal" data-bs-target="#cycleCreate">
                        <i className="ph ph-plus"></i> Ajouter Cycle
                    </button>
                    
                    <div className="modal fade" id="cycleCreate" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="cycle-add-title">Ajouter un Cycle</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <input 
                                            type="text" 
                                            id="name" 
                                            className="form-control mb-20" 
                                            placeholder="Ajouter un nom au cycle" 
                                            {...form.register("name")} 
                                            />
                                        
                                        <textarea 
                                            id="description" 
                                            className="form-control mb-20" 
                                            placeholder="Ajouter une description au cycle"
                                            {...form.register("description")} 
                                            />

                                        <div className="input-group mb-3">
                                            <input
                                                type="number"
                                                id="duration"
                                                className="form-control"
                                                placeholder="Durée du cycle"
                                                {...form.register("duration", {
                                                  setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
                                              })}
                                            />
                                            
                                            <div className="input-group-append">
                                                <span className="input-group-text h-full" id="basic-addon2">années</span>
                                            </div>
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
                        <table 
                            ref={tableRef} 
                            id="assignmentTable" 
                            className="table table-striped">
                        <thead>
                            <tr>                        
                                {
                                    cycleColumns.map((column) => (
                                        <th className="h6 text-gray-300" key={column.data}>{column.title}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        </table>
                    </div>
                </div>
            </div>
        </section>
     );
}
 
export default Cycles;