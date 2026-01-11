import { address, networks } from 'flokicoinjs-lib';

export const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return (
    /Android/i.test(userAgent) ||
    /webOS/i.test(userAgent) ||
    /iPhone/i.test(userAgent) ||
    /iPad/i.test(userAgent) ||
    /iPod/i.test(userAgent) ||
    /BlackBerry/i.test(userAgent) ||
    /IEMobile/i.test(userAgent) ||
    /Opera Mini/i.test(userAgent)
  );
};

export const validateAddress = (addr: string) => {
  try {
    address.toOutputScript(addr, networks.bitcoin);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
export const computeOpacity = (active: boolean, progress?: number | null) => {
  if (active) return 1;
  if (progress == null) return 0.5;
  const p = Math.max(0.5, Math.min(1, progress));
  return 0.5 * p + 0.5;
};

export const prepareCoin = (c: any) => {
  const active = !!c.active;
  const progress: number | undefined =
    typeof c.mergeProgress === 'number' ? c.mergeProgress : undefined;
  const p = progress != null ? Math.max(0, Math.min(1, progress)) : 0;
  const showProgress = !active && progress != null;
  const imageOpacity = computeOpacity(active, progress);
  const grayscale = active ? 0 : progress == null || p <= 0 ? 1 : 1 - p;
  const blur = !active && progress == null ? 2 : 0;

  const filterParts: string[] = [];
  if (grayscale > 0) filterParts.push(`grayscale(${grayscale})`);
  if (blur > 0) filterParts.push(`blur(${blur}px)`);
  const filter = filterParts.length ? filterParts.join(' ') : 'none';

  const size = 48;
  const stroke = 4;

  return { active, p, showProgress, imageOpacity, grayscale, filter, size, stroke };
};
