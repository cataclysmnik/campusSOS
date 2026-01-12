import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadMetadata,
  UploadTask,
} from 'firebase/storage';
import { storage } from './config';

/**
 * Upload incident image
 */
export const uploadIncidentImage = async (
  file: File,
  incidentId: string,
  userId: string
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `incidents/${incidentId}/${fileName}`);

    const metadata: UploadMetadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: userId,
        incidentId,
      },
    };

    await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Upload incident image error:', error);
    throw error;
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
    const uploadPromises = files.map(file =>
      uploadIncidentImage(file, incidentId, userId)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Upload incident images error:', error);
    throw error;
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
): UploadTask => {
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name}`;
  const storageRef = ref(storage, `incidents/${incidentId}/${fileName}`);

  const metadata: UploadMetadata = {
    contentType: file.type,
    customMetadata: {
      uploadedBy: userId,
      incidentId,
    },
  };

  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  if (onProgress) {
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress);
    });
  }

  return uploadTask;
};

/**
 * Delete incident image
 */
export const deleteIncidentImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Delete incident image error:', error);
    throw error;
  }
};

/**
 * Upload user profile picture
 */
export const uploadProfilePicture = async (
  file: File,
  userId: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, `profiles/${userId}/avatar.${file.name.split('.').pop()}`);

    const metadata: UploadMetadata = {
      contentType: file.type,
      customMetadata: {
        userId,
      },
    };

    await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Upload profile picture error:', error);
    throw error;
  }
};
