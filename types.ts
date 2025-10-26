
export interface MicroLessonStep {
  step: number;
  title: string;
  content: string;
}

export interface CodeSolution {
  language: string;
  code: string;
}

export interface Solution {
  explanation: string;
  solution: CodeSolution;
  microLesson: MicroLessonStep[];
}
