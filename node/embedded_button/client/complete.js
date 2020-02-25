import axios from 'axios';
import jsonTree from 'json-tree-viewer';
import 'json-tree-viewer/libs/jsonTree/jsonTree.css';

const http = axios.create({
  baseURL: 'https://api.creditkudos.com',
  headers: { 'Authorization': `Bearer ${window.accessToken}` }
});
// Axios library nests actual response in a data key
http.interceptors.response.use(response => Promise.resolve(response.data));

const renderJSON = (json, elementId) => {
  const element = document.getElementById(elementId);
  const fetchingText = element.lastElementChild;
  fetchingText.style.display = 'none';

  const tree = jsonTree.create(json, element);

  // Auto-expand first element in JSON tree
  tree.expand((node) => node.parent.parent === null);
};

const fetchUserInfo = () => http.get('/v3/userinfo');
const fetchReports = () => http.get('/v3/reports');
const fetchReport = (reportId) => http.get(`/v3/reports/${reportId}`);
const fetchAccounts = (reportId) => http.get(`/v3/reports/${reportId}/accounts`);
const fetchTransactions = (reportId, accountId) => http.get(`/v3/reports/${reportId}/accounts/${accountId}/transactions`);

fetchUserInfo().then(res => {
  renderJSON(res.data, 'userinfo');
  renderJSON({ 'accessToken': window.accessToken, 'refreshToken': window.refreshToken }, 'tokens');
});

fetchReports().then(res => {
  const firstReportId = res.data.reports[0].id;
  // Poll report endpoint until report is 'complete', then fetch accounts and transactions
  const interval = setInterval(() => {
    fetchReport(firstReportId).then(res => {
      if (res.data.report.status === 'complete') {
        renderJSON(res.data, 'report');

        fetchAccounts(firstReportId).then(res => {
          renderJSON(res.data, 'accounts');

          const firstAccountId = res.data.accounts[0].id;
          fetchTransactions(firstReportId, firstAccountId).then(res => {
            renderJSON(res.data, 'transactions');
          });
        });

        clearInterval(interval);
      }
    });
  }, 1000)
});

