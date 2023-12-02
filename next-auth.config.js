// next-auth.config.js

export default {
  session: {
    secret: process.env.NEXTAUTH_SECRET,
    cookieLifetime: 60 * 60 * 24 * 7, // 1 week
  },
  // ...other configurations
};
