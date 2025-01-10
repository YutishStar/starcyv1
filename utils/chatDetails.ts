import { HumeClient } from "hume";
import { getHumeAccessToken } from "./getHumeAccessToken";
import { Context } from "hume/api/resources/empathicVoice";

async function getChatGroups(accessToken: string) {
  const client = new HumeClient({ accessToken: accessToken });
  const chatGroups = await client.empathicVoice.chatGroups.listChatGroups({
    pageNumber: 0,
    pageSize: 1,
    ascendingOrder: true,
    configId: "1b60e1a0-cc59-424a-8d2c-189d354db3f3",
  });
  return chatGroups;
}

export function getContext(user: any) {
  if(!user) return undefined;
  const context: Context = {
    type: "persistent",
    text: `
        You should remember that the user is a human being with unique characteristics and preferences. You should reply the user details if asked and don't forget them. Here are some details about the user:
        - Name: ${user.name || "Unknown"}
        - Age: ${user.age || "Unknown"}
        - Date of Birth: ${user.date_of_birth || "Unknown"}
        - Gender: ${user.gender || "Unknown"}
        - Location: ${user.location || "Unknown"}
        - Time Zone: ${user.time_zone || "Unknown"}
        - Hobbies: ${user.hobbies || "Unknown"}
        - Favorite Content: ${user.favorite_content || "Unknown"}
        - Learning Goals: ${user.learning_goals || "Unknown"}
        - Languages: ${user.languages || "Unknown"}
        - Daily Routine: ${user.daily_routine || "Unknown"}
        - Dietary Preferences: ${user.dietary_preferences || "Unknown"}
        - Exercise Habits: ${user.exercise_habits || "Unknown"}
        - Sleep Patterns: ${user.sleep_patterns || "Unknown"}
        - Caffeine Consumption: ${user.caffeine_consumption || "Unknown"}
        - Profession: ${user.profession || "Unknown"}
        - Work Style: ${user.work_style || "Unknown"}
        - Career Goals: ${user.career_goals || "Unknown"}
        - Productivity Preferences: ${
          user.productivity_preferences || "Unknown"
        }
        - Life Goals: ${user.life_goals || "Unknown"}
        - Motivators: ${user.motivators || "Unknown"}
        - Health Goals: ${user.health_goals || "Unknown"}
        - Allergies: ${user.allergies || "Unknown"}
        - Wellness Practices: ${user.wellness_practices || "Unknown"}
        - Relationship Status: ${user.relationship_status || "Unknown"}
        - Family Details: ${user.family_details || "Unknown"}
        - Social Engagement: ${user.social_engagement || "Unknown"}
        - Onboarded: ${user.is_onboarded ? "Yes" : "No"}
        
      `,
  };

  console.log("context", context);
  return context;
}
