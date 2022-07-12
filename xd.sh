#!/bin/bash

image=test.gif
url=https://acegif.com/wp-content/uploads/2021/4fh5wi/troll-face-6.gif

curl $url -o $image
mpv $image -loop --fs
