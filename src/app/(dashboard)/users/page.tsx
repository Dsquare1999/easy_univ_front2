'use client'
import { deleteUserAction, turnProfessorAction, turnStudentAction, usersListAction } from "@/core/application/actions/user.action";
import { useAppDispatch } from "@/core/application/hooks";
import { UserEntity } from "@/core/domain/entities/user.entity";
import { useEffect, useState } from "react";

import DOMPurify from 'dompurify';
import { toast } from "react-toastify";

const Usersection = () => {
    const dispatch = useAppDispatch();
    const [userData, setUserData] = useState<UserEntity[] | undefined>(undefined);

    useEffect(() => {
        dispatch(usersListAction())
          .unwrap()
          .then((users) => {
            setUserData(users.data);
          })
          .catch((error) => {
            console.error("Failed to fetch users: ", error.message || error);
            alert("Erreur : " + (error.message || error));
          });
    }, [dispatch]);


    const handleTurnProfessor = async (id: string) => {
        await dispatch(turnProfessorAction({ id }))
            .unwrap()
            .then((response : any) => {
                if(response.success){
                    toast.success(response.message);
                    console.log('response', response.data)
                    setUserData(prevData => prevData?.map(user => 
                        user.id === id ? { ...user, type: 1 } : user
                    ));
                }
            })
            .catch((error) => {
                console.error("Failed to turn professor: ", error.message || error);
                alert("Erreur : " + (error.message || error));
            });
    }

    const handleTurnStudent = async (id: string) => {
        await dispatch(turnStudentAction({ id }))
            .unwrap()
            .then((response : any) => {
                if(response.success){
                    toast.success(response.message);
                    console.log('response', response.data)
                    setUserData(prevData => prevData?.map(user => 
                        user.id === id ? { ...user, type: 0 } : user
                    ));
                }
            })
            .catch((error) => {
                console.error("Failed to turn student: ", error.message || error);
                alert("Erreur : " + (error.message || error));
            });
    }

    const handleDeleteUser = async (id: string) => {
        await dispatch(deleteUserAction({ id }))
            .unwrap()
            .then((response : any) => {
                if(response.success){
                    toast.success(response.message);
                    console.log('response', response.data)
                    setUserData(prevData => prevData?.filter(user => user.id !== id));
                }
            })
            .catch((error) => {
                console.error("Failed to turn student: ", error.message || error);
                alert("Erreur : " + (error.message || error));
            });
    }

    const limitWords = (text: string, limit:number) => {
        const words = text?.split(" ");
        if (words?.length > limit) {
          return words.slice(0, limit).join(" ") + "...";
        }
        return text;
    };


    return ( 
        <section>
            <div className="dashboard-body">
                <div className="breadcrumb mb-24">
                    <ul className="flex-align gap-4">
                        <li><a href="index.html" className="text-gray-200 fw-normal text-15 hover-text-main-600">Easy Univ</a></li>
                        <li> <span className="text-gray-500 fw-normal d-flex"><i className="ph ph-caret-right"></i></span> </li>
                        <li><span className="text-main-600 fw-normal text-15">Utilisateurs</span></li>
                    </ul>
                </div>
                <div className="card mt-24">
                <div className="card-body">
                    <div className="mb-20 flex-between flex-wrap gap-8">
                        <h4 className="mb-0">Tous les utilisateurs</h4>

                        <div className="flex-align gap-8 flex-wrap">
                            <div className="flex-align text-gray-500 text-13 border border-gray-100 rounded-4 ps-8 focus-border-main-600">
                                <span className="text-lg"><i className="ph ph-layout"></i></span>
                                <select className="form-control px-8 py-12 border-0 text-inherit rounded-4 text-center">
                                    <option value="1" selected disabled>Category</option>
                                    <option value="1">Web</option>
                                    <option value="1">Design</option>
                                    <option value="1">App</option>
                                    <option value="1">SEO</option>
                                </select>
                            </div>
                            <div className="position-relative text-gray-500 flex-align gap-4 text-13">
                                <span className="text-inherit">Sort by: </span>
                                <div className="flex-align text-gray-500 text-13 border border-gray-100 rounded-4 ps-8 focus-border-main-600">
                                    <span className="text-lg"><i className="ph ph-funnel-simple"></i></span>
                                    <select className="form-control px-8 py-12 border-0 text-inherit rounded-4 text-center">
                                        <option value="1" selected>Popular</option>
                                        <option value="1">Latest</option>
                                        <option value="1">Trending</option>
                                        <option value="1">Matches</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <div className="row g-20">
                        {userData?.map((user) => <div key={user.id} className="col-xl-3 col-md-4 col-sm-6">
                            <div className="mentor-card rounded-8 overflow-hidden">
                                <div className="mentor-card__cover position-relative">
                                    <img src={user?.cover ? `${process.env.NEXT_PUBLIC_HOST}/storage/${user?.cover}` : "/assets/images/setting_cover_img.png"} alt="" className="cover-img" />

                                    <button type="button" className="follow-btn py-2 px-8 flex-align gap-4 text-13 fw-medium text-white border border-white rounded-pill position-absolute inset-block-start-0 inset-inline-end-0 mt-8 me-8 transition-1"> 
                                        <i className="ph ph-chats-circle d-flex"></i> 
                                        <span className="text-xs">Message</span>
                                    </button>
                                </div>
                                <div className="mentor-card__content text-center">
                                    <div className="w-56 h-56 rounded-circle overflow-hidden border border-white d-inline-block">
                                        <a href="setting.html" className="">
                                            <img src={user?.profile ? `${process.env.NEXT_PUBLIC_HOST}/storage/${user?.profile}` :  "/assets/images/user_placeholder.jpg"} alt="Profile Image" className="mentor-card__img cover-img" />
                                        </a>
                                    </div>
                                    <h5 className="mb-0">
                                        <a href="setting.html">{user?.lastname} {user?.firstname}</a>
                                    </h5>
                                    <span className="text-13 text-gray-500">{user?.type === 0 ? "Etudiant" : "Professeur"}</span>

                                    <div 
                                            className="mt-20 text-gray-600 text-14 text-line-2" 
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(limitWords(user?.bio, 20)) }} 
                                        />

                                    <div className="mentor-card__rating mt-20 border border-gray-100 px-8 py-6 rounded-8 flex justify-center items-center gap-10 flex-wrap">
                                        {user?.type === 0 ? <button type="button" className="rounded-4 border btn btn-main py-4 px-10 text-sm" onClick={() => handleTurnProfessor(user?.id)}>
                                            <i className="ph ph-user"></i> Rendre Professeur
                                        </button> :
                                        <button type="button" className="rounded-4 border btn btn-success py-4 px-10 text-sm" onClick={() => handleTurnStudent(user?.id)}>
                                            <i className="ph ph-student"></i> Rendre Etudiant
                                        </button>}
                                        <button type="button" className="rounded-4 btn btn-danger py-4 px-10 text-sm" onClick={() => handleDeleteUser(user?.id)}>
                                            <i className="ph ph-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>

                    <div className="flex-between flex-wrap gap-8 mt-20">
                        <a href="#" className="btn btn-outline-gray rounded-pill py-9 flex-align gap-4">
                            <span className="d-flex text-xl"><i className="ph ph-arrow-left"></i></span> 
                            Previous
                        </a>
                        <ul className="pagination flex-align flex-wrap">
                            <li className="page-item active">
                                <a className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium" href="#">1</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium" href="#">2</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium" href="#">3</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium" href="#">...</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium" href="#">8</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium" href="#">9</a>
                            </li>
                            <li className="page-item">
                                <a className="page-link h-44 w-44 flex-center text-15 rounded-8 fw-medium" href="#">10</a>
                            </li>
                        </ul>
                        <a href="#" className="btn btn-outline-main rounded-pill py-9 flex-align gap-4">
                            Next <span className="d-flex text-xl"><i className="ph ph-arrow-right"></i></span> 
                        </a>
                    </div>
                    
                </div>
            </div>
            </div>
        </section>
     );
}
 
export default Usersection;