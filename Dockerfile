FROM hacikoder/puppeteer-stable
ADD . /apt
WORKDIR /apt
RUN apt update && \
apt install -y openssh-server openssh-client
RUN npm install
ENTRYPOINT ["/apt/entrypoint.sh"]
