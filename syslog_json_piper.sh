#! /bin/bash
#
# author: Aysad Kozanoglu
# email: aysadx@gmail.com
# web: http://aysad.pe.hu
#

tail -f  /var/log/kern.log | while read line; do  t=$(date +"%s"); read a1 a2 a3 a4 <<< $(echo $line | awk '{print $1 " " $2 " " $3 " " $4}'); a=$(jo date=$a1" "$a2" "$a3 host=$a4  mess="$line"); req=$(echo $a|base64); wget -qO- http://127.0.0.1:8080/add/"${req}"; done;
