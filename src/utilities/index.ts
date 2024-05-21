//input ['primary', 'secondary'] output button, button-primary, button-secondary
export const convertClassName = (
  className: string,
  modifier?: string | string[]
) => {
  if (!modifier) return className;

  return `${className} ${className}-${modifier}`;
};

export const toThousand = (number: number) => {
  return number.toString() + ",000";
};


export const toDate = (dateString: string) => {
  const dateObject = new Date(dateString);

  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1; // Months are zero-based, so add 1
  const year = dateObject.getFullYear();
  const formattedDate = `${month}-${day}-${year}`;
  return formattedDate;
};

