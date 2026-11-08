export function isEventActive(event, now = Date.now()) {
  const endDate = event?.date_fin || event?.date_debut
  if (!endDate) return false

  const date = endDate.substring(0, 10)
  const time = event.heure_fin_journee?.substring(0, 8) || '23:59:59'
  const end = new Date(`${date}T${time.length === 5 ? `${time}:00` : time}`).getTime()

  return Number.isFinite(end) && now < end
}
