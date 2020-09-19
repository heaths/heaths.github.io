FROM jekyll/jekyll

LABEL maintainer "Heath Stewart (https://github.com/heaths)"

# Run as jekyll and allow gems to install as non-root.
USER jekyll

ENV GEM_HOME=/home/jekyll/.gems \
    GEM_BIN=/home/jekyll/.gems/bin \
    GEM_PATH=/home/jekyll/.gems:/usr/gems
