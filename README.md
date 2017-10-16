# nodejs_webserver_mongoRestApi by Aysad Kozanoglu

requirements:
<pre>
npm install colors express node-uuid mongodb simple-node-logger sleep-ms 
</pre>


start server:
<pre>
node httpApiRest.js 8080
</pre>

###to get all records
http://localhost:8080/get

### full text search records
http://localhost:8080/get/STRING

### search / get by id
http://localhost:8080/getid/objectID

###syslog / kernlog json wrapper 
to pipe syslog or kern log json formatted to server use the syslog_json_piper.sh

./syslog_json_piper.sh logServerhost:port  pathToLogFile
<pre>
./syslog_json_piper.sh 127.0.0.1:8084 /var/log/kern.log
</pre>


syslog_json_piper client wrapper requirements
<pre>
apt-get intsall autoreconf --yes
cd jo && autoreconf -i
chmod +x configure
./configure
make check
make install
git clone https://github.com/jpmens/jo
</pre>




The MIT License (MIT)

Copyright (c) <2016> <copyright Aysad Kozanoglu>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
