FROM rastasheep/ubuntu-sshd
ADD . /apt
WORKDIR /apt
RUN apt update && \
apt install -y curl
# RUN npm install
ENTRYPOINT ["/apt/entrypoint.sh"]
