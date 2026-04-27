const required = (key: string): string => {
  const val = import.meta.env[key];
  if (!val) throw new Error(`Missing environment variable: ${key}`);
  return val;
};

const optional = (key: string, fallback: string): string => import.meta.env[key] ?? fallback;

export const env = {
  VITE_API_URL: optional('VITE_API_URL', 'http://localhost:5001/api/v1'),
  VITE_BACKEND_URL: optional('VITE_BACKEND_URL', 'http://localhost:5001'),
} as const;
