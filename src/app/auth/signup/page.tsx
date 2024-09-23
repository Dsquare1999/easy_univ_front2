"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegistrationSchema } from "@/core/application/schemas";
import React from "react";
import { Form } from "@/components/ui/form";
import { registerAction } from "@/core/application/actions/user.action";
import { useAppDispatch } from "@/core/application/hooks";
import { useRegisterMutation } from "@/core/infra/api";
import { useRouter } from "next/navigation";

interface RegisterProps {}

const Register: React.FunctionComponent<RegisterProps> = () => {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof RegistrationSchema>>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegistrationSchema>) => {
      setIsLoading(true)
      await dispatch(registerAction(values))
          .unwrap()
          .then((response: any) => {
            console.log(response)
            if(response.success){
              toast.success(response.message);
              setTimeout(() => {
                router.push('/auth/signin');
              }, 5000);
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
          .catch((error) => {
            toast.error("Impossible d'exécuter la requête");
            console.log(error)
          })
          .finally(() => {
            setIsLoading(false)
          });

  };

  return (
    <section className="auth d-flex">
      <div className="auth-left bg-main-50 flex-center p-24">
        <Image
          src="/assets/images/thumbs/sign_up.png"
          alt="Image"
          width={500}
          height={500}
        />
      </div>
      <div className="auth-right py-40 px-24 flex-center flex-column">
        <div className="auth-right__inner mx-auto w-100">
          <a href="index.html" className="auth-right__logo">
            <Image
              src="/assets/images/logo/logo_easy_univ_bleu.svg"
              alt="Image"
              width={200}
              height={50}
            />
          </a>
          <h2 className="mb-8">Inscription</h2>
          <p className="text-gray-600 text-15 mb-32">
            Bienvenue à Easy Univ, créez votre compte et entamez l'aventure
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-24">
                <label htmlFor="username" className="form-label mb-8 h6">
                  Nom et Prénoms
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control py-11 ps-40"
                    id="name"
                    placeholder="John Doe"
                    {...form.register("name")}
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-user"></i>
                  </span>
                </div>
              </div>
              <div className="mb-24">
                <label htmlFor="email" className="form-label mb-8 h6">
                  Email
                </label>
                <div className="position-relative">
                  <input
                    type="email"
                    className="form-control py-11 ps-40"
                    id="email"
                    placeholder="johndoe@gmail.com"
                    {...form.register("email")}
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-envelope"></i>
                  </span>
                </div>
              </div>
              <div className="mb-24">
                <label htmlFor="password" className="form-label mb-8 h6">
                  Mot de Passe
                </label>
                <div className="position-relative">
                  <input
                    type="password"
                    className="form-control py-11 ps-40"
                    id="password"
                    placeholder="********"
                    {...form.register("password")}
                  />
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-lock"></i>
                  </span>
                </div>
                <span className="text-gray-900 text-15 mt-4">
                  Au moins 8 caractères
                </span>
              </div>
              <button
                type="submit"
                className="btn btn-main rounded-pill w-100"
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "S'inscrire"}
              </button>
              <p className="mt-32 text-gray-600 text-center">
                Vous avez déjà un compte ?
                <a
                  href="sign-in.html"
                  className="text-main-600 hover-text-decoration-underline"
                >
                  {" "}
                  Connectez-vous
                </a>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Register;
