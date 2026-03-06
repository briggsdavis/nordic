const DEFAULT_COUNTRY_CODE = "251"
const ETHIOPIA_LOCAL_LENGTH = 9

const normalizeDigits = (value: string): string => value.replace(/\D/g, "")

// Format phone number as user types: "912345678" -> "912 345 678"
export const formatPhoneNumber = (value: string): string => {
  const digits = normalizeDigits(value)

  // Limit to 9 digits (Ethiopian mobile numbers)
  const limited = digits.slice(0, ETHIOPIA_LOCAL_LENGTH)

  // Format as XXX XXX XXX
  if (limited.length <= 3) return limited
  if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`
  return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
}

export const toE164PhoneNumber = (
  value: string,
  countryCode = DEFAULT_COUNTRY_CODE,
): string => {
  const digits = normalizeDigits(value)
  if (!digits) {
    return ""
  }

  if (digits.startsWith(countryCode)) {
    return `+${digits}`
  }

  if (digits.length === ETHIOPIA_LOCAL_LENGTH) {
    return `+${countryCode}${digits}`
  }

  if (digits.startsWith("0") && digits.length === ETHIOPIA_LOCAL_LENGTH + 1) {
    return `+${countryCode}${digits.slice(1)}`
  }

  return `+${digits}`
}

export const isValidPhoneNumber = (value: string): boolean => {
  const digits = normalizeDigits(value)
  return digits.length === ETHIOPIA_LOCAL_LENGTH
}

// Remove formatting for storage
export const unformatPhoneNumber = (value: string): string => {
  return normalizeDigits(value)
}
