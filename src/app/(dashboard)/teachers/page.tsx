"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  deleteUserAction,
  turnProfessorAction,
  turnStudentAction,
  usersListAction,
} from "@/core/application/actions/user.action";
import { useAppDispatch } from "@/core/application/hooks";
import { UserEntity } from "@/core/domain/entities/user.entity";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { classeListAction } from "@/core/application/actions/classe.action";
import {
  ClasseEntity,
  MatiereEntity,
} from "@/core/domain/entities/classe.entity";

const Teacher = () => {
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<UserEntity[] | undefined>(undefined);
  const [classes, setClasses] = useState<ClasseEntity[]>([]);
  const [matieres, setMatieres] = useState<MatiereEntity[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<UserEntity | null>(
    null
  );
  const [teacherClasses, setTeacherClasses] = useState<
    {
      classe: ClasseEntity;
      matiere: MatiereEntity;
    }[]
  >([]);

  useEffect(() => {
    dispatch(classeListAction())
      .unwrap()
      .then((classes) => {
        setUserData(classes.teachers);
        setClasses(classes.data);
      })
      .catch((error) => {
        console.error("Failed to fetch teachers: ", error.message || error);
        alert("Erreur : " + (error.message || error));
      });
  }, [dispatch, setUserData, setClasses]);

  const handleDeleteUser = async (id: string) => {
    await dispatch(deleteUserAction({ id }))
      .unwrap()
      .then((response: any) => {
        if (response.success) {
          toast.success(response.message);
          console.log("response", response.data);
          setUserData((prevData) => prevData?.filter((user) => user.id !== id));
        }
      })
      .catch((error) => {
        console.error("Failed to turn student: ", error.message || error);
        alert("Erreur : " + (error.message || error));
      });
  };

  const handleViewDetails = (teacher: UserEntity) => {
    setSelectedTeacher(teacher);
    const teacherClassList = classes.reduce((acc: any[], classe) => {
      const teacherMatieres =
        classe.matieres?.filter(
          (matiere) => matiere.teacher?.id === teacher.id
        ) || [];

      teacherMatieres.forEach((matiere) => {
        acc.push({ classe, matiere });
      });
      return acc;
    }, []);

    setTeacherClasses(teacherClassList);
    setShowPanel(true);
  };

  const limitWords = (text: string, limit: number) => {
    const words = text?.split(" ");
    if (words?.length > limit) {
      return words.slice(0, limit).join(" ") + "...";
    }
    return text;
  };

  return (
    <section className="relative">
      <div className="dashboard-body">
        <div className="breadcrumb mb-24">
          <ul className="flex-align gap-4">
            <li>
              <a
                href="index.html"
                className="text-gray-200 fw-normal text-15 hover-text-main-600"
              >
                Easy Univ
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
                Enseignants
              </span>
            </li>
          </ul>
        </div>
        <div className="card mt-24">
          <div className="card-body">
            <div className="mb-20 flex-between flex-wrap gap-8">
              <h4 className="mb-0">Tous les enseignants</h4>

              <div className="flex-align gap-8 flex-wrap">
                <div className="flex-align text-gray-500 text-13 border border-gray-100 rounded-4 ps-8 focus-border-main-600">
                  <span className="text-lg">
                    <i className="ph ph-layout"></i>
                  </span>
                  <select className="form-control px-8 py-12 border-0 text-inherit rounded-4 text-center">
                    <option value="1" selected disabled>
                      Category
                    </option>
                    <option value="1">Web</option>
                    <option value="1">Design</option>
                    <option value="1">App</option>
                    <option value="1">SEO</option>
                  </select>
                </div>
                <div className="position-relative text-gray-500 flex-align gap-4 text-13">
                  <span className="text-inherit">Sort by: </span>
                  <div className="flex-align text-gray-500 text-13 border border-gray-100 rounded-4 ps-8 focus-border-main-600">
                    <span className="text-lg">
                      <i className="ph ph-funnel-simple"></i>
                    </span>
                    <select className="form-control px-8 py-12 border-0 text-inherit rounded-4 text-center">
                      <option value="1" selected>
                        Popular
                      </option>
                      <option value="1">Latest</option>
                      <option value="1">Trending</option>
                      <option value="1">Matches</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-20">
              {userData?.map((user) => (
                <div key={user.id} className="col-xl-3 col-md-4 col-sm-6">
                  <div className="mentor-card rounded-8 overflow-hidden">
                    <div className="mentor-card__cover position-relative">
                      <img
                        src={
                          user?.cover
                            ? `${process.env.NEXT_PUBLIC_HOST}/storage/${user?.cover}`
                            : "/assets/images/setting_cover_img.png"
                        }
                        alt=""
                        className="cover-img"
                      />

                      <button
                        type="button"
                        className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                      >
                        <i className="ph ph-chats-circle d-flex"></i>
                        <span className="text-xs">Message</span>
                      </button>
                    </div>
                    <div className="mentor-card__content text-center">
                      <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                        <a href="setting.html" className="">
                          <img
                            src={
                              user?.profile
                                ? `${process.env.NEXT_PUBLIC_HOST}/storage/${user?.profile}`
                                : "/assets/images/user_placeholder.jpg"
                            }
                            alt="Profile Image"
                            className="mentor-card__img cover-img"
                          />
                        </a>
                      </div>
                      <h5 className="mb-0">
                        <a href="setting.html">
                          {user?.lastname} {user?.firstname}
                        </a>
                      </h5>
                      <span className="text-13 text-gray-500">
                        {user?.type === 0 ? "Etudiant" : "Professeur"}
                      </span>

                      <div
                        className="mt-20 text-gray-600 text-14 text-line-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(limitWords(user?.bio, 10)),
                        }}
                      />

                      <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex justify-center items-center gap-10 flex-wrap">
                        
                        <Sheet>
                          <SheetTrigger asChild onClick={() => handleViewDetails(user)}>
                            <button type="button" className="rounded-4 border btn btn-success py-4 px-10 text-sm">
                                <i className="ph ph-student"></i> Voir Details
                            </button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader className="mb-20">
                              <div className="mentor-card rounded-8 overflow-hidden">
                                <div className="mentor-card__cover position-relative">
                                  <img
                                    src={
                                      user?.cover
                                        ? `${process.env.NEXT_PUBLIC_HOST}/storage/${user?.cover}`
                                        : "/assets/images/setting_cover_img.png"
                                    }
                                    alt=""
                                    className="cover-img"
                                  />

                                  <button
                                    type="button"
                                    className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"
                                  >
                                    <i className="ph ph-chats-circle d-flex"></i>
                                    <span className="text-xs">Message</span>
                                  </button>
                                </div>
                                <div className="mentor-card__content text-center">
                                  <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                                    <a href="setting.html" className="">
                                      <img
                                        src={
                                          user?.profile
                                            ? `${process.env.NEXT_PUBLIC_HOST}/storage/${user?.profile}`
                                            : "/assets/images/user_placeholder.jpg"
                                        }
                                        alt="Profile Image"
                                        className="mentor-card__img cover-img"
                                      />
                                    </a>
                                  </div>
                                  <h5 className="mb-0">
                                    <a href="setting.html">
                                      {user?.lastname} {user?.firstname}
                                    </a>
                                  </h5>
                                  <span className="text-13 text-gray-500">
                                    {user?.type === 0
                                      ? "Etudiant"
                                      : "Professeur"}
                                  </span>

                                  <SheetDescription>
                                    <div dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
                                        limitWords(user?.bio, 25)
                                      ),
                                    }}
                                  />
                                </SheetDescription>
                                </div>
                              </div>
                            </SheetHeader>
                            {selectedTeacher && (
                                <div className="space-y-4 h-[50vh] overflow-y-scroll">
                                    {teacherClasses.map(({ classe, matiere }, index) => (
                                        <div key={index} className="border rounded-lg p-4">
                                            <h5 className="text-main text-sm">{matiere.name} ({matiere.code})</h5>
                                            <div className="space-y-2 text-sm text-gray-500">
                                                <div className="flex gap-6 w-100 justify-between items-center">
                                                    <div className="flex flex-col gap-3  w-100">
                                                        <span className="fw-bold text-xs">Cycle</span>
                                                        <span className=" text-xs">{classe.cycle.name}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-3  w-100">
                                                        <span className="fw-bold text-xs">Filière</span>
                                                        <span className=" text-xs">{classe.filiere.name}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6 w-100 justify-between items-center">
                                                    <div className="flex flex-col gap-3  w-100">
                                                        <span className="fw-bold text-xs">Academic (Year)</span>
                                                        <span className=" text-xs">({classe.academic_year} - {classe.academic_year + 1}) ({classe.year} années)</span>
                                                    </div>
                                                    <div className="flex flex-col gap-3  w-100">
                                                        <span className="fw-bold text-xs">Coefficient (Volume)</span>
                                                        <span className=" text-xs">{matiere.coefficient} Crédits ({matiere.hours}h)</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-6 w-100 justify-between items-center">
                                                    <div className="flex flex-col gap-3 w-100">
                                                        <span className="fw-bold text-xs">Effectif</span>
                                                        <span className=" text-xs">{matiere.releves?.length || 0} étudiants</span>
                                                    </div>
                                                    <div className="flex flex-col gap-3 w-100">
                                                        <span className="fw-bold text-xs">Format</span>
                                                        <span className=" text-xs">{classe.parts == 'TRI' ? 'sTrimestre' : 'Semestre'} </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {teacherClasses.length == 0 &&
                                    <div className="p-10">
                                        <h5 className="text-main text-center">
                                            Aucun cours assigné 
                                        </h5>
                                        <p className="text-muted text-center text-xs">Cet enseignant n'a pour l'instant aucun cours à son actif</p>
                                    </div> }
                                </div>)}

                            <SheetFooter className="mt-20">
                              <button
                                type="button"
                                className="rounded-4 btn btn-danger py-4 px-10 text-xs mt-4"
                                onClick={() => handleDeleteUser(user?.id)}
                              >
                                Supprimer Enseignant
                              </button>
                              <SheetClose asChild>
                                <button
                                  type="button"
                                  className="rounded-4 btn btn-secondary py-4 px-10 text-xs mt-4"
                                >
                                  Fermer
                                </button>
                              </SheetClose>
                            </SheetFooter>
                          </SheetContent>
                        </Sheet>
                        <button
                          type="button"
                          className="rounded-4 btn btn-danger py-4 px-10 text-sm"
                          onClick={() => handleDeleteUser(user?.id)}
                        >
                          <i className="ph ph-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-between flex-wrap gap-8 mt-20">
              <a
                href="#"
                className="btn btn-outline-gray rounded-pill py-9 flex-align gap-4"
              >
                <span className="d-flex text-xl">
                  <i className="ph ph-arrow-left"></i>
                </span>
                Précédent
              </a>
              <ul className="pagination flex-align flex-wrap">
                <li className="page-item active">
                  <a
                    className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                    href="#"
                  >
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a
                    className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                    href="#"
                  >
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a
                    className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                    href="#"
                  >
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a
                    className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                    href="#"
                  >
                    ...
                  </a>
                </li>
                <li className="page-item">
                  <a
                    className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                    href="#"
                  >
                    8
                  </a>
                </li>
                <li className="page-item">
                  <a
                    className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                    href="#"
                  >
                    9
                  </a>
                </li>
                <li className="page-item">
                  <a
                    className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium"
                    href="#"
                  >
                    10
                  </a>
                </li>
              </ul>
              <a
                href="#"
                className="btn btn-outline-main rounded-pill py-9 flex-align gap-4"
              >
                Suivant{" "}
                <span className="d-flex text-xl">
                  <i className="ph ph-arrow-right"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Teacher;
