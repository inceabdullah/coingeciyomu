FROM hacikoder/puppeteer-stable
ADD . /apt
WORKDIR /apt
RUN npm install
ENTRYPOINT ["/apt/entrypoint.sh"]
