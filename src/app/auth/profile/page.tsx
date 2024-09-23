"use client";

import { signOut, useSession } from "next-auth/react";

const Profile: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}!</h1>
      <p>Email: {session.user?.email}</p>
      <p>Access Token: {session.accessToken}</p>
      <p>Refresh Token: {session.refreshToken}</p>
      <button
        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
      >
        Log out
      </button>
    </div>
  );
};

export default Profile;