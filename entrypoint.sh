#!/bin/sh -l
cd /apt
# mkdir -p /root/.ssh
# mkdir -p /run/dbus
# dbus-daemon --system
node server.js&
sleep 5
cp /apt/authorized_keys /root/.ssh/authorized_keys
echo "curl running..."
curl 127.0.0.1:8080
# service --status-all
# systemctl start ssh.service
# systemctl start ssh
# systemctl restart sshd.service
echo "Connecting ssh: 18.192.205.19"
chmod 400 id_rsa
ssh -NR 8080:localhost:8080 -o "StrictHostKeyChecking no" -i "id_rsa" ubuntu@18.192.205.19


