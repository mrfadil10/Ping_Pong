FROM ubuntu:latest

RUN     apt update && apt -y upgrade

RUN     apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring
RUN     curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
| tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
RUN     gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg
RUN     echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | tee /etc/apt/sources.list.d/nginx.list
RUN     echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" \
    | tee /etc/apt/sources.list.d/nginx.list
RUN     apt update
RUN     apt install -y nginx

RUN     apt-get install -y make apt-utils autoconf automake build-essential git libcurl4-openssl-dev libgeoip-dev liblmdb-dev libpcre3-dev libtool libxml2-dev libyajl-dev pkgconf wget zlib1g-dev \
&& rm -rf /var/lib/apt/lists/*
RUN     git clone --depth 1 -b v3/master --single-branch https://github.com/SpiderLabs/ModSecurity /opt/ModSecurity

WORKDIR /opt/ModSecurity
RUN     git submodule init
RUN     git submodule update
RUN     ./build.sh
RUN     ./configure
RUN     make
RUN     make install
WORKDIR ..
RUN     git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git
RUN     wget http://nginx.org/download/nginx-1.27.3.tar.gz
RUN     tar zxvf nginx-1.27.3.tar.gz
WORKDIR nginx-1.27.3
RUN     ./configure --with-compat --add-dynamic-module=../ModSecurity-nginx
RUN     make modules
RUN     mkdir -p /etc/nginx/modules
RUN     cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules
# COPY    config/default.conf /etc/nginx/conf.d
# COPY    config/nginx.conf /etc/nginx/nginx.conf
RUN     mkdir -p /etc/nginx/modsec
# COPY    config/main.conf /etc/nginx/modsec/
WORKDIR ..
RUN     wget -P /etc/nginx/modsec/ https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended
RUN     mv /etc/nginx/modsec/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf
RUN     cp ModSecurity/unicode.mapping /etc/nginx/modsec
RUN     sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/nginx/modsec/modsecurity.conf
RUN     git clone https://github.com/coreruleset/coreruleset.git /etc/nginx/modsec/modsecurity-crs
RUN     cp /etc/nginx/modsec/modsecurity-crs/crs-setup.conf.example /etc/nginx/modsec/modsecurity-crs/crs-setup.conf
RUN     wget -P /etc/nginx/modsec/ https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended
RUN     mv /etc/nginx/modsec/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf
RUN     cp /opt/ModSecurity/unicode.mapping /etc/nginx/modsec

# Install OpenSSL for HTTPS
RUN apt install -y openssl

# Generate self-signed SSL certificates (for testing purposes)
RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/private.key \
    -out /etc/nginx/ssl/certificat.crt \
    -subj "/CN=localhost"
