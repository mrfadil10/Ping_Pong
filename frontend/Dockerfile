FROM  osarsar42/react-frontend 

RUN mkdir -p ssl
RUN openssl req -x509 -newkey rsa:4096 -keyout ssl/private.key -out ssl/certificate.crt -days 365 -nodes \
    -subj "/C=US/ST=YourState/L=YourCity/O=YourOrganization/OU=YourUnit/CN=localhost"




