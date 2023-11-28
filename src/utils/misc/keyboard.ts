import { E_PLATFORM, getPlatform } from './platform';

export const getCopyKey = (): keyof Pick<
  KeyboardEvent,
  'ctrlKey' | 'metaKey'
> => {
  const platform = getPlatform();

  if (platform === E_PLATFORM.MAC) {
    return 'metaKey';
  }

  return 'ctrlKey';
};
