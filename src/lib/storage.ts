import { supabase } from "@/integrations/supabase/client";

/**
 * Generate a signed URL for accessing files in private buckets
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns The signed URL or null if error
 */
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string | null> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error("Error creating signed URL:", error);
    return null;
  }

  return data.signedUrl;
};

/**
 * Extract the file path from a full storage URL or return the path as-is
 * This handles both legacy full URLs and new path-only storage
 */
export const extractFilePath = (urlOrPath: string): string => {
  // If it's already just a path (doesn't start with http), return as-is
  if (!urlOrPath.startsWith("http")) {
    return urlOrPath;
  }

  // Extract path from full Supabase storage URL
  // Format: https://xxx.supabase.co/storage/v1/object/public/bucket-name/path/to/file
  const match = urlOrPath.match(/\/storage\/v1\/object\/(?:public|sign)\/[^/]+\/(.+)/);
  if (match) {
    return match[1];
  }

  // Fallback: return the original if we can't parse it
  return urlOrPath;
};
