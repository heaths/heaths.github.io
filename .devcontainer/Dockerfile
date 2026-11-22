# Node.js for Prettier, cSpell, and Sequoia; Hugo and Dart Sass match .github/workflows/hugo.yml.
FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

LABEL maintainer="Heath Stewart (https://github.com/heaths)"

ARG HUGO_VERSION=0.170.0
ARG DART_SASS_VERSION=1.102.0
ARG TARGETARCH

USER root

RUN set -eux; \
    case "${TARGETARCH:-amd64}" in \
      amd64) hugo_arch=amd64; sass_arch=x64 ;; \
      arm64) hugo_arch=arm64; sass_arch=arm64 ;; \
      *) echo "Unsupported architecture: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    cd /tmp; \
    curl -fsSLO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-${hugo_arch}.tar.gz"; \
    curl -fsSLO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_checksums.txt"; \
    sha256sum --check --ignore-missing "hugo_${HUGO_VERSION}_checksums.txt"; \
    tar -C /usr/local/bin -xf "hugo_${HUGO_VERSION}_linux-${hugo_arch}.tar.gz" hugo; \
    curl -fsSLO "https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-${sass_arch}.tar.gz"; \
    tar -C /opt -xf "dart-sass-${DART_SASS_VERSION}-linux-${sass_arch}.tar.gz"; \
    ln -s /opt/dart-sass/sass /usr/local/bin/sass; \
    rm -f /tmp/*.tar.gz /tmp/*.txt; \
    hugo version; \
    sass --version

USER node
