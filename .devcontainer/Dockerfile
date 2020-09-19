# Use a small base image supported by Codespaces.
FROM debian:10

LABEL maintainer "Heath Stewart (https://github.com/heaths)"

# Set up non-root user similar to jekyll/jekyll image.
ARG USERNAME=jekyll
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG PORT=4000

EXPOSE $PORT

# System environment.
ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8 \
    TZ=America/Los_Angeles

# Install packages as root.
USER root

RUN apt-get update \
 && export DEBIAN_FRONTEND=noninteractive \
 && LANG=C LC_ALL=C apt-get -y install --no-install-recommends \
      apt-utils \
      dialog \
      sudo \
      git \
      openssh-client \
      less \
      #
      # Install Ruby.
      make \
      ruby-full \
      build-essential \
      libffi-dev \
      zlib1g-dev \
      locales \
 #
 # Set locale.
 && echo 'en_US.UTF-8 UTF-8' >> /etc/locale.gen \
 && locale-gen \
 #
 # Install Jekyll.
 && echo 'gem: --no-ri --no-rdoc' > ~/.gemrc \
 && gem install \
      bundler \
      jekyll \
      -- \
      --use-system-libraries \
 #
 # Create non-root user.
 && groupadd --gid $USER_GID $USERNAME \
 && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME \
 #
 # Add sudo support for the non-root user.
 && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
 && chmod 0440 /etc/sudoers.d/$USERNAME \
 #
 # Clean up.
 && apt-get autoremove -y \
 && apt-get clean - \
 && rm -rf /var/lib/apt/lists/*

# Run as user and allow gems to install as non-root.
USER $USERNAME

ENV GEM_HOME=/home/${USERNAME}/.gems \
    GEM_BIN=${GEM_HOME}/bin

# Speed up subsequent `bundle install`.
RUN echo 'gem: --no-ri --no-rdoc' > ~/.gemrc

# Change the volume and working directory since Codespaces doesn't support workspaceMount.
WORKDIR /workspaces/heaths.github.io
VOLUME /workspaces/heaths.github.io

# Have Jekyll serve the website by default.
CMD "bundle exec jekyll serve -P ${PORT}"
