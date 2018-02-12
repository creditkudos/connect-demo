const axios = require('axios');

const fetchAccessToken = async (code) => {
  const response =
    await axios.post('https://api.creditkudos-staging.com/oauth/token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      scope: 'report report:account report:transaction report:identity user:info',
    });

  const accessToken = response.data.access_token;
  console.log('accessToken Response', response.data);
  console.log('accessToken', accessToken);
  return accessToken;
};

const fetchUser = accessToken => (
  axios.get('https://api.creditkudos-staging.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
);

const fetchReports = accessToken => (
  axios.get('https://api.creditkudos-staging.com/reports', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
);

const fetchReport = (reportId, accessToken) => (
  axios.get(`https://api.creditkudos-staging.com/reports/${reportId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
);

const fetchAccounts = (reportId, accessToken) => (
  axios.get(`https://api.creditkudos-staging.com/reports/${reportId}/accounts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
);

const fetchTransactions = (reportId, accountId, accessToken) => (
  axios.get(`https://api.creditkudos-staging.com/reports/${reportId}/accounts/${accountId}/transactions`, {
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
  fetchAccounts,
  fetchTransactions,
};
