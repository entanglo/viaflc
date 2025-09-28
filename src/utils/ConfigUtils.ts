export const throwErrorIfEnvVarsNotFound = () => {
  if (!process.env.NEXT_PUBLIC_POOL_URL) {
    throw new Error('NEXT_PUBLIC_POOL_URL not set in environment variables');
  }

  if (!process.env.NEXT_PUBLIC_POOL_FEE) {
    throw new Error('NEXT_PUBLIC_POOL_FEE not set in environment variables');
  }

  if (!process.env.NEXT_PUBLIC_SHARES_URL) {
    throw new Error('NEXT_PUBLIC_SHARES_URL not set in environment variables');
  }
};
