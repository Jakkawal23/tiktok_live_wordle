// src/shared/Wordle.ts
// -------------------------------------------------------
// 📌 ENUM เก็บสถานะของตัวอักษรที่ผู้เล่นเดา
// Correct = ถูกต้องทั้งตัวอักษรและตำแหน่ง
// OutOfPlace = มีตัวอักษรนี้ แต่ตำแหน่งผิด
// Wrong = ไม่มีตัวอักษรนี้ในคำตอบ
// NotUsed = ยังไม่ได้ใช้
// ---------------------------
// Enum บอกสถานะของตัวอักษร
// ---------------------------
export enum CharState {
  Correct = 0,     // ตัวอักษรถูกต้องและอยู่ตำแหน่งถูก
  OutOfPlace,      // ตัวอักษรถูกต้อง แต่ตำแหน่งผิด
  Wrong,           // ตัวอักษรผิด
  NotUsed,         // ยังไม่ได้ใช้
}

// Emoji สำหรับแชร์ผลลัพธ์ (ครอบคลุมทุก CharState)
const emojiColors: Record<CharState, string> = {
  [CharState.Correct]: "🟩",
  [CharState.OutOfPlace]: "🟨",
  [CharState.Wrong]: "⬜",
  [CharState.NotUsed]: "⬛", // กรณียังไม่ได้ใช้
}


// ---------------------------
// ฟังก์ชัน: splitWord
// ตัดคำภาษาไทย + จัดการสระ/วรรณยุกต์
// ---------------------------
export function splitWord(word: string) {
  const alphas = word.split("")
  const out: string[] = []

  alphas.forEach((a) => {
    // ถ้าเป็นพยัญชนะ/สระหลัก
    if (a.match(/[ก-ฮa-zA-Z]/) || a.match(/[ใเแโไาำะๆฯฤา]/)) {
      out.push(a)
    } else {
      // ถ้าเป็นสระบน/ล่าง/วรรณยุกต์ ให้ต่อกับตัวก่อนหน้า
      out[out.length - 1] += a
    }
  })

  return out
}

// ---------------------------
// ฟังก์ชัน: ตรวจว่าสระ/วรรณยุกต์หรือไม่
// ---------------------------
function isUpperOrLowerCharacter(char: string): boolean {
  return !char.match(/[ก-ฮa-zA-Z]/) && !char.match(/[ใเแโไาำะๆฯฤา]/)
}

// ---------------------------
// ฟังก์ชัน: normalizeWord
// ลบ character ที่ไม่เกี่ยวข้องออก
// ---------------------------
export function normalizeWord(word: string) {
  return word.replace(/[^ก-ฮใเแโไาำะๆฯฤาa-zA-Z]/g, "")
}

// ---------------------------
// ฟังก์ชัน: validateWord
// ตรวจสอบคำที่เดากับคำตอบ
// ---------------------------
export function validateWord(word: string, solution: string) {
  // ให้ array รองรับ string | null
  const wordSplitted: (string | null)[] = splitWord(word)
  const wordNormalizedSplitted: (string | null)[] = splitWord(normalizeWord(word))
  const solutionSplitted: (string | null)[] = splitWord(solution)
  const solutionNormalizedSplitted: (string | null)[] = splitWord(normalizeWord(solution))

  // Default: ถือว่าผิดทั้งหมด
  const output = wordSplitted.map((char) => ({ correct: CharState.Wrong, char: char ?? "" }))

  // First Pass: ตรวจตัวอักษรถูก + ตำแหน่งถูก
  solutionSplitted.forEach((sChar, idx) => {
    const sNormalized = solutionNormalizedSplitted[idx]
    const char = wordSplitted[idx]
    const cNormalized = wordNormalizedSplitted[idx]

    if ((char && sChar && char === sChar) || (cNormalized && sNormalized && cNormalized === sNormalized)) {
      solutionSplitted[idx] = null
      solutionNormalizedSplitted[idx] = null
      wordSplitted[idx] = null
      wordNormalizedSplitted[idx] = null

      output[idx] = { correct: CharState.Correct, char: sChar ?? "" }
    }
  })

  // Second Pass: ตรวจตัวอักษรถูก แต่ตำแหน่งผิด
  solutionSplitted.forEach((_sChar, idx) => {
    const char = wordSplitted[idx]

    if (char) {
      const cNormalized = wordNormalizedSplitted[idx]

      if (
        solutionSplitted.includes(char) ||
        (cNormalized && solutionNormalizedSplitted.includes(cNormalized))
      ) {
        let correctChar: string | null = null

        const idx1 = solutionSplitted.indexOf(char)
        const idx2 = cNormalized ? solutionNormalizedSplitted.indexOf(cNormalized) : -1

        if (idx1 !== -1) {
          correctChar = solutionSplitted[idx1]
          solutionSplitted[idx1] = null
          solutionNormalizedSplitted[idx1] = null
          wordSplitted[idx] = null
          wordNormalizedSplitted[idx] = null
        } else if (idx2 !== -1) {
          correctChar = solutionSplitted[idx2]
          solutionSplitted[idx2] = null
          solutionNormalizedSplitted[idx2] = null
          wordSplitted[idx] = null
          wordNormalizedSplitted[idx] = null
        }

        output[idx] = { correct: CharState.OutOfPlace, char: correctChar ?? "" }
      }
    }
  })

  return output
}

// ---------------------------
// ฟังก์ชัน: generateAlphabetStateMap
// ทำแผนที่สถานะของตัวอักษรแต่ละตัว
// ---------------------------
export function generateAlphabetStateMap(
  alphabets: string[],
  validations: Array<{ correct: CharState; char: string }> = []
): Record<string, CharState> {
  const map: Record<string, CharState> = {}

  alphabets.forEach((a) => {
    map[a] = CharState.NotUsed
  })

  validations.forEach(({ correct, char }) => {
    char.split("").forEach((c) => {
      if (correct < map[c]) {
        map[c] = correct
      }

      if (isUpperOrLowerCharacter(c) && map[c] === CharState.Wrong) {
        map[c] = CharState.NotUsed
      }
    })
  })

  return map
}

// ---------------------------
// ฟังก์ชัน: getShareResults
// แปลงผลลัพธ์เป็น Emoji string
// ---------------------------
export function getShareResults(attempts: Array<Array<Partial<{ correct: CharState }>>>) {
  return attempts.map((attempt) => {
    return attempt
      .map(({ correct }) => {
        return emojiColors[correct ?? CharState.Wrong]
      })
      .join("")
  })
}
