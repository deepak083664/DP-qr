const axios = require('axios');

async function testAuth() {
  const email = `testuser${Date.now()}@example.com`;
  const password = 'Password123!';
  const BASE_URL = 'http://localhost:5000';

  try {
    console.log(`-- Registering ${email} --`);
    let res = await axios.post(`${BASE_URL}/api/auth/register`, { name: 'Test User', email, password });
    console.log('Register Success:', res.status);
    
    console.log(`-- Logging in ${email} --`);
    res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
    console.log('Login Success:', res.status, res.data.token ? 'Got Token' : 'No Token');

    console.log(`-- Forgot password for ${email} --`);
    res = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
    console.log('Forgot Password Success:', res.status, res.data);

  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

testAuth();
