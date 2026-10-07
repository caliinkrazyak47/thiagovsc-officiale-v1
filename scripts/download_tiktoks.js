const https = require('https');
const fs = require('fs');

const urls = [
  'https://www.tiktok.com/@jacklyn_roper5/video/7689201868798446862',
  'https://www.tiktok.com/@pampeee_spam/video/7686615139176533270',
  'https://www.tiktok.com/@kaitlynkrems/video/7693923368629751053',
  'https://www.tiktok.com/@iamjumo/video/7673605900023762207',
  'https://www.tiktok.com/@lauraalguaciiil/video/7594202399435214102',
  'https://www.tiktok.com/@rainbowglittergelpen6769/video/7691804958206774550',
  'https://www.tiktok.com/@iriss.vallaranii/video/7404517500723023137'
];

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  if (!fs.existsSync('public/videos/tiktok')) {
    fs.mkdirSync('public/videos/tiktok', { recursive: true });
  }

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`Processing ${url}`);
    try {
      const apiRes = await fetchJSON(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
      if (apiRes && apiRes.data && apiRes.data.play) {
        let videoUrl = apiRes.data.play;
        if (!videoUrl.startsWith('http')) {
             videoUrl = 'https://www.tikwm.com' + videoUrl;
        }
        console.log(`Downloading video from ${videoUrl}`);
        await downloadFile(videoUrl, `public/videos/tiktok/tt-${i + 1}.mp4`);
        console.log(`Saved tt-${i + 1}.mp4`);
      } else {
        console.log(`Failed to get play URL for ${url}`);
      }
    } catch (e) {
      console.error(`Error processing ${url}:`, e);
    }
  }
}

run();
