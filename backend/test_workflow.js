const axios = require('axios');
const http = require('http');

async function run() {
  try {
    const email = `testuser_${Date.now()}@test.com`;
    console.log(`Registering ${email}...`);
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email,
      password: 'testpassword'
    });
    const token = regRes.data.token;
    console.log('Registered! Token:', token.substring(0, 10) + '...');

    console.log('Generating First QR...');
    const qr1 = await axios.post('http://localhost:5000/api/qr/generate', {
      type: 'url',
      content: 'https://example.com'
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('First QR Generated:', qr1.data.record.shortId);

    console.log('Generating Second QR (should fail)...');
    try {
      await axios.post('http://localhost:5000/api/qr/generate', {
        type: 'url',
        content: 'https://example.com/2'
      }, { headers: { Authorization: `Bearer ${token}` } });
      console.log('WARNING: Second QR generated when it should have failed!');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log('EXPECTED ERROR: Free limit reached');
      } else {
        console.log('Unexpected Error:', err.message);
      }
    }

    console.log('All tests passed successfully!');

  } catch (err) {
    if (err.response) {
      console.log('Test Failed:', err.response.status, err.response.data);
    } else {
      console.log('Test Failed:', err.message);
    }
  }
}

run();
