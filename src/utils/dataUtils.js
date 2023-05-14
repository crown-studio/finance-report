export const countValueOf = (dataArr, decimals) =>
  Number(dataArr.reduce((total, { valor }) => total + Number(valor), 0).toFixed(decimals || 2));

export const countValueOfByGroup = (dataArr, decimals) => dataArr.map((entries) => countValueOf(entries, decimals));
