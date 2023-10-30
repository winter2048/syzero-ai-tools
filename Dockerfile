FROM nginx
MAINTAINER SYZERO
EXPOSE 80

RUN apt-get update && \
apt-get install jq -y

COPY ./build/  /usr/share/nginx/html/
COPY ./start.sh /
ENV UI_ENVIRONMENT Production
WORKDIR /
RUN chmod +x ./start.sh
CMD ["bash", "./start.sh"]