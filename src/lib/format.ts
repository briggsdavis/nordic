// Shared formatting utilities

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const DEFAULT_LOCALE = "en-US"
const DEFAULT_CURRENCY = "ETB"
const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
}

type DateInput = string | number | Date

type PriceFormatOptions = {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

const numberFormatters = new Map<string, Intl.NumberFormat>()
const dateFormatters = new Map<string, Intl.DateTimeFormat>()

const getNumberFormatter = ({
  locale,
  currency,
  minimumFractionDigits,
  maximumFractionDigits,
}: Required<PriceFormatOptions>): Intl.NumberFormat => {
  const key = [
    locale,
    currency,
    minimumFractionDigits ?? "",
    maximumFractionDigits ?? "",
  ].join("|")

  const cached = numberFormatters.get(key)
  if (cached) {
    return cached
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  })
  numberFormatters.set(key, formatter)
  return formatter
}

const getDateFormatter = (
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat => {
  const key = `${locale}|${JSON.stringify(options)}`
  const cached = dateFormatters.get(key)
  if (cached) {
    return cached
  }

  const formatter = new Intl.DateTimeFormat(locale, options)
  dateFormatters.set(key, formatter)
  return formatter
}

export function formatPrice(
  price: number,
  options: PriceFormatOptions = {},
): string {
  if (!Number.isFinite(price)) {
    return "-"
  }

  const formatter = getNumberFormatter({
    locale: options.locale ?? DEFAULT_LOCALE,
    currency: options.currency ?? DEFAULT_CURRENCY,
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
  })

  return formatter.format(price)
}

export function formatDate(
  date: DateInput,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
  locale = DEFAULT_LOCALE,
): string {
  const parsedDate = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(parsedDate.getTime())) {
    return "-"
  }

  return getDateFormatter(locale, options).format(parsedDate)
}

export function formatDateLong(date: DateInput, locale?: string): string {
  return formatDate(
    date,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    locale,
  )
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0B"
  }

  const units = ["B", "KB", "MB", "GB"]
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const value = bytes / Math.pow(1024, index)
  return `${value.toFixed(index === 0 ? 0 : 2)}${units[index]}`
}

export function formatFileSizeError(fileSize: number): string {
  const maxSize = formatFileSize(MAX_FILE_SIZE)
  const actualSize = formatFileSize(fileSize)
  return `File size must be less than ${maxSize}. Your file is ${actualSize}.`
}
