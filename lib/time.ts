const padTo2Digits = (number: number): string => {
  return number.toString().padStart(2, '0')
}

export const ConvertMsToMinutesSeconds = (ms: number): string => {
  const minutes = Math.floor(ms / 60_000)
  const seconds = Number(Math.floor((ms % 60_000) / 1_000).toFixed(0))
  return seconds === 60
    ? `${minutes + 1}:00`
    : `${minutes}:${padTo2Digits(seconds)}`
}
