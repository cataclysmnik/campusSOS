type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  original_filename?: string;
};

type ProgressTask = {
  abort: () => void;
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const ensureCloudinaryConfig = (): void => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local.'
    );
  }
};

const inferContentType = (fileName: string): string | null => {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.bmp')) return 'image/bmp';
  if (lower.endsWith('.heic')) return 'image/heic';
  if (lower.endsWith('.heif')) return 'image/heif';
  return null;
};

const sanitizeFileName = (fileName: string): string =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

const formatUploadError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  return new Error('Image upload failed due to an unknown error.');
};

const uploadToCloudinary = async (
  file: File,
  folder: string,
  publicIdPrefix?: string
): Promise<CloudinaryUploadResponse> => {
  ensureCloudinaryConfig();

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const timestamp = Date.now();
  const baseName = sanitizeFileName(file.name.replace(/\.[^.]+$/, ''));
  const publicId = publicIdPrefix
    ? `${publicIdPrefix}-${timestamp}-${baseName}`
    : `${timestamp}-${baseName}`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET!);
  formData.append('folder', folder);
  formData.append('public_id', publicId);

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  const responseBody = (await response.json()) as
    | CloudinaryUploadResponse
    | { error?: { message?: string } };

  if (!response.ok || !('secure_url' in responseBody)) {
    const cloudinaryMessage =
      'error' in responseBody ? responseBody.error?.message : undefined;
    throw new Error(
      `Cloudinary upload failed (${response.status}): ${cloudinaryMessage || 'Unknown Cloudinary error.'}`
    );
  }

  return responseBody;
};

/**
 * Upload incident image
 */
export const uploadIncidentImage = async (
  file: File,
  incidentId: string,
  userId: string
): Promise<string> => {
  try {
    const resolvedContentType = file.type || inferContentType(file.name);
    if (!resolvedContentType || !resolvedContentType.startsWith('image/')) {
      throw new Error(`Unsupported file type for "${file.name}". Please upload a valid image.`);
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error(`"${file.name}" exceeds the 5MB limit.`);
    }

    const uploadResult = await uploadToCloudinary(file, `incidents/${incidentId}`, userId);
    return uploadResult.secure_url;
  } catch (error) {
    const normalizedError = formatUploadError(error);
    console.error('Upload incident image error:', normalizedError);
    throw normalizedError;
  }
};

/**
 * Upload multiple incident images
 */
export const uploadIncidentImages = async (
  files: File[],
  incidentId: string,
  userId: string
): Promise<string[]> => {
  try {
    if (!files.length) return [];

    const uploadPromises = files.map(file =>
      uploadIncidentImage(file, incidentId, userId)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    const normalizedError = formatUploadError(error);
    console.error('Upload incident images error:', normalizedError);
    throw normalizedError;
  }
};

/**
 * Upload with progress tracking
 */
export const uploadIncidentImageWithProgress = (
  file: File,
  incidentId: string,
  userId: string,
  onProgress?: (progress: number) => void
): ProgressTask => {
  let aborted = false;

  const runUpload = async () => {
    try {
      onProgress?.(0);
      await uploadIncidentImage(file, incidentId, userId);
      if (!aborted) {
        onProgress?.(100);
      }
    } catch (error) {
      if (!aborted) {
        console.error('Upload with progress error:', error);
      }
    }
  };

  void runUpload();

  return {
    abort: () => {
      aborted = true;
    },
  };
};

/**
 * Delete incident image
 */
export const deleteIncidentImage = async (imageUrl: string): Promise<void> => {
  console.warn('deleteIncidentImage is not configured for Cloudinary client-side deletes:', imageUrl);
};

/**
 * Upload user profile picture
 */
export const uploadProfilePicture = async (
  file: File,
  userId: string
): Promise<string> => {
  try {
    const resolvedContentType = file.type || inferContentType(file.name);
    if (!resolvedContentType || !resolvedContentType.startsWith('image/')) {
      throw new Error(`Unsupported file type for "${file.name}". Please upload a valid image.`);
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error(`"${file.name}" exceeds the 5MB limit.`);
    }

    const uploadResult = await uploadToCloudinary(file, `profiles/${userId}`, 'avatar');
    return uploadResult.secure_url;
  } catch (error) {
    const normalizedError = formatUploadError(error);
    console.error('Upload profile picture error:', normalizedError);
    throw normalizedError;
  }
};
