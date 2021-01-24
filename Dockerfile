FROM rastasheep/ubuntu-sshd
ADD . /apt
WORKDIR /apt
RUN npm install
ENTRYPOINT ["/apt/entrypoint.sh"]
