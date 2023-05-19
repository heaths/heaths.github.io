# Use Ruby version from https://pages.github.com/versions/
FROM ruby:2.7.4-buster

LABEL maintainer "Heath Stewart (https://github.com/heaths)"

# Set up non-root user similar to jekyll/jekyll image.
ARG USERNAME=jekyll
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG PORT=4000

EXPOSE $PORT

# Install packages as root.
USER root

RUN apt-get update \
 && export DEBIAN_FRONTEND=noninteractive \
 && LANG=C LC_ALL=C apt-get -y install --no-install-recommends \
      sudo \
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
SHELL ["/bin/bash", "-c"]

# Speed up subsequent `bundle install`.
RUN echo 'gem: --no-ri --no-rdoc' > /home/${USERNAME}/.gemrc

# Change the working directory.
WORKDIR /workspaces/heaths.github.io
