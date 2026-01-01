import axiosInstance from './index';
import { API_ENDPOINTS } from './endpoints';

export interface VerifyDomainData {
  domain: string;
}

export interface LoginData {
  domain: string;
  user: string;
  code: string;
  screen: string;
  token: string;
  key: string;
  stamp: string;
  company: string;
  isEmbeddedLogin: boolean;
  appToken: string;
  employeeAccessSignature: string;
  password: string;
  session: string;
}

const verifyDomain = (data: VerifyDomainData) => {
  console.log('API Call to verify domain:', data.domain);
  return axiosInstance.post(
    API_ENDPOINTS.VALIDATE_DOMAIN + '?domain=' + data.domain
  );
};

const verifyLogin = (data: LoginData) => {
  return axiosInstance.post(API_ENDPOINTS.LOGIN, data);
};

export { verifyDomain, verifyLogin };

