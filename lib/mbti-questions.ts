export type MbtiDimension = "EI" | "SN" | "TF" | "JP";

export interface MbtiQuestion {
  id: number;
  dimension: MbtiDimension;
  optionA: { text: string; pole: string };
  optionB: { text: string; pole: string };
}

export interface MbtiAnswer {
  questionId: number;
  dimension: MbtiDimension;
  selectedPole: string;
}

export interface MbtiResult {
  type: string;
  dimensions: {
    EI: { label: string; percentage: number };
    SN: { label: string; percentage: number };
    TF: { label: string; percentage: number };
    JP: { label: string; percentage: number };
  };
}

export const MBTI_QUESTIONS: MbtiQuestion[] = [
  // E/I — Extraversion vs Introversion
  {
    id: 1,
    dimension: "EI",
    optionA: { text: "I feel energised after interacting with a large group of students", pole: "E" },
    optionB: { text: "I feel drained after long periods of group interaction and need quiet time", pole: "I" },
  },
  {
    id: 2,
    dimension: "EI",
    optionA: { text: "I prefer to think out loud and discuss ideas as I form them", pole: "E" },
    optionB: { text: "I prefer to fully form my thoughts before sharing them", pole: "I" },
  },
  {
    id: 3,
    dimension: "EI",
    optionA: { text: "I enjoy lively classroom discussions and debates", pole: "E" },
    optionB: { text: "I prefer students to reflect individually before discussing", pole: "I" },
  },
  {
    id: 4,
    dimension: "EI",
    optionA: { text: "I am comfortable being the centre of attention in a classroom", pole: "E" },
    optionB: { text: "I prefer to guide from the side rather than be the focal point", pole: "I" },
  },
  {
    id: 5,
    dimension: "EI",
    optionA: { text: "I recharge by socialising with colleagues after class", pole: "E" },
    optionB: { text: "I recharge by spending time alone after class", pole: "I" },
  },

  // S/N — Sensing vs Intuition
  {
    id: 6,
    dimension: "SN",
    optionA: { text: "I focus on concrete facts and real-world examples when teaching", pole: "S" },
    optionB: { text: "I focus on abstract concepts and theoretical possibilities", pole: "N" },
  },
  {
    id: 7,
    dimension: "SN",
    optionA: { text: "I follow a structured, step-by-step lesson plan", pole: "S" },
    optionB: { text: "I adapt my lessons spontaneously based on where the discussion goes", pole: "N" },
  },
  {
    id: 8,
    dimension: "SN",
    optionA: { text: "I prefer teaching established methods and proven techniques", pole: "S" },
    optionB: { text: "I prefer exploring new approaches and innovative ideas", pole: "N" },
  },
  {
    id: 9,
    dimension: "SN",
    optionA: { text: "I pay attention to the details and specifics of each topic", pole: "S" },
    optionB: { text: "I focus on the big picture and how topics connect", pole: "N" },
  },
  {
    id: 10,
    dimension: "SN",
    optionA: { text: "I assess students based on their mastery of specific skills", pole: "S" },
    optionB: { text: "I assess students based on their understanding of underlying principles", pole: "N" },
  },

  // T/F — Thinking vs Feeling
  {
    id: 11,
    dimension: "TF",
    optionA: { text: "I prioritise logical consistency and objective criteria when grading", pole: "T" },
    optionB: { text: "I consider individual circumstances and effort when grading", pole: "F" },
  },
  {
    id: 12,
    dimension: "TF",
    optionA: { text: "I give direct, honest feedback even if it might be uncomfortable", pole: "T" },
    optionB: { text: "I frame feedback carefully to maintain the student's confidence", pole: "F" },
  },
  {
    id: 13,
    dimension: "TF",
    optionA: { text: "I make classroom decisions based on what is fair and consistent", pole: "T" },
    optionB: { text: "I make classroom decisions based on what serves each student's needs", pole: "F" },
  },
  {
    id: 14,
    dimension: "TF",
    optionA: { text: "I value critical thinking and debate in class", pole: "T" },
    optionB: { text: "I value harmony and collaboration in class", pole: "F" },
  },
  {
    id: 15,
    dimension: "TF",
    optionA: { text: "When a student is struggling, I focus on identifying the problem", pole: "T" },
    optionB: { text: "When a student is struggling, I focus on how they are feeling", pole: "F" },
  },

  // J/P — Judging vs Perceiving
  {
    id: 16,
    dimension: "JP",
    optionA: { text: "I plan my lessons and curriculum well in advance", pole: "J" },
    optionB: { text: "I keep my plans flexible and adjust as I go", pole: "P" },
  },
  {
    id: 17,
    dimension: "JP",
    optionA: { text: "I set firm deadlines and expect students to meet them", pole: "J" },
    optionB: { text: "I am flexible with deadlines if students need more time", pole: "P" },
  },
  {
    id: 18,
    dimension: "JP",
    optionA: { text: "I prefer a tidy, organised classroom environment", pole: "J" },
    optionB: { text: "I am comfortable with a more relaxed, informal classroom", pole: "P" },
  },
  {
    id: 19,
    dimension: "JP",
    optionA: { text: "I like to finish one topic completely before moving to the next", pole: "J" },
    optionB: { text: "I am comfortable juggling multiple topics at different stages", pole: "P" },
  },
  {
    id: 20,
    dimension: "JP",
    optionA: { text: "I feel satisfied when a class goes exactly as planned", pole: "J" },
    optionB: { text: "I feel satisfied when a class takes an unexpected but productive turn", pole: "P" },
  },
];

export function scoreMbti(answers: MbtiAnswer[]): MbtiResult {
  const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  for (const answer of answers) {
    counts[answer.selectedPole]++;
  }

  function resolveDimension(a: string, b: string): { label: string; percentage: number } {
    const total = counts[a] + counts[b];
    const dominant = counts[a] >= counts[b] ? a : b;
    const percentage = total > 0 ? Math.round((counts[dominant] / total) * 100) : 50;
    return { label: dominant, percentage };
  }

  const EI = resolveDimension("E", "I");
  const SN = resolveDimension("S", "N");
  const TF = resolveDimension("T", "F");
  const JP = resolveDimension("J", "P");

  return {
    type: `${EI.label}${SN.label}${TF.label}${JP.label}`,
    dimensions: { EI, SN, TF, JP },
  };
}
