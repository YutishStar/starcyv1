import { JSONMessage } from "@humeai/voice-react";
import { supabase } from "@/lib/supabaseClient";
// import { console } from "inspector";

export async function onMessageHandler(message: JSONMessage, userId: string) {
  if (message.type === "chat_metadata") {
    const { data: userChat, error: err } = await supabase
      .from("user_chats")
      .select("chat_group_id")
      .eq("user_id", userId);
    if (err) {
      console.error("Error fetching user chat data", err);
      throw new Error("Failed to fetch user chat data");
    }
    if (userChat.length == 0) {
      const { error } = await supabase.from("user_chats").upsert({
        user_id: userId,
        // email: message.,
        chat_group_id: message.chatGroupId,
      });
      if (error) {
        console.error("Error inserting user chat data", error);
        throw new Error("Failed to insert user chat data");
      }
    }
    console.log("userChat", userChat);
  }
}

export async function getChatGroupId(userId: string) {
    const { data: userChat, error: err } = await supabase
        .from("user_chats")
        .select("chat_group_id")
        .eq("user_id", userId);
    if (err) {
        console.error("Error fetching user chat data", err);
        throw new Error("Failed to fetch user chat data");
    }
    if (userChat.length == 0) {
        return "no_chat";
    }
    return userChat[0].chat_group_id;

}

export async function getUserById(userId: string) {
    const { data: user, error } = await supabase
        .from("onboarding_data")
        .select("*")
        .eq("user_id", userId)
        .single();
    if (error) {
        console.error("Error fetching user data", error);
        throw new Error("Failed to fetch user data");
    }
    console.log("user", user);
    return user;
}