FROM node:18

COPY . /_github-actions/validate-pr/

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]