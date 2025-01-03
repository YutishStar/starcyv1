import AudioVisualizer from "@/components/AudioVisualizer";
import { getHumeAccessToken } from "@/utils/getHumeAccessToken";
import dynamic from "next/dynamic";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
}) as React.ComponentType<{ accessToken: string }>;

export default async function Page() {
  const { userId } = auth();
  const accessToken = await getHumeAccessToken();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!accessToken) {
    throw new Error("Failed to get Hume access token");
  }

  return (
    <div className="min-h-screen">
      <nav className="p-4 flex justify-end">
        <UserButton afterSignOutUrl="/sign-in"/>
      </nav>
      <div className="grow flex flex-col">
        <Chat accessToken={accessToken} />
        {/* <AudioVisualizer accessToken={accessToken}/> */}
      </div>
    </div>
  );
}
