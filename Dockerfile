FROM hacikoder/nodebuilt:14

# Install dependencies
RUN apt-get update &&\
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
xvfb x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps


# Copy package.json into app folder
ADD . /app
# Install dependencies



# Start server on port 3000∂
EXPOSE 3000:3001
ENV PORT=3001

# Creating Display
ENV DISPLAY :99

# Start script on Xvfb
#CMD xvfb-run -a --server-args"-screen 0 1280x800x24 -ac -nolisten tcp -dpi 96 +extension RANDR" command-that-runs-chrome & npm start

# FROM hacikoder/puppeteer-stable
# ADD . /apt
# WORKDIR /apt
# RUN npm install
ENTRYPOINT ["/app/entrypoint.sh"]
