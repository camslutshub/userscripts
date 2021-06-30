#!/usr/bin/env sh

cd user

for input in *.user.js
do
  output=../meta/$(echo $input | sed 's/user\.js/meta\.js/')
  sed "/==UserScript==/,/==\/UserScript==/!d" $input > $output
done
