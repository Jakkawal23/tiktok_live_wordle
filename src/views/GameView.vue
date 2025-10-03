<!-- ส่วนหัว + Navbar -->
<!-- <div class="footer-wrapper"> -->
<!-- Kofi Button (ไฟล์ภายนอก: ./lib/Kofi.vue) -->
<!-- <Kofi name="narze" label="Support Me" /> -->
<!-- เมนูลิงก์ (ไฟล์ภายนอก: ./lib/Menu.vue) -->
<!-- <Menu :items="menuItems" /> -->
<!-- Social Share (ไฟล์ภายนอก: ./lib/Social.vue) -->
<!-- <Social :url="url" :title="title" /> -->
<!-- </div> -->

<!-- Head (Meta / SEO) 
  <Head
    :title="title"
    :description="description"
    :url="url"
    :imageUrl="imageUrl"
    :gtagId="gtagId"
  />-->

<template>
  <main class="container h-screen flex flex-col items-center dark:bg-slate-800">
    <span class="flex gap-4 dark:text-white my-2">
      <span>วันที่ {{ dateIndex + 1 }}</span>
      <span>ครั้งที่ {{ attemptsLength }}/{{ attemptLimit }}</span>
    </span>

    <!-- ช่องแสดงผลคำตอบ -->
    <div class="attempts grow overflow-y-auto" ref="attemptsContainer">
      <!-- ความพยายามที่เคยลอง -->
      <div v-for="(inputWord, n) in attempts" :key="n" class="flex justify-center my-1">
        <div
          v-for="({ correct, char }, idx) in validations[n] || []"
          :key="idx"
          :class="[
            colors[correct] || 'bg-black',
            'attempt-key border-solid border-2 flex items-center justify-center mx-0.5 text-3xl font-bold text-white rounded',
          ]"
        >
          {{ char ?? "" }}
        </div>
      </div>

      <!-- ช่อง input ที่กำลังพิมพ์ -->
      <div v-if="!gameEnded" class="flex justify-center my-1">
        <div
          v-for="(_, i) in solutionLength"
          :key="i"
          class="attempt-key bg-white border-solid border-2 flex items-center justify-center mx-0.5 text-3xl font-bold rounded w-12 h-12 dark:bg-slate-800 dark:text-white"
        >
          {{ splittedInput[i] || "" }}
        </div>
      </div>

      <!-- ช่องที่เหลือ (ยังไม่ได้เดา) -->
      <div
        v-for="(_, n) in Array(Math.max(0, attemptLimit - attempts.length - 1))"
        :key="n"
        class="flex justify-center my-1"
      >
        <div
          v-for="_ in Array(solutionLength).fill(0)"
          :key="_"
          class="attempt-key bg-white border-solid border-2 flex items-center justify-center mx-0.5 text-3xl font-bold rounded w-12 h-12 dark:bg-slate-800 dark:text-white"
        />
      </div>
    </div>

    <!-- คีย์บอร์ด -->
    <div class="layout my-4 w-full px-1 max-w-2xl">
      <input
        ref="textInput"
        type="text"
        class="w-full sm:w-[400px] block border mb-3.5 px-6 py-2 mx-auto text-center dark:bg-gray-600 dark:text-white dark:placeholder:text-white"
        @keydown="handleKeyPress"
        @blur="focusOnTextInput = false"
        @focus="focusOnTextInput = true"
        v-model="input"
        :disabled="gameEnded"
        placeholder="คลิกที่นี่เพื่อใช้คีย์บอร์ด"
      />

      <div
        v-for="(row, rowIndex) in currentRows"
        :key="rowIndex"
        class="w-full flex flex-row justify-center touch-manipulation"
      >
        <div
          v-for="(alphabet, alphabetIndex) in row"
          :key="alphabetIndex"
          class="flex-grow flex m-0.5 relative"
        >
          <button
            @click="inputKey(alphabet)"
            :class="[
              colors[alphabetStateMap[alphabet]],
              ['⇧', '↵', '⬅'].includes(alphabet) ? 'border-gray-500' : '',
              'Kedmanee' === 'ก-ฮ' ? 'layout-no-shift' : '',
              'flex-grow layout-key border-solid border-2 flex items-end justify-end text-xl font-bold rounded text-black',
            ]"
          >
            {{ alphabet }}
            <div
              v-if="
                currentRows[rowIndex][alphabetIndex] !==
                inverseRows[rowIndex][alphabetIndex]
              "
              :class="[
                colors[alphabetStateMap[inverseRows[rowIndex][alphabetIndex]]],
                'absolute top-1 left-1 border-solid border-1 rounded text-sm leading-4 p-0.5 w-4',
              ]"
            >
              {{ inverseRows[rowIndex][alphabetIndex] }}
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- ปุ่ม Share -->
    <div class="share-button text-center flex">
      <button
        v-if="gameEnded"
        @click="copyResult"
        class="flex items-center justify-center rounded border mx-2 p-2.5 bg-green-300 border-green-300 text-xs font-bold cursor-pointer bg-green-200 hover:bg-green-300 active:bg-green-400"
      >
        {{ copied ? "Copied" : "Share" }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import {
  CharState,
  generateAlphabetStateMap,
  getShareResults,
  splitWord,
  validateWord,
} from "../shared/Wordle";
import { data, modalViewed, settings } from "../shared/Store";
import { layouts } from "../shared/Layouts";

// -------------------------
// 🔹 ตัวแปรหลัก
// -------------------------
const url = "https://thwordle.vercel.app";
const title = "Thwordle : Thai Wordle เวอเดิ้ลภาษาไทย";
const description = "Thwordle : เวอเดิ้ลภาษาไทย";
const imageUrl =
  "https://raw.githubusercontent.com/narze/timelapse/master/projects/thwordle_home.png";
const gtagId = "G-F2Q37REQE6";

const epochMs = 1642525200000;
const now = Date.now();
const msInDay = 86400000;
const dateIndex = Math.floor((now - epochMs) / msInDay);
const attemptLimit = 6;

// -------------------------
// 🔹 State
// -------------------------
const words = ref<string[]>([]);
const input = ref("");
const attempts = ref<string[]>(data.value[dateIndex]?.attempts || []);
const validations = ref<any[]>([]);
const gameEnded = ref(!!data.value[dateIndex]?.win || !!data.value[dateIndex]?.lose);
const copied = ref(false);
const lose = ref(false);
const win = ref(false);
const shifted = ref(false);
const alertMessage = ref("");
const showAlert = ref(false);
const focusOnTextInput = ref(false);
const dict = ref<string[]>([]);
const attemptsContainer = ref<HTMLDivElement | null>(null);
const textInput = ref<HTMLInputElement | null>(null);

// -------------------------
// 🔹 Colors
// -------------------------
const colors: Record<CharState, string> = {
  [CharState.Correct]: "bg-green-500",
  [CharState.OutOfPlace]: "bg-yellow-500",
  [CharState.Wrong]: "bg-gray-500",
  [CharState.NotUsed]: "bg-white",
};

// -------------------------
// 🔹 Computed
// -------------------------
const attemptsLength = computed(() => attempts.value.length);
const solution = computed(() => {
  if (words.value.length === 0) return "";
  return words.value[dateIndex % words.value.length] || "";
});

const solutionLength = computed(() => splitWord(solution.value).length);

const currentLayout = computed(() => {
  return layouts[settings.value?.layout || "Kedmanee"] || layouts["Kedmanee"];
});
const currentRows = computed(() =>
  shifted.value ? currentLayout.value.rowsShifted : currentLayout.value.rows
);
const inverseRows = computed(() =>
  shifted.value ? currentLayout.value.rows : currentLayout.value.rowsShifted
);

const alphabetStateMap = computed(() =>
  generateAlphabetStateMap(
    [...currentLayout.value.rows, ...currentLayout.value.rowsShifted].flat(),
    validations.value.flat()
  )
);
const splittedInput = computed(() => splitWord(input.value));

// -------------------------
// 🔹 Functions
// -------------------------
function inputKey(alphabet: string) {
  if (gameEnded.value) return;

  if (alphabet === "⇧") {
    shifted.value = !shifted.value;
  } else if (alphabet === "⬅") {
    input.value = input.value.slice(0, -1);
  } else if (alphabet === "↵" || alphabet === "Enter") {
    submit();
  } else {
    // ป้องกันการซ้ำและเกินความยาว
    if (splittedInput.value.length < solutionLength.value) {
      input.value += alphabet;
      shifted.value = false;
    }
  }
  focusInput();
}

function handleKeyPress(e: KeyboardEvent) {
  if (gameEnded.value) return;
  if (e.key === "Enter") {
    e.preventDefault(); // ป้องกันการพิมพ์ซ้ำ
    submit();
  } else if (e.key === "Backspace") {
    e.preventDefault();
    inputKey("⬅");
  } else if (e.key.length === 1) {
    e.preventDefault();
    if (splittedInput.value.length < solutionLength.value) {
      inputKey(e.key);
    }
  }
}

function submit() {
  if (splittedInput.value.length !== solutionLength.value) {
    showAlertMessage("กรุณากรอกคำให้ครบ");
    return;
  }

  attempts.value.push(input.value);
  validations.value.push(validateWord(input.value, solution.value));
  input.value = "";

  if (attemptsContainer.value) {
    attemptsContainer.value.scrollTop = attemptsContainer.value.scrollHeight;
  }

  // เช็คว่าเกมจบหรือไม่
  if (input.value === solution.value) {
    gameEnded.value = true;
    win.value = true;
  } else if (attempts.value.length >= attemptLimit) {
    gameEnded.value = true;
    lose.value = true;
  }

  // แสดงคำตอบใน console เมื่อเกมจบ
  // if (gameEnded.value) {
  console.log("คำตอบคือ:", solution.value);
  // }
}

function wordExists(word: string) {
  return words.value.includes(word) || dict.value.includes(word);
}

function showAlertMessage(msg: string) {
  alertMessage.value = msg;
  showAlert.value = true;
}

function copyResult() {
  const results = getShareResults(validations.value);
  const score = (lose.value ? "X" : `${results.length}`) + `/${attemptLimit}`;
  navigator.clipboard.writeText(
    `#Thwordle ${dateIndex + 1} ${score}\n\n${results.join("\n")}`
  );
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

function focusInput() {
  textInput.value?.focus();
}

// -------------------------
// 🔹 Load Data
// -------------------------
onMounted(async () => {
  try {
    const res = await fetch("/words.json");
    if (!res.ok) throw new Error("Cannot load words.json");
    const json = await res.json();
    words.value = json.words || [];
    dict.value = (await import("../assets/dict.json")).default;

    // สร้าง validations จาก attempt เดิม
    validations.value = attempts.value.map((attempt) =>
      validateWord(attempt, solution.value)
    );
  } catch (err) {
    console.error("Error loading words.json:", err);
  }
});
</script>

<style>
.attempt-key {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.attempts {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.5rem; /* ลดช่องว่าง */
}

.layout {
  margin-top: 0.5rem; /* ลดช่องว่างระหว่างตารางและคีย์บอร์ด */
}
</style>
