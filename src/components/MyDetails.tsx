"use client";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DetailSchema } from "@/core/application/schemas";
import { useAppDispatch } from "@/core/application/hooks";
import { addDetailsAction } from "@/core/application/actions/user.action";
import { toast } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { serialize } from "v8";

// Step 1: Create Zod schema for validation
type FormData = z.infer<typeof DetailSchema>;

const MyDetails = () => {
  const router = useRouter();
  const [bio, setBio] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { data: session, status, update } = useSession();

  const [profileImage, setProfileImage] = useState<string>(
    session?.user?.profile ? `${process.env.NEXT_PUBLIC_HOST}/storage/${session?.user?.profile}`: "/assets/images/user_placeholder.jpg"
  );
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(DetailSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue("profile", file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string); 
      };
      reader.readAsDataURL(file);
      setValue("profile", file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    if(session?.user?.phone) setValue("phone", session?.user?.phone as string)
    if(session?.user?.firstname) setValue("firstname", session?.user?.firstname as string)
    if(session?.user?.lastname) setValue("lastname", session?.user?.lastname as string)
    if(session?.user?.email) setValue("email", session?.user?.email as string)
    if(session?.user?.bio) setBio(session?.user?.bio as string)

    if (session?.user?.profile){
      setProfileImage(
        `${process.env.NEXT_PUBLIC_HOST}/storage/${session?.user?.profile}` || "/assets/images/user_placeholder.jpg"
      )
    }
    
  }, [session?.user])


  const onSubmit = async (values: FormData) => {
    values.bio = bio;
    setIsLoading(true)
    await dispatch(addDetailsAction(values))
        .unwrap()
        .then(async (response: any) => {
          console.log(response)
          if(response.success){
            toast.success(response.message);

            const updatedUser = response.data;
            await update({
              user: updatedUser
            });
            reset();
            
          }else{
            if(response.data.errors.profile){
              response.data.errors.profile.map((error:string) => {
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
    <div className="card mt-24">
      <div className="card-header border-bottom">
        <h4 className="mb-4">Mes Détails</h4>
        <p className="text-gray-600 text-15">Complétez vos informations</p>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row gy-4">
            <div className="col-sm-6 col-xs-6">
              <label htmlFor="lastname" className="form-label mb-8 h6">
                Nom
              </label>
              <input
                type="text"
                className="form-control py-11"
                id="lastname"
                placeholder="Enter First Name"
                {...register("lastname")}
              />
              {errors.lastname && <p className="text-danger">{errors.lastname.message}</p>}
            </div>
            <div className="col-sm-6 col-xs-6">
              <label htmlFor="fname" className="form-label mb-8 h6">
                Prénoms
              </label>
              <input
                type="text"
                className="form-control py-11"
                id="firstname"
                placeholder="Enter First Name"
                {...register("firstname")}
              />
              {errors.firstname && <p className="text-danger">{errors.firstname.message}</p>}
            </div>
            <div className="col-sm-6 col-xs-6">
              <label htmlFor="email" className="form-label mb-8 h6">
                Email
              </label>
              <input
                type="email"
                className="form-control py-11"
                id="email"
                placeholder="Enter Email"
                {...register("email")}
              />
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>
            <div className="col-sm-6 col-xs-6">
              <label htmlFor="phone" className="form-label mb-8 h6">
                Téléphone
              </label>
              <input
                type="text"
                className="form-control py-11"
                id="phone"
                placeholder="Enter Phone Number"
                {...register("phone")}
              />
              {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
            </div>
            <div className="col-12">
              <label htmlFor="imageUpload" className="form-label mb-8 h6">
                Photo
              </label>
              <div className="flex-align gap-22">
                <div className="avatar-upload flex-shrink-0">
                  <input
                    type="file"
                    id="imageUpload"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleImageChange}
                  />
                  <div className="avatar-preview">
                    <div
                      id="profileImagePreview"
                      style={{
                        backgroundImage: `url(${profileImage})`,
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  className="avatar-upload-box text-center position-relative flex-grow-1 py-24 px-4 rounded-16 border border-main-300 border-dashed bg-main-50 hover-bg-main-100 hover-border-main-400 transition-2 cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <label
                    htmlFor="imageUpload"
                    className="position-absolute inset-block-start-0 inset-inline-start-0 w-100 h-100 rounded-16 cursor-pointer z-1"
                  ></label>
                  <span className="text-32 icon text-main-600 d-inline-flex">
                    <i className="ph ph-upload"></i>
                  </span>
                  <span className="text-13 d-block text-gray-400 text my-8">
                    Cliquer pour charger ou glisser et déposer
                  </span>
                  <span className="text-13 d-block text-main-600">
                    SVG, PNG, JPEG OR GIF (max 1080px1200px)
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="editor">
                <label className="form-label mb-8 h6">Bio</label>
                <ReactQuill
                  theme="snow"
                  value={bio}
                  onChange={setBio}
                  placeholder="Je suis en étudiant en quête de savoir à EasyUniv"
                />
              </div>
            </div>
            <div className="col-12">
              <div className="flex-align justify-content-end gap-8">
                <button
                  type="reset"
                  className="btn btn-outline-main bg-main-100 border-main-100 text-main-600 rounded-pill py-9"
                  onClick={() => reset()}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-main rounded-pill py-9"
                  disabled={isLoading}
                >
                  
                  {isLoading ? "Enregistrement en cours..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyDetails;
