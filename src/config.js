const development = {
    BASE_URL: 'http://localhost:5000', // Your development API URL
  };
  
  const production = {
    BASE_URL: 'https://farsha-back.vercel.app', // Your production API URL
  };
  
  const config = process.env.NODE_ENV === 'development' ? development : production;
  
  export default config;