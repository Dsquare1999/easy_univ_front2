'use client'
import { useRouter } from "next/navigation";

const Home = () => {
    const router = useRouter();
    router.push('/auth/signin');
  return (
    <>
        <div>Bienvenue à EasyUniv</div>
    </>
  );
};

export default Home;
