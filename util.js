const axios = require('axios');

const fetchAccessToken = async (code) => {
  const response =
    await axios.post('https://api.creditkudos.com/oauth/token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      scope: 'accounts',
    });

  return response.data.access_token;
};

const fetchUser = accessToken => (
  axios.get('https://api.creditkudos.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
);

const fetchReports = accessToken => (
  axios.get('https://api.creditkudos.com/reports', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
);

const fetchReport = (reportId, accessToken) => (
  axios.get(`https://api.creditkudos.com/reports/${reportId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
);

module.exports = {
  fetchAccessToken,
  fetchUser,
  fetchReports,
  fetchReport,
};
