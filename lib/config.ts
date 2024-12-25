export const config = {
  humeApiKey: process.env.HUME_API_KEY!,
  humeSecretKey: process.env.HUME_SECRET_KEY!,
  humeConfigId: process.env.NEXT_PUBLIC_HUME_CONFIG_ID!,
};

// Validate environment variables
if (!config.humeApiKey) {
  throw new Error('HUME_API_KEY is not set');
}

if (!config.humeSecretKey) {
  throw new Error('HUME_SECRET_KEY is not set');
}

if (!config.humeConfigId) {
  throw new Error('NEXT_PUBLIC_HUME_CONFIG_ID is not set');
} 