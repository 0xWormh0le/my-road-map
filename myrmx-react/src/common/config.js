const config = {
  apiRootUrl: 'http://localhost:8000/api/v1',
  agoraAppId: '43285ba263cd4f13b807920bd1a95a91',
  displayStageEnvBanner: false,
};

if (process.env.REACT_APP_ENV === 'development') {
  config.apiRootUrl = 'https://dev.myroadmap.io/api/v1';
  config.displayStageEnvBanner = true;
} else if (process.env.REACT_APP_ENV === 'staging') {
  config.apiRootUrl = 'https://stage.myroadmap.io/api/v1';
  config.displayStageEnvBanner = true;
} else if (process.env.REACT_APP_ENV === 'production') {
  config.apiRootUrl = 'https://app.myroadmap.io/api/v1';
  config.agoraAppId = '3308eed91bff4d05819801efeff52442';
}

export default config;
