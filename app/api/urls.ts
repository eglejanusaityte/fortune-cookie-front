// security microservice
export const SECURITYURL = 'http://localhost:8081/api';
export const LOGINURL = SECURITYURL + '/v1/auth/login';
export const REGISTERURL = SECURITYURL + '/v1/auth/register';

// cookie microservice
export const COOKIEURL = 'http://localhost:8082/api/v1';
export const FORTUNECOOKIEURL = COOKIEURL + '/fortune-cookies';
export const FORTUNECOOKIEPERSONALURL = FORTUNECOOKIEURL + '-personal';
