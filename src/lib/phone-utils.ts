// Format phone number as user types: "912345678" -> "912 345 678"
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "")

  // Limit to 9 digits (Ethiopian mobile numbers)
  const limited = digits.slice(0, 9)

  // Format as XXX XXX XXX
  if (limited.length <= 3) return limited
  if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`
  return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
}

// Remove formatting for storage
export const unformatPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, "")
}
