// To avoid the error "net::ERR_CERT_AUTHORITY_INVALID at https://localhost:4444/"
// eslint-disable-next-line no-undef
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
