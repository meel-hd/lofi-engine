export const singleOct = [0,2,4,5,7,9,11];
export const doubleOct = [...singleOct, ...singleOct.map(n=>n+12)];
export const tripleOct = [...doubleOct, ...singleOct.map(n=>n+24)];
export const fiveToFive = [...singleOct.map(n=>n-12).slice(4), ...singleOct, ...singleOct.map(n=>n+12).slice(0,5)];
