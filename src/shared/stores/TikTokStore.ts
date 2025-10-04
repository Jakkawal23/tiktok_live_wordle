import { defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";

interface ChatMessage {
  time: string;
  username: string;
  nickname: string;
  profilePictureUrl: string;
  comment: string;
  isFollower: boolean;
  isSubscriber: boolean;
  isModerator: boolean;
}

export const useTikTokStore = defineStore("tiktok", () => {
  const isConnected: Ref<boolean> = ref(false);
  const statusText: Ref<string> = ref("Disconnected");
  const statusClass: Ref<string> = ref("bg-red-500");
  const username: Ref<string> = ref("");
  const tiktokInfo: Ref<Record<string, any>> = ref({});
  const chatMessages: Ref<ChatMessage[]> = ref([]);
  let ws: WebSocket | null = null;

  function connect(newUsername: string) {
    if (isConnected.value) return;

    username.value = newUsername;

    fetch("http://localhost:3000/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "connected") {
          isConnected.value = true;
          statusText.value = "Connected";
          statusClass.value = "bg-green-500";

          ws = new WebSocket("ws://localhost:3000");

          ws.onmessage = (event) => {
            const message: ChatMessage = JSON.parse(event.data);
            chatMessages.value.push(message);
          };

          ws.onclose = () => {
            isConnected.value = false;
            statusText.value = "Disconnected";
            statusClass.value = "bg-red-500";
          };
        }
      })
      .catch(console.error);
  }

  function disconnect() {
    if (ws) ws.close();
    isConnected.value = false;
    statusText.value = "Disconnected";
    statusClass.value = "bg-red-500";
    chatMessages.value = [];
  }

  return {
    isConnected,
    statusText,
    statusClass,
    username,
    tiktokInfo,
    chatMessages,
    connect,
    disconnect,
  };
});
