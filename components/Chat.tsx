"use client";

// import { VoiceProvider } from "@humeai/voice-react";
// import Messages from "./Messages";
// import Controls from "./Controls";
// import StartCall from "./StartCall";
// import { ComponentRef, useRef } from "react";

// export default function ClientComponent({
//   accessToken,
// }: {
//   accessToken: string;
// }) {
//   const timeout = useRef<number | null>(null);
//   const ref = useRef<ComponentRef<typeof Messages> | null>(null);

//   // optional: use configId from environment variable
//   const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];

//   return (
//     <div
//       className={
//         "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
//       }
//     >
//       <VoiceProvider
//         auth={{ type: "accessToken", value: accessToken }}
//         configId={configId}
//         onMessage={() => {
//           if (timeout.current) {
//             window.clearTimeout(timeout.current);
//           }

//           timeout.current = window.setTimeout(() => {
//             if (ref.current) {
//               const scrollHeight = ref.current.scrollHeight;

//               ref.current.scrollTo({
//                 top: scrollHeight,
//                 behavior: "smooth",
//               });
//             }
//           }, 200);
//         }}
//       >
//         <Messages ref={ref} />
//         <Controls />
//         <StartCall />
//       </VoiceProvider>
//     </div>
//   );
// }

// pages/index.js
// import { useEffect, useState } from "react";
// // import { useVoice } from '"@humeai/voice-react"'; // Adjust based on how you use the Hume SDK
// import AudioVisualizer from "../components/AudioVisualizer";
// import { AudioOutputMessage, useVoice, VoiceProvider } from "@humeai/voice-react";

// export default function Chat({ accessToken }: { accessToken: string }) {

//   const configId = process.env["NEXT_PUBLIC_HUME_CONFIG_ID"];

//   return (
//     <VoiceProvider
//       auth={{ type: "accessToken", value: accessToken }}
//       configId={configId}
//       onAudioReceived={(message: AudioOutputMessage) => {console.log(message)}}
//     >
//       <div>
//         <h1>Audio Visualizer</h1>
//         <AudioVisualizer />
//       </div>
//     </VoiceProvider>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import AudioVisualizer from "./AudioVisualizer";
import {
  AudioOutputMessage,
  useVoice,
  VoiceProvider,
} from "@humeai/voice-react";
import CustomCursor from "@/app/CustomCursor";
import { Mic } from "lucide-react";
import {
  getChatGroupId,
  getUserById,
  onMessageHandler,
} from "@/utils/handleOnMessage";
import { useUser } from "@clerk/nextjs";
import { chat } from "hume/api/resources/empathicVoice";
import { getContext } from "@/utils/chatDetails";
import { useRouter } from "next/navigation";

export default function Chat({ accessToken }: { accessToken: string }) {
  const configId = process.env["NEXT_PUBLIC_HUME_CONFIG_ID"];
  const [audioData, setAudioData] = useState<number[]>([0, 0, 0, 0, 0]); // Initialize with 5 bars
  const animationFrameRef = useRef<number | null>(null);
  const [chatGroupId, setChatGroupId] = useState<string>("");
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [context, setContext] = useState<any>("");
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserById(user?.id ?? "");
      setContext(getContext(userData));
    };
    if(user)
    fetchUser();
  }, [user]);

  useEffect(() => {
    const fetchChatGroupId = async () => {
      const chatGroupId = await getChatGroupId(user?.id ?? "");
      console.log("chatGroupId", chatGroupId);
      setChatGroupId(chatGroupId);
    };
    fetchChatGroupId();
  }, [user]);

  const processAudioData = (audioArray: Uint8Array) => {
    // Divide the audio data into 5 chunks and compute average amplitude
    const chunkSize = Math.floor(audioArray.length / 5);
    const amplitudes = [];
    for (let i = 0; i < 5; i++) {
      const chunk = audioArray.slice(i * chunkSize, (i + 1) * chunkSize);
      const avgAmplitude =
        chunk.reduce((sum, value) => sum + value, 0) / chunk.length;
      amplitudes.push(avgAmplitude);
    }

    // Normalize the amplitudes to a range (0-100)
    const maxAmplitude = Math.max(...amplitudes);
    return amplitudes.map((amp) => (amp / maxAmplitude) * 100);
  };

  const handleAudioReceived = (message: AudioOutputMessage) => {
    const decodedData = atob(message.data); // Decode Base64
    const audioArray = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      audioArray[i] = decodedData.charCodeAt(i);
    }

    // Process and set the audio data
    const processedData = processAudioData(audioArray);
    setAudioData(processedData);
  };

  useEffect(() => {
    // Start animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      // Simulate real-time updates (if audio is silent, hold previous data)
      setAudioData((prevData) => prevData.map((value) => value)); // Smooth decay
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  if (chatGroupId === "" || !isLoaded) {
    return <div>Loading...</div>;
  }

  if(isLoaded && !isSignedIn) {
    router.push("/sign-in");
  }

  return (
    <VoiceProvider
      auth={{ type: "accessToken", value: accessToken }}
      configId={configId}
      resumedChatGroupId={chatGroupId === "no_chat" ? undefined : chatGroupId}
      onMessage={async (message) =>
        await onMessageHandler(message, user?.id ?? "")
      }
      queryParams={{context: context}}
      sessionSettings={{ type: "session_settings", context: context}}
      onAudioReceived={(message: AudioOutputMessage) =>
        handleAudioReceived(message)
      }
    >
      {/* <div className="p-4"> */}

      <AudioVisualizer audioData={audioData} />
      {/* </div> */}
    </VoiceProvider>
  );
}
