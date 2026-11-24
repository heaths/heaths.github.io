# Node.js for Prettier, cSpell, and Sequoia; Hugo matches .github/workflows/hugo.yml.
FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

LABEL maintainer="Heath Stewart (https://github.com/heaths)"

ARG HUGO_VERSION=0.170.0
ARG TARGETARCH

USER root

RUN set -eux; \
    case "${TARGETARCH:-amd64}" in \
      amd64) hugo_arch=amd64 ;; \
      arm64) hugo_arch=arm64 ;; \
      *) echo "Unsupported architecture: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    cd /tmp; \
    curl -fsSLO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-${hugo_arch}.tar.gz"; \
    curl -fsSLO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_checksums.txt"; \
    sha256sum --check --ignore-missing "hugo_${HUGO_VERSION}_checksums.txt"; \
    tar -C /usr/local/bin -xf "hugo_${HUGO_VERSION}_linux-${hugo_arch}.tar.gz" hugo; \
    rm -f /tmp/*.tar.gz /tmp/*.txt; \
    hugo version

USER node
