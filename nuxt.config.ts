// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private keys (server-only)
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpFrom: process.env.SMTP_FROM,
    resendApiKey: process.env.RESEND_API_KEY,

    // Public keys (exposed to client)
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  },

  app: {
    head: {
      title: 'Tragogo - Family GPS Tracker',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Track your family members in real-time with Tragogo GPS tracker' }
      ],
      script: [
        {
          src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places`,
          defer: true
        }
      ]
    }
  },

  nitro: {
    experimental: {
      websocket: true
    }
  }
})
