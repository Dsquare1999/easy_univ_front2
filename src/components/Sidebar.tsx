"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();

  return (
    <>
      <aside className="sidebar">
        <button
          type="button"
          className="sidebar-close-btn text-gray-500 hover-text-white hover-bg-main-600 text-md w-24 h-24 border border-gray-100 hover-border-main-600 d-xl-none d-flex flex-center rounded-circle position-absolute"
        >
          <i className="ph ph-x"></i>
        </button>

        <a
          href="/"
          className="sidebar__logo text-center p-20 position-sticky inset-block-start-0 bg-white w-100 z-1 pb-10"
        >
          <Image
            src="assets/images/logo/logo_easy_univ_bleu.svg"
            alt="Image"
            width={200}
            height={50}
          />
        </a>

        <div className="sidebar-menu-wrapper overflow-y-auto scroll-sm">
          <div className="p-20 pt-10">
            <ul className="sidebar-menu">
              <li className="sidebar-menu__item">
                <Link href="/dashboard" className="sidebar-menu__link">
                  <span className="icon">
                    <i className="ph ph-gauge"></i>
                  </span>
                  <span className="text">Dashboard</span>
                </Link>
              </li>
              <li className="sidebar-menu__item">
                <Link href="/cycles" className="sidebar-menu__link">
                  <span className="icon">
                    <i className="ph ph-repeat"></i>
                  </span>
                  <span className="text">Cycles</span>
                </Link>
              </li>
              <li className="sidebar-menu__item">
                <Link href="/filieres" className="sidebar-menu__link">
                  <span className="icon">
                    <i className="ph ph-tree-structure"></i>
                  </span>
                  <span className="text">Filières</span>
                </Link>
              </li>
              <li className="sidebar-menu__item">
                <Link href="/unites" className="sidebar-menu__link">
                  <span className="icon">
                    <i className="ph ph-books"></i>
                  </span>
                  <span className="text">Unités (UE)</span>
                </Link>
              </li>
              <li className="sidebar-menu__item">
                <Link href="/classes" className="sidebar-menu__link">
                  <span className="icon">
                    <i className="ph ph-chalkboard"></i>
                  </span>
                  <span className="text">Classes</span>
                </Link>
              </li>
              <li className="sidebar-menu__item">
                <Link href="/tags" className="sidebar-menu__link">
                  <span className="icon">
                    <i className="ph ph-tag"></i>
                  </span>
                  <span className="text">Tags</span>
                </Link>
              </li>

              <li className="sidebar-menu__item">
                <span className="text-gray-300 text-sm px-20 pt-20 fw-semibold border-top border-gray-100 d-block text-uppercase">
                  Utilisateurs
                </span>
              </li>
              <li className="sidebar-menu__item">
                <Link href="/users" className="sidebar-menu__link">
                  <span className="icon">
                    <i className="ph ph-users"></i>
                  </span>
                  <span className="text">Utilisateurs</span>
                </Link>
              </li>
              <li className="sidebar-menu__item">
                <Link href="/students" className="sidebar-menu__link">
                  <span className="icon">
                    <i className="ph ph-student"></i>
                  </span>
                  <span className="text">Étudiants</span>
                </Link>
              </li>
              <li className="sidebar-menu__item">
                <Link href="/teachers" className="sidebar-menu__link">
                  <span className="icon">
                    <i className="ph ph-chalkboard-teacher"></i>
                  </span>
                  <span className="text">Enseignants</span>
                </Link>
              </li>

              <li className="sidebar-menu__item">
                <span className="text-gray-300 text-sm px-20 pt-20 fw-semibold border-top border-gray-100 d-block text-uppercase">
                  Réglages
                </span>
              </li>
              <li className="sidebar-menu__item">
                <Link href="/settings" className="sidebar-menu__link">
                  <span className="icon">
                    <i className="ph ph-gear"></i>
                  </span>
                  <span className="text">Paramètres</span>
                </Link>
              </li>
              <li className="sidebar-menu__item">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#confirmSignout"
                  className="sidebar-menu__link"
                >
                  <span className="icon">
                    <i className="ph ph-sign-out"></i>
                  </span>
                  <span className="text">Déconnexion</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <div
        className="modal fade"
        id="confirmSignout"
        tabIndex={-1}
        aria-labelledby="confirmSignoutLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="confirmSignoutLabel">
                Voulez-vous vraiment vous déconnecter ?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-24 text-gray-800">
              <div className="d-flex align-items-center justify-content-center gap-8 mt-24">
                <button
                  type="reset"
                  className="btn bg-danger-600 hover-bg-danger-800 border-danger-600 hover-border-danger-800 text-md px-24 py-12 radius-8"
                  data-bs-dismiss="modal"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn bg-main-600 hover-bg-main-800 border-main-600 hover-border-main-800 text-md px-24 py-12 radius-8"
                  onClick={() => signOut()}
                >
                  Oui, je me déconnecte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
