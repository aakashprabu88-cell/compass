export interface SkillResources {
  free: string[];
  paid: string[];
}

export const SKILL_RESOURCES: Record<string, SkillResources> = {
  "Python": { free: ["Python.org Tutorial", "freeCodeCamp Python"], paid: ["Udemy: 100 Days of Code"] },
  "Machine Learning": { free: ["Andrew Ng'\''s ML Course", "Kaggle Learn"], paid: ["Coursera ML Specialization"] },
  "Deep Learning": { free: ["fast.ai", "deeplearning.ai"], paid: ["Udacity Nanodegree"] },
  "Data Analysis": { free: ["Kaggle Courses", "Google Data Analytics Certificate"], paid: ["DataCamp"] },
  "SQL": { free: ["SQLBolt", "Mode Analytics Tutorial"], paid: ["Coursera: SQL for Data Science"] },
  "Statistics": { free: ["Khan Academy", "StatQuest YouTube"], paid: ["edX Statistics Course"] },
  "Communication": { free: ["Toastmasters", "Coursera: Communication Skills"], paid: ["MasterClass"] },
  "Leadership": { free: ["Harvard Business Review", "TED Talks on Leadership"], paid: ["LinkedIn Learning"] },
  "Design Thinking": { free: ["IDEO Design Kit", "Stanford d.school"], paid: ["Coursera: Design Thinking"] },
  "Figma": { free: ["Figma Academy", "YouTube Tutorials"], paid: ["Udemy Figma Course"] },
  default: { free: ["Coursera", "edX", "Khan Academy", "YouTube"], paid: ["Udemy", "LinkedIn Learning"] },
};
