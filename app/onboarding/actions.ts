"use server";

import { auth, clerkClient, getAuth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabaseClient";

export async function submitOnboardingData(formData: any) {
//   console.log("userId", getAuth(req));
//   const { userId } = getAuth(req);
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const { data: user, error: userError } = await supabase
    .from("onboarding_data")
    .select("email")
    .eq("user_id", userId)
    .single();

    console.log("user", user);

  if (userError) {
    console.error("Error fetching user data", userError);
    throw new Error("Failed to fetch user data");
  }

  if (!userId) {
    return { message: "No Logged In User" };
  }

  const client = await clerkClient();
  

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        is_onboarded: true,
        // applicationName: formData.get('applicationName'),
        // applicationType: formData.get('applicationType'),
      },
    });
    const { error } = await supabase.from("onboarding_data").upsert({
      user_id: userId,
      email: (await client.users.getUser(userId)).emailAddresses[0].emailAddress,
      ...formData,
      is_onboarded: true,
    });

    if (error) {
      throw error;
    }
    return {success:true,  message: res.publicMetadata };
  } catch (err) {
    console.error("Error updating user metadata", err);
    return { error: "There was an error updating the user metadata." };
  }

//   return { success: true };
}
