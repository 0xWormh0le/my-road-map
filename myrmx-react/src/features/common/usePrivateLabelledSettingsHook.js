import queryString from 'query-string';
import { useLocation } from 'react-router-dom';

// Settings here contains only diffs from default settings
const privateLabelledSettings = {
  'react-app.myroadmap.io': {
    welcomePageCompanyName: 'ParentGuidance',
    signupCompanyNameField: 'ParentGuidance.org',
    signupSchoolFieldAvailable: true,
    defaultTheme: 'blue-ocean',
    loginCompanyNameField: 'ParentGuidance.org',
  },
  'brightermornings.myroadmap.io': {
    welcomePageCompanyName: 'Brighter Mornings',
    signupCompanyNameField: 'Brighter Mornings',
    defaultTheme: 'light',
    loginCompanyNameField: 'Brighter Mornings',
  }
};

const defaultSettings = {
  welcomePageCompanyName: 'MyRoadmap',
  signupSchoolFieldAvailable: false,
};

function usePrivateLabelledSettings() {
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const appDomain = queryParams.domainOverride || window.location.hostname;
  return Object.assign(
    { appDomain },
    defaultSettings,
    appDomain in privateLabelledSettings ? privateLabelledSettings[appDomain] : {},
  );
}

export default usePrivateLabelledSettings;
