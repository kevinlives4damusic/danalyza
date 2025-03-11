export function validateConfig() {
  const requiredEnvVars = {
    VITE_POLAR_ACCESS_TOKEN: import.meta.env.VITE_POLAR_ACCESS_TOKEN,
    VITE_POLAR_PRODUCT_ID: import.meta.env.VITE_POLAR_PRODUCT_ID,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}