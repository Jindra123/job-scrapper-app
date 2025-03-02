import { auth } from "@/auth";
import Image from "next/image";

const UserInfoPage = async () => {
  const session = await auth();
  return (
    <div>
      <h1>User Info</h1>
      <p>User name: {session?.user?.name}</p>
      <p>User name: {session?.user?.email}</p>
      {session?.user?.image && (
        <Image
          src={session?.user?.image}
          alt="user image"
          width={100}
          height={100}
          className="radius-full"
        />
      )}
    </div>
  );
};

export default UserInfoPage;
