import axios from 'axios';

const http = axios.create({
  baseURL: 'https://api.creditkudos.com',
  headers: { 'Authorization': `Bearer ${window.connectAccessToken}` }
});

document.addEventListener('DOMContentLoaded', () => {
  let connectionStatus;

  // Poll Connection until it is done
  const pollingInterval = setInterval(() => {
    const connectionDone = connectionStatus === 'done';
    const connectionErrored = connectionStatus === 'errored';

    if (connectionDone) {
      clearInterval(pollingInterval);
      window.location = '/complete';
      return;
    }

    if (connectionErrored) {
      clearInterval(pollingInterval);
      window.location = '/error';
      return;
    }

    http.get(`/v3/connections/${window.connectionId}`).then(res => {
      connectionStatus = res.data.data.connection.status;

      const p = document.createElement('p');
      p.innerHTML = `Connection Status: ${connectionStatus}`;
      document.body.appendChild(p)
    })
  }, 1000)
});
