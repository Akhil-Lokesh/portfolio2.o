import { useState, useEffect } from 'react';

interface TimeBasedFeatures {
  isLateNight: boolean;
  isFridayAfternoon: boolean;
  isProgrammerDay: boolean;
  timeMessage: string | null;
}

export const useTimeBasedEasterEggs = (): TimeBasedFeatures => {
  const [features, setFeatures] = useState<TimeBasedFeatures>({
    isLateNight: false,
    isFridayAfternoon: false,
    isProgrammerDay: false,
    timeMessage: null
  });

  useEffect(() => {
    const checkTimeFeatures = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay(); // 0 = Sunday, 5 = Friday
      const month = now.getMonth(); // 0-based
      const date = now.getDate();

      // Late night (11PM - 5AM)
      const isLateNight = hour >= 23 || hour <= 5;
      
      // Friday afternoon (Friday 12PM - 6PM)
      const isFridayAfternoon = day === 5 && hour >= 12 && hour <= 18;
      
      // Programmer's Day (September 13th or 12th in leap years)
      const isProgrammerDay = month === 8 && (date === 13 || (isLeapYear(now.getFullYear()) && date === 12));

      let timeMessage = null;
      if (isLateNight) {
        timeMessage = "Fellow night owl? Respect. 🦉";
      } else if (isProgrammerDay) {
        timeMessage = "Happy Programmer's Day! 👨‍💻✨";
      }

      setFeatures({
        isLateNight,
        isFridayAfternoon,
        isProgrammerDay,
        timeMessage
      });
    };

    const isLeapYear = (year: number) => {
      return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    };

    checkTimeFeatures();
    
    // Check every minute
    const interval = setInterval(checkTimeFeatures, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return features;
};