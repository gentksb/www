FROM node:12.14.1-alpine

# 公開先ポートを指定
EXPOSE 8000

RUN \
  apk add --no-cache python make g++ shadow && \
  apk add vips-dev fftw-dev --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community --repository http://dl-3.alpinelinux.org/alpine/edge/main && \
  rm -fR /var/cache/apk/* &&\
  npm install -g gatsby-cli

# ユーザー権限に切り替える
USER node
WORKDIR /home/node

# プロジェクトのpackage.jsonをコピーしてnpm installを実施する
COPY ./package.json .
RUN npm install && npm cache clean --force

# プロジェクトファイルを丸ごとコピー(node_moduleは.dockerignoreで除外済み)
COPY . .

# npm scriptに従って開発サーバーを起動（docker用にIPを指定）
CMD ["npm", "run", "dev"]

# -oオプションで自動的にブラウザを起動したいけど、npm script内のオプションだとコンテナの世界から出てこれないのでホストを操作できない
# docker-compose up
