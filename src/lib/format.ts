// Shared formatting utilities

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options ?? defaultOptions);
}

export function formatDateLong(date: string): string {
  return formatDate(date, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatFileSizeError(fileSize: number): string {
  const maxMB = MAX_FILE_SIZE / 1024 / 1024;
  const actualMB = (fileSize / 1024 / 1024).toFixed(2);
  return `File size must be less than ${maxMB}MB. Your file is ${actualMB}MB.`;
}
