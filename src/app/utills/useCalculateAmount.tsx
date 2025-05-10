
export const useCalculateAmount = () => {
    const calculateAmount = (
      start?: string,
      end?: string,
      childClass?: string
    ): number => {
      if (!start || !end) return 0;
  
      const [startH, startM] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);
  
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
  
      const diffMinutes = Math.max(endMinutes - startMinutes, 0);
      if (diffMinutes === 0) return 0;
  
      const units = Math.floor(diffMinutes / 30);
      const remainder = diffMinutes % 30;
      const totalUnits = units + (remainder > 0 ? 1 : 0);
  
      const isSpecialClass =
        childClass === "小学生" || childClass === "未就園児";
  
      const rate = isSpecialClass ? 400 : 200;
  
      return totalUnits * rate;
    };
  
    return { calculateAmount };
  };
  