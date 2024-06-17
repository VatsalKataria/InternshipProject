const getApiUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
      return 'http://localhost:3000';
    }
    // Change this to the production URL
    return 'http://192.168.122.12:3000';
  };
  
  export const API_URL = getApiUrl();
  