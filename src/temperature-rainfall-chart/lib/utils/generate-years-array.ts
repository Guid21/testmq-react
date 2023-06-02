export const generateYearsArray = (yearsCount: number) => {
    // Данные до 2006 года, поэтому не брал текущую дату
    const currentYear = new Date(2006, 0, 1).getFullYear();
    const yearsArray = [];
  
    for (let year = currentYear - yearsCount; year <= currentYear; year++) {
      yearsArray.push(year);
    }
  
    return yearsArray;
  }
  