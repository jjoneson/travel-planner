export function today() {
  let d = new Date()
  let n = d.getTimezoneOffset() * 60 * 1000
  d = new Date(d.getTime() - n)
  return d.toJSON().slice(0, 16)
}

export function addHours(date, hours) {
  let d = new Date(date)
  let n = d.getTimezoneOffset() * 60 * 1000
  d = new Date(d.getTime() + (hours * 60 * 60 * 1000) - n)
  return d.toJSON().slice(0, 16)
}

export function getHoursDifference(date1, date2) {
  let d1 = new Date(date1)
  let d2 = new Date(date2)
  return (d2.getTime() - d1.getTime()) / 60 / 60 / 1000
}

export function getDate(date) {
  return date.substring(0, 10)
}