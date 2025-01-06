import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabaseClient";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  console.log("req:::::", "webhook called");
  // await supabase
  //   .from("users")
  //   .delete()
  //   .neq("email", "");

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  console.log("User created:", evt.data);
  if (evt.type === "user.created" && "email_addresses" in evt.data) {
    const { id, email_addresses, first_name } = evt.data;
    // Delete any existing user with the same email
    // const { error: deleteError } = await supabase
    //   .from("users")
    //   .delete()
    //   .eq("email", email_addresses[0].email_address);

    // if (deleteError) {
    //   console.error("Error deleting existing user:", deleteError);
    //   return new Response("Failed to delete existing user", {
    //     status: 500,
    //   });
    // }

    // Check if the email already exists
    // const { data: existingUsers, error: fetchError } = await supabase
    //   .from("users")
    //   .select("id")
    //   .eq("email", email_addresses[0].email_address);

    // if (fetchError) {
    //   console.error("Error fetching existing user:", fetchError);
    //   return new Response("Failed to fetch existing user", {
    //     status: 500,
    //   });
    // }

    // if (existingUsers && existingUsers.length > 0) {
    //   console.log("User with this email already exists:", email_addresses[0].email_address);
    //   return new Response("User with this email already exists", {
    //     status: 400,
    //   });
    // }
    const { error } = await supabase.from("onboarding_data").insert([
      {
        user_id: id,
        email: email_addresses[0].email_address,
        name: first_name,
        is_onboarded: false,
      },
    ]);
    const { data: users } = await supabase.from("onboarding_data").select("*");
    console.log("users:::::", users);

    if (error) {
      console.error("Error inserting user:", error);
      return new Response("Failed to insert user", {
        status: 500,
      });
    }

    // Redirect the user to the sign-in page
    return new Response("", {
      status: 200,
      headers: {
        Location: "/sign-in",
      },
    });
  }

  // Return a 200 response to the webhook

  return new Response("", { status: 200 });
}
