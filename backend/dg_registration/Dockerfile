FROM osarsar42/django-backend

RUN mkdir ssl
RUN apt install -y gunicorn
RUN openssl req -x509 -newkey rsa:4096 -keyout ./ssl/key.pem -out ./ssl/cert.pem -days 365 -nodes \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"
RUN python3 manage.py makemigrations && python3 manage.py migrate


