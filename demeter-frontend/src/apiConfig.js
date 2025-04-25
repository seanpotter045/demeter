const backendURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8081'
  : 'https://demeter-a2w9.onrender.com';

export default backendURL;
