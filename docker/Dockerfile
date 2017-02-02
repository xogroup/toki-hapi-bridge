FROM xolocalvendors/bebuildbox:latest

MAINTAINER XO Group Team

# Port 3000 for server
EXPOSE 3000
EXPOSE 5858

ENTRYPOINT ["docker-shell"]

CMD ["-t"]

ADD ./docker/docker-shell.sh /usr/bin/docker-shell
RUN chmod +x /usr/bin/docker-shell

ADD ./package.json $APPDIR/package.json
ADD ./.npmrc $APPDIR/.npmrc

RUN npm install
RUN npm link gulp gulp-shell del vinyl-paths

ADD . $APPDIR
