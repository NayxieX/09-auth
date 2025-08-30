import css from "./ProfilePage.module.css";
import Link from "next/link";
import { getProfile } from "@/lib/api/serverApi";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Page",
  description: "It is a profile page",
};

const ProfilePage = async () => {
  const user = await getProfile();

  if (!user) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
