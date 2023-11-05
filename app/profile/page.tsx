import DashboardStats from "@/app/profile/DashboardStats";
import { tokenHeader } from "@/lib/utils/api";

const Profile = async () => {
  const requestHeaders = tokenHeader();

  const stats = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/user/dashboardStats`,
    {
      headers: requestHeaders,
    }
  ).then((res) => res.json());

  // console.log("Stats", stats);

  return (
    <div className="py-5">
      <DashboardStats stats={stats} />
    </div>
  );
};

export default Profile;
