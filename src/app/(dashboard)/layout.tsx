import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/core/infra/lib/auth"
import HeadBar from "@/components/HeadBar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Sidebar from "@/components/Sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authConfig);
  console.log("Session", session);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <SessionProviderWrapper>
      <div className="side-overlay"></div>
      <Sidebar />
      <div className="dashboard-main-wrapper">
        <div>
          <HeadBar />
          {children}
        </div>
      </div>
    </SessionProviderWrapper>
  );
};

export default DashboardLayout;
