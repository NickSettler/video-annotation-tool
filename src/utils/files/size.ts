export type TFileSizeFormat = 'B' | 'GB' | 'KB' | 'MB' | 'TB';

/**
 * Get readable file size
 * @param size file size in bytes
 * @param format file size format
 * @returns readable file size
 */
export const getReadableFileSize = (
  size: number,
  format: TFileSizeFormat,
): string => {
  const fileSizeInKilobytes = size / 1024;
  const fileSizeInMegabytes = fileSizeInKilobytes / 1024;
  const fileSizeInGigabytes = fileSizeInMegabytes / 1024;
  const fileSizeInTerabytes = fileSizeInGigabytes / 1024;

  switch (format) {
    case 'B':
      return `${size} B`;
    case 'KB':
      return `${fileSizeInKilobytes.toFixed(2)} KB`;
    case 'MB':
      return `${fileSizeInMegabytes.toFixed(2)} MB`;
    case 'GB':
      return `${fileSizeInGigabytes.toFixed(2)} GB`;
    case 'TB':
      return `${fileSizeInTerabytes.toFixed(2)} TB`;
  }
};
