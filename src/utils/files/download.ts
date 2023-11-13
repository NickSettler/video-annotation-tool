/**
 * Download a file as a JSON file
 * @param object - The object to download
 * @param name - The name of the file
 */
export function downloadAsJson<T extends Record<string, any>>(
  object: T,
  name: string,
): void;
export function downloadAsJson<T extends Record<string, any>>(
  object: Array<T>,
  name: string,
): void;
export function downloadAsJson<T extends Record<string, any>>(
  object: Array<T> | T,
  name: string,
) {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(object, null, 2));

  const downloadAnchorNode = document.createElement('a');

  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', name + '.json');

  downloadAnchorNode.click();

  downloadAnchorNode.remove();
}
