"use client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/core/application/schemas";
import React from "react";
import { signIn } from "next-auth/react";
import { Form } from "@/components/ui/form";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";

interface LoginProps {}

const Login: React.FunctionComponent<LoginProps> = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Utilisation de react-hook-form avec zod pour la validation des schémas
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!result?.ok) {
        toast.error("Informations de connexion invalides");
      }else{
        router.push("/classes")
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="auth d-flex">
      <div className="auth-left bg-main-50 flex-center p-24">
        <Image
          src="/assets/images/thumbs/sign_in.png"
          alt="Image"
          width={500}
          height={500}
        />
      </div>
      <div className="auth-right py-40 px-24 flex-center flex-column">
        <div className="auth-right__inner mx-auto w-100">
          <a href="/" className="auth-right__logo">
            <Image
              src="/assets/images/logo/logo_easy_univ_bleu.svg"
              alt="Image"
              width={200}
              height={50}
            />
          </a>
          <h2 className="mb-8">Connexion</h2>
          <p className="text-gray-600 text-15 mb-32">
            Entrez vos informations d'identification et profitez de l'expérience
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                {form.formState.errors.email && (
                  <p className="text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
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
                  <span className="position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ph ph-eye-slash"></span>
                  <span className="position-absolute top-50 translate-middle-y ms-16 text-gray-600 d-flex">
                    <i className="ph ph-lock"></i>
                  </span>
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-600">
                    {form.formState.errors.password.message}
                  </p>
                )}
                <span className="text-gray-900 text-15 mt-4">
                  Au moins 8 caractères
                </span>
              </div>

              <div className="mb-32 flex-between flex-wrap gap-8">
                <div className="form-check mb-0 flex-shrink-0">
                  <input
                    className="form-check-input flex-shrink-0 rounded-4"
                    type="checkbox"
                    value=""
                    id="remember"
                  />
                  <label
                    className="form-check-label text-15 flex-grow-1"
                    htmlFor="remember"
                  >
                    Se rappeler de moi
                  </label>
                </div>
                <a
                  href="forgot-password.html"
                  className="text-main-600 hover-text-decoration-underline text-15 fw-medium"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-main rounded-pill w-100"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </button>

              <p className="mt-32 text-gray-600 text-center">
                Vous n'avez pas encore de compte ?{" "}
                
                <Link href="/auth/signup" className="text-main-600 hover-text-decoration-underline">
                  Inscrivez-vous !
                </Link>
              </p>

              <div className="divider my-32 position-relative text-center">
                <span className="divider__text text-gray-600 text-13 fw-medium px-26 bg-white">
                  or
                </span>
              </div>

              <ul className="flex-align gap-10 flex-wrap justify-content-center">
                <li>
                  <a
                    href="https://www.facebook.com"
                    className="w-38 h-38 flex-center rounded-6 text-facebook-600 bg-facebook-50 hover-bg-facebook-600 hover-text-white text-lg"
                  >
                    <i className="ph-fill ph-facebook-logo"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.twitter.com"
                    className="w-38 h-38 flex-center rounded-6 text-twitter-600 bg-twitter-50 hover-bg-twitter-600 hover-text-white text-lg"
                  >
                    <i className="ph-fill ph-twitter-logo"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.google.com"
                    className="w-38 h-38 flex-center rounded-6 text-google-600 bg-google-50 hover-bg-google-600 hover-text-white text-lg"
                  >
                    <i className="ph ph-google-logo"></i>
                  </a>
                </li>
              </ul>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;
