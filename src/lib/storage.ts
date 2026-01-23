import { supabase } from "@/integrations/supabase/client"
import { getErrorMessage } from "@/lib/utils"

/**
 * Generate a signed URL for accessing files in private buckets
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns The signed URL or null if error
 */
const STORAGE_ERROR_PREFIX = "[storage]"

const logStorageError = (message: string, error: unknown) => {
  console.error(`${STORAGE_ERROR_PREFIX} ${message}:`, getErrorMessage(error))
}

export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn = 3600,
): Promise<string | null> => {
  if (!bucket || !path) {
    logStorageError("Missing bucket or path", { bucket, path })
    return null
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)

  if (error) {
    logStorageError("Error creating signed URL", error)
    return null
  }

  return data.signedUrl
}

/**
 * Extract the file path from a full storage URL or return the path as-is
 * This handles both legacy full URLs and new path-only storage
 */
export const extractFilePath = (urlOrPath: string): string => {
  if (!urlOrPath) {
    return ""
  }

  // If it's already just a path (doesn't start with http), return as-is
  if (!urlOrPath.startsWith("http")) {
    return urlOrPath
  }

  // Extract path from full Supabase storage URL
  // Format: https://xxx.supabase.co/storage/v1/object/public/bucket-name/path/to/file
  const match = urlOrPath.match(
    /\/storage\/v1\/object\/(?:public|sign)\/[^/]+\/(.+)/,
  )
  if (match) {
    return match[1]
  }

  // Fallback: return the original if we can't parse it
  return urlOrPath
}

/**
 * Open a file from storage in a new tab using a signed URL
 * @param bucket - The storage bucket name
 * @param filePathOrUrl - The file path or legacy full URL
 */
export async function openStorageFile(
  bucket: string,
  filePathOrUrl: string,
): Promise<void> {
  const filePath = extractFilePath(filePathOrUrl)
  if (!filePath) {
    logStorageError("Missing file path", filePathOrUrl)
    return
  }

  const signedUrl = await getSignedUrl(bucket, filePath)
  if (signedUrl) {
    window.open(signedUrl, "_blank", "noopener,noreferrer")
  }
}
