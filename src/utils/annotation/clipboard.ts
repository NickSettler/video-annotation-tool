import { TAnnotation } from '../../store/annotation';
import { isArray } from 'lodash';
import toast from 'react-hot-toast';
import { checkAnnotation } from './validation';

export const copyAnnotation = async (
  annotation: Array<TAnnotation> | TAnnotation,
) => {
  if (isArray(annotation) && annotation.length > 1) {
    toast.error('Cannot copy multiple annotations');
  }

  annotation = isArray(annotation) ? annotation?.[0] : annotation;

  if (!annotation) return;

  await navigator.clipboard.writeText(JSON.stringify(annotation));
};

export const pasteAnnotation = async () =>
  new Promise<TAnnotation>(async (resolve, reject) => {
    const clipboard = await navigator.clipboard.readText();
    let annotation: any;
    try {
      annotation = JSON.parse(clipboard);
    } catch (e) {
      reject('Clipboard does not contain a valid JSON annotation');
    }

    if (!annotation) {
      reject('Clipboard is empty');
    }

    if (!checkAnnotation(annotation)) {
      reject('Clipboard does not contain a valid annotation');
    }

    resolve(annotation);
  });
