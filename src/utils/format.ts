// Time and date formatting
export const formatTimeOfDay = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon'; 
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const getTimeBasedGreeting = (): string => {
  const timeOfDay = formatTimeOfDay();
  return `Good ${timeOfDay}`;
};

// Text formatting
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatSkillList = (skills: string[]): string => {
  if (skills.length === 0) return '';
  if (skills.length === 1) return skills[0];
  if (skills.length === 2) return `${skills[0]} and ${skills[1]}`;
  
  const lastSkill = skills[skills.length - 1];
  const otherSkills = skills.slice(0, -1).join(', ');
  return `${otherSkills}, and ${lastSkill}`;
};

// URL and email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Random utilities
export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Developer humor
export const getRandomDeveloperJoke = (): string => {
  const jokes = [
    "99 little bugs in the code, 99 little bugs. Take one down, patch it around, 117 little bugs in the code.",
    "There are only 10 types of people in the world: those who understand binary and those who don't.",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "A SQL query goes into a bar, walks up to two tables and asks: 'Can I join you?'",
    "Programming is 10% writing code and 90% figuring out why it doesn't work.",
    "I would tell you a UDP joke, but you might not get it.",
    "Why do Java developers wear glasses? Because they can't C#!"
  ];
  return getRandomElement(jokes);
}; 