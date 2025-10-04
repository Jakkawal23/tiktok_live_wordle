<template>
  <div class="min-h-full bg-gray-100 flex flex-col">
    <!-- ส่วนหัว -->
    <header class="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <span :class="statusClass" class="w-3 h-3 rounded-full"></span>
        <span>{{ statusText }}</span>
      </div>
      <div class="flex space-x-2">
        <input
          v-model="username"
          type="text"
          placeholder="Enter TikTok username"
          class="px-4 py-2 rounded border border-gray-300"
        />
        <button
          @click="connectToTikTok"
          :disabled="isConnecting"
          class="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Connect
        </button>
      </div>
    </header>

    <!-- ข้อมูล TikTok -->
    <section v-if="isConnected" class="p-4 bg-white shadow-md">
      <h2 class="text-xl font-semibold">TikTok Account Info</h2>
      <p><strong>Username:</strong> {{ tiktokInfo.username }}</p>
      <p><strong>Followers:</strong> {{ tiktokInfo.followers }}</p>
      <p><strong>Live Viewers:</strong> {{ tiktokInfo.liveViewers }}</p>
    </section>

    <!-- แชทจำลอง -->
    <section v-if="isConnected" class="flex-1 p-4 bg-gray-50 overflow-auto">
      <h2 class="text-xl font-semibold mb-2">Live Chat</h2>
      <div
        ref="chatContainer"
        class="h-130 overflow-y-auto border border-gray-300 rounded p-2 bg-white space-y-2"
      >
        <div
          v-for="(message, index) in chatMessages"
          :key="index"
          class="flex space-x-2 items-start border-b pb-2"
        >
          <img
            :src="message.profilePictureUrl"
            alt="avatar"
            class="w-10 h-10 rounded-full"
          />
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-bold">{{ message.nickname }}</span>
              <span class="text-xs text-gray-500">({{ message.username }})</span>
              <span v-if="message.isFollower" class="text-green-500 text-xs font-semibold"
                >Follower</span
              >
              <span
                v-if="message.isSubscriber"
                class="text-blue-500 text-xs font-semibold"
                >Subscriber</span
              >
              <span
                v-if="message.isModerator"
                class="text-purple-500 text-xs font-semibold"
                >Moderator</span
              >
            </div>
            <div class="text-sm text-gray-700">{{ message.comment }}</div>
            <div class="text-xs text-gray-400">{{ message.time }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { ref, nextTick } from "vue";

export default {
  setup() {
    const username = ref<string>("");
    const isConnecting = ref<boolean>(false);
    const isConnected = ref<boolean>(false);
    const statusText = ref<string>("Disconnected");
    const statusClass = ref<string>("bg-red-500");
    const tiktokInfo = ref<Record<string, any>>({});
    const chatMessages = ref<Array<Record<string, any>>>([]);
    const chatContainer = ref<HTMLElement | null>(null);
    let ws: WebSocket | null = null;

    async function connectToTikTok() {
      isConnecting.value = true;
      const res = await fetch("http://localhost:3000/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.value }),
      });

      const data = await res.json();
      console.log(data);

      if (data.status === "connected") {
        isConnected.value = true;
        statusText.value = "Connected";
        statusClass.value = "bg-green-500";

        ws = new WebSocket("ws://localhost:3000");

        ws.onmessage = (event) => {
          const chatData = JSON.parse(event.data);
          chatMessages.value.push(chatData);

          nextTick(() => {
            if (chatContainer.value) {
              chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
            }
          });
        };
      }
      isConnecting.value = false;
    }

    return {
      username,
      isConnecting,
      isConnected,
      statusText,
      statusClass,
      tiktokInfo,
      chatMessages,
      chatContainer,
      connectToTikTok,
    };
  },
};
</script>

<style scoped>
/* ปรับ style เพิ่มเติม */
</style>
