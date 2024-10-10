"use client"
import $ from "jquery";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/core/application/hooks";
import { tagCreateAction, tagListAction } from "@/core/application/actions/tag.action";
import { TagEntity } from "@/core/domain/entities/tag.entity";
import { useForm } from "react-hook-form";
import { TagSchema } from "@/core/application/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Form } from "@/components/ui/form";


const Tags = () => {
    require('datatables.net-bs5');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [tagData, setTagData] = useState<TagEntity[] | undefined>(undefined);

    const tableRef = useRef<HTMLTableElement>(null);

    const tagColumns = [
        { data: "name", title: "Nom" },
        { data: "fee", title: "Frais" },
    ];

    useEffect(() => {
        if (tableRef.current) {      
            $(tableRef.current).DataTable({
              searching: true,
              lengthChange: true,
              info: true,
              paging: true,
              columns: tagColumns,
            });
        }
      
          return () => {
            if (tableRef.current) {
              $(tableRef.current).DataTable().destroy();
            }
          };
    }, []);

    useEffect(() => {
        dispatch(tagListAction())
          .unwrap()
          .then((tags) => {
            setTagData(tags.data);
          })
          .catch((error) => {
            console.error("Failed to fetch tags: ", error.message || error);
            alert("Erreur : " + (error.message || error));
          });
        
    }, [dispatch]);


    useEffect(() => {    
        if (tableRef.current) {
            const datatable = $(tableRef.current).DataTable()

            datatable.clear().draw();
            datatable.rows.add(tagData || []).draw();
            datatable.columns.adjust().draw();
        }
    }, [tagData, tableRef]);



    const form = useForm<z.infer<typeof TagSchema>>({
        resolver: zodResolver(TagSchema),
        defaultValues: {
          name: "",
          fee: 1,
        },
      });
    
    const onSubmit = async (values: z.infer<typeof TagSchema>) => {
        alert(JSON.stringify(values))
        setIsLoading(true)
        await dispatch(tagCreateAction(values))
            .unwrap()
            .then((response: any) => {
              console.log(response)
              if(response.success){
                toast.success(response.message);
                setTagData((prevData) => [
                    ...(prevData || []),
                    {
                        name: response.data.name,
                        fee: response.data.fee
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
                            <li><span className="text-main-600 fw-normal text-15">tags</span></li>
                        </ul>
                    </div>
                    <button type="button" className="border btn-main rounded-pill py-8 px-20" data-bs-toggle="modal" data-bs-target="#tagCreate">
                        <i className="ph ph-caret-plus"></i> Ajouter tag
                    </button>
                    
                    <div className="modal fade" id="tagCreate" tabIndex={-1} aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="tag-add-title">Ajouter un tag</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <input 
                                            type="text" 
                                            id="name" 
                                            className="form-control mb-20" 
                                            placeholder="Ajouter un nom au tag" 
                                            {...form.register("name")} 
                                            />
                                        
                                        <div className="input-group mb-3">
                                            <input
                                                type="number"
                                                id="fee"
                                                step={0.01}
                                                className="form-control"
                                                placeholder="Durée du tag"
                                                {...form.register("fee", {
                                                  setValueAs: (v) => v === "" ? undefined : parseFloat(v),
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
                          className="table table-striped"
                        >
                        <thead>
                            <tr>                        
                                {
                                    tagColumns.map((column) => (
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
 
export default Tags;