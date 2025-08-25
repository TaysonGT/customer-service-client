export const getFileType = (fileName: string): 'image' | 'document' | 'video' | 'audio' => {
  const extension = fileName.toLowerCase().split('.').pop() || '';
  
  // Images
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'tif', 'heic'];
  if (imageExtensions.includes(extension)) return 'image';
  
  // Videos
  const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv', 'm4v', 'mpg', 'mpeg', '3gp'];
  if (videoExtensions.includes(extension)) return 'video';
  
  // Audio
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma', 'aiff', 'amr'];
  if (audioExtensions.includes(extension)) return 'audio';
  
  // Documents (everything else)
  return 'document';
};