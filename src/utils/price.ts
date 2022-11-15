export const fenToYuan = (amount:string | number):string => {
  return (Number(amount) / 100).toFixed(2)
}

export const yuanToFen = (amount:string | number):string => {
  return Math.round(Number(amount) * 100).toString()
}