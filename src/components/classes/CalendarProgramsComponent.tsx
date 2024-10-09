'use client'
import { ClasseEntity, MatiereEntity } from "@/core/domain/entities/classe.entity";
import Calendar from "./Calendar";
import { useEffect, useState } from "react";

interface EventsPageProps {
  classes: ClasseEntity[];
  onRetour: (classeData: ClasseEntity[]) => void;
}

const EventsPage = ({classes, onRetour} : EventsPageProps) => {

  const [matieres, setMatieres] = useState<MatiereEntity[]>([]);

  useEffect(() => {
    if (classes && classes.length > 0) {
      let matieres: MatiereEntity[] = [];
      classes.map((classe: ClasseEntity) => {
        if (classe.matieres){
          classe.matieres.map((matiere: MatiereEntity) => {
            matieres.push(matiere);
          })
          setMatieres(matieres);
        }
      })
    }
  }, [classes]);

  return (
    <div className="dashboard-body">
      <div className="breadcrumb mb-24">
      <ul className="flex-align gap-4">
          <li><a href="" className="text-gray-200 fw-normal text-15 hover-text-main-600">EasyUniv</a></li>
          <li> <span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span> </li>
          <li><span className="text-main-600 fw-normal text-15 cursor-pointer" onClick={() => onRetour(classes)}>Classes<i className="ph ph-caret-right"></i></span></li>
          <li><a href="" className="text-gray-200 fw-normal text-15 hover-text-main-600">Programmes</a></li>

      </ul>
      </div>
      <div className="card mt-24 bg-transparent">
        <div className="card-body p-0">
          <Calendar matieres={matieres} />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
