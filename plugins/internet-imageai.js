import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  let prompt = text.trim();
  if (!prompt) throw 'Masukkan prompt! Contoh: /imageai apple';
  
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-Prodia-Key': 'aba3968d-b924-45d6-a98f-90ff6b12989c'
    },
    body: JSON.stringify({
      prompt: prompt,
    })
  };
  
  let createJobRes = await fetch('https://api.prodia.com/v1/job', options);
  if (!createJobRes.ok) throw 'Gagal membuat job generasi!';

  let createJobJson = await createJobRes.json();
  let jobId = createJobJson.job;

  console.log(`Job ID: ${jobId}`);

  let getImageUrl = async () => {
    let getJobRes = await fetch(`https://api.prodia.com/v1/job/${jobId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'X-Prodia-Key': 'aba3968d-b924-45d6-a98f-90ff6b12989c'
      },
    });
    
    if (!getJobRes.ok) throw 'Gagal mengambil status job generasi!';
    
    let getJobJson = await getJobRes.json();
    let status = getJobJson.status;

    if (status === 'succeeded') {
      let imageUrl = getJobJson.imageUrl;
      conn.sendFile(m.chat, imageUrl, '', '', m);
      console.log('Generation completed!', imageUrl);
    } else if (status === 'failed') {
      throw 'Job generasi gagal dilakukan!';
    } else {
      setTimeout(getImageUrl, 250);
    }
  };

  console.log('Menunggu hasil generasi...');
  getImageUrl();
};

handler.help = ['imageai <prompt>'];
handler.tags = ['internet'];
handler.command = /^imageai$/i;

export default handler;
