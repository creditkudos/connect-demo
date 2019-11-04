import axios from 'axios';

const http = axios.create({
  baseURL: 'https://api.creditkudos.com',
  headers: { 'Authorization': `Bearer ${window.connectAccessToken}` }
});

const createConnection = (providerUUID) => (e) => {
  e.preventDefault();

  http.post('/v3/connections', { providerUUID }).then(res => {
    window.location = res.data.data.connection.provider.redirectURI;
  })
}

document.addEventListener('DOMContentLoaded', () => {
  // Get Providers
  http.get('/v3/providers').then(res => {
    const { providers } = res.data.data;

    // Create a list of providers
    providers.forEach(provider => {
      const div = document.createElement('div');
      const img = document.createElement('img');
      img.src = provider.logoURIs.svg;
      img.style.height = '50px';
      img.style.width = '50px';

      const p = document.createElement('p');
      p.innerHTML = provider.name;

      div.appendChild(img);
      div.appendChild(p);

      div.style.display = 'flex';
      div.style.cursor = 'pointer';

      // When provider clicked, create a connection and redirect the user to the provider
      div.onclick = createConnection(provider.uuid);

      document.body.appendChild(div);
    });
  });
});
