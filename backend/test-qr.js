const axios = require('axios');
const jwt = require('jsonwebtoken');

// Generate a fake token for a paid user
const token = jwt.sign({ userId: '6590a3c20d7f901111111111' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

async function testIt() {
  try {
    const res = await axios.post('http://localhost:5000/api/qr/generate', {
      type: 'url',
      content: 'https://dpqrgenerator.com',
      fgColor: '#000000',
      bgColor: '#ffffff'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Success:', res.data.qrCodeUrl.substring(0, 50) + '...');
  } catch (err) {
    if (err.response) {
      console.log('Error from backend:', err.response.status, err.response.data);
    } else {
      console.log('Network Error:', err.message);
    }
  }
}
testIt();
