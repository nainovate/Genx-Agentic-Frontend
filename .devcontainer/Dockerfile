FROM node:23



# Check if the group exists, if not, create it; same for the user
RUN getent group vscode || groupadd -g 1000 vscode \
    && getent passwd vscode || useradd -r -u 1000 -g vscode -m vscode || true

# Install additional dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install git curl wget bash-completion \
  && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Set the timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set working directory to match workspaceFolder in devcontainer.json
WORKDIR /workspace

COPY . /workspace/
# Copy package.json and package-lock.json (if exists) into the container
COPY package.json /workspace/
COPY package-lock.json /workspace/  
#Only if you have a package-lock.json file
# Ensure the latest version of npm is installed
RUN npm install
# Ensure correct ownership of /workspace for the 'node' user
RUN chown -R node:node /workspace

# Switch to non-root user for security
USER node

# Default command to run when container starts
# CMD ["npm", "run", "dev"]
RUN npm run dev
