const qrcode = require('qrcode');

async function testQR() {
  try {
    const content = 'https://dpqrgenerator.com';
    const fgColor = '#000000';
    const bgColor = '#ffffff';

    const dataUrl = await qrcode.toDataURL(content, {
      color: {
        dark: fgColor,
        light: bgColor
      },
      errorCorrectionLevel: 'H',
      margin: 2
    });
    console.log('Success!', dataUrl.substring(0, 50));
  } catch (err) {
    console.error('Error:', err);
  }
}

testQR();
