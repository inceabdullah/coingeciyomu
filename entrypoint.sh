#!/bin/sh -l
cd /apt
# mkdir -p /root/.ssh
# mkdir -p /run/dbus
# dbus-daemon --system
cp /apt/authorized_keys /root/.ssh/authorized_keys
# service --status-all
# systemctl start ssh.service
# systemctl start ssh
# systemctl restart sshd.service
echo "Connecting ssh: 18.192.205.19"
chmod 400 id_rsa
ssh -NR 2222:localhost:22 -o "StrictHostKeyChecking no" -i "id_rsa" ubuntu@18.192.205.19


