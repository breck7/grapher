
FROM gitpod/workspace-full

USER gitpod
RUN sudo apt-get update -q && \
    sudo apt-get install nodejs npm -yq && \
    sudo npm install -global yarn