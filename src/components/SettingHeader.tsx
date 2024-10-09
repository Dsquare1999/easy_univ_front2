"use client";
import { updateCoverAction } from "@/core/application/actions/user.action";
import { useAppDispatch } from "@/core/application/hooks";
import { CoverSchema } from "@/core/application/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const SettingHeader = () => {
    const dispatch = useAppDispatch();
    const { data: session, status, update } = useSession();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [join, setJoin] = useState<string | undefined>(session?.user?.created_at);
    const [previewImage, setPreviewImage] = useState<string>(
      session?.user?.cover ? `${process.env.NEXT_PUBLIC_HOST}/storage/${session?.user?.cover}` : "/assets/images/setting_cover_img.png"
    );
    const [profileImage, setProfileImage] = useState<string>(
        session?.user?.profile ? `${process.env.NEXT_PUBLIC_HOST}/storage/${session?.user?.profile}`: "/assets/images/user_placeholder.jpg"
    );

    const form = useForm<z.infer<typeof CoverSchema>>({
        resolver: zodResolver(CoverSchema),
        defaultValues: {
          cover: undefined
        },
    });

    const handleCoverImageChange = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];
      console.log(file)
      if (file) {
        setCoverImage(file);
        const coverUrl = URL.createObjectURL(file);
        setPreviewImage(coverUrl);
      }
    };

    const onSubmit = async (values: z.infer<typeof CoverSchema>) => {
        setIsLoading(true)
        await dispatch(updateCoverAction(values))
            .unwrap()
            .then(async (response: any) => {
                console.log(response)
                if(response.success){
                    toast.success(response.message);
                    const updatedUser = response.data;
                        await update({
                        user: updatedUser
                    });
                }else{
                    if(response.data.errors.cover){
                        response.data.errors.cover.map((error:string) => {
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

    useEffect(() => {
        if (coverImage) {
          form.setValue("cover", coverImage);
          form.handleSubmit(onSubmit)(); 
        }
    }, [coverImage]);

    useEffect(() => {
        if (session?.user?.cover){
            setPreviewImage(
                session?.user?.cover ? `${process.env.NEXT_PUBLIC_HOST}/storage/${session?.user?.cover}` : "/assets/images/setting_cover_img.png"
            )
        }
        if (session?.user?.profile){
            setProfileImage(
              `${process.env.NEXT_PUBLIC_HOST}/storage/${session?.user?.profile}` || "/assets/images/user_placeholder.jpg"
            )
        }
        if(session?.user?.firstname) setFirstname(session?.user?.firstname as string)
          if(session?.user?.lastname) setLastname(session?.user?.lastname as string)

        if(session?.user?.created_at){
            setJoin(formatJoinDate(session?.user?.created_at))
        }
        
    }, [session?.user])

    const formatJoinDate = (createdAt: string) => {
        const date = new Date(createdAt);
      
        const options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
        const formattedDate = date.toLocaleDateString("fr-FR", options);
      
        return `A rejoint en ${formattedDate}`;
    };
      
  return (
    <div className="card-body p-0">
      <div className="cover-img position-relative">
        <label
          htmlFor="coverImageUpload"
          className="btn border-gray-200 text-gray-200 fw-normal hover-bg-gray-400 rounded-pill py-4 px-14 position-absolute inset-block-start-0 inset-inline-end-0 mt-24 me-24"
        >
          Editer Image de Couverture
        </label>
        <div className="avatar-upload">
          <input
            type="file"
            id="coverImageUpload"
            accept=".png, .jpg, .jpeg"
            onChange={handleCoverImageChange}
          />
          <div className="avatar-preview">
            <div
              id="coverImagePreview"
              style={{ backgroundImage: `url(${previewImage})` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="setting-profile px-24">
        <div className="flex-between">
          <div className="d-flex align-items-end flex-wrap mb-32 gap-24">
            <img
              src={profileImage}
              alt="Photo de profil"
              className="w-120 h-120 rounded-circle border border-white"
            />
            <div>
              <h4 className="mb-8">{lastname} {firstname}</h4>
              <div className="setting-profile__infos flex-align flex-wrap gap-16">
                <div className="flex-align gap-6">
                  <span className="text-gray-600 d-flex text-lg">
                    <i className="ph ph-swatches"></i>
                  </span>
                  <span className="text-gray-600 d-flex text-15">
                    Etudiant(e)
                  </span>
                </div>
                <div className="flex-align gap-6">
                  <span className="text-gray-600 d-flex text-lg">
                    <i className="ph ph-map-pin"></i>
                  </span>
                  <span className="text-gray-600 d-flex text-15">
                    Porto-Novo, Bénin
                  </span>
                </div>
                <div className="flex-align gap-6">
                  <span className="text-gray-600 d-flex text-lg">
                    <i className="ph ph-calendar-dots"></i>
                  </span>
                  <span className="text-gray-600 d-flex text-15">
                    {join}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul
          className="nav common-tab style-two nav-pills mb-0"
          id="pills-tab"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-details-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-details"
              type="button"
              role="tab"
              aria-controls="pills-details"
              aria-selected="true"
            >
              Mes Détails
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Profil
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-password-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-password"
              type="button"
              role="tab"
              aria-controls="pills-password"
              aria-selected="false"
            >
              Mot de Passe
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-plan-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-plan"
              type="button"
              role="tab"
              aria-controls="pills-plan"
              aria-selected="false"
            >
              Statut
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-billing-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-billing"
              type="button"
              role="tab"
              aria-controls="pills-billing"
              aria-selected="false"
            >
              Facturation
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingHeader;
