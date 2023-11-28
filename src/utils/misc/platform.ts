export enum E_PLATFORM {
  MAC = 'MAC',
  WINDOWS = 'WINDOWS',
  OTHER = 'OTHER',
}

export const getPlatform = (): E_PLATFORM => {
  const ua = navigator.userAgent;

  if (ua.indexOf('Mac') !== -1) {
    return E_PLATFORM.MAC;
  }

  if (ua.indexOf('Win') !== -1) {
    return E_PLATFORM.WINDOWS;
  }

  return E_PLATFORM.OTHER;
};
