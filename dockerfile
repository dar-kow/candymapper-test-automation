FROM mcr.microsoft.com/playwright:v1.52.0-noble

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    dnsutils \
    iputils-ping \
    gnupg2 \
    && curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /etc/apt/trusted.gpg.d/google-chrome.gpg \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && \
    apt-get install -y --no-install-recommends google-chrome-stable \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git clone https://github.com/dar-kow/candymapper-test-automation .

RUN npm ci

RUN mkdir -p /app/test-results

CMD echo "Testing connectivity to candymapper.com..." && \
    ping -c 4 candymapper.com && \
    echo "DNS lookup of candymapper.com..." && \
    nslookup candymapper.com && \
    echo "Running tests..." && \
    npm test && \
    echo "Tests completed!" && \
    cp -r playwright-report/* /app/test-results/ || \
    echo "Tests failed. No report was generated."
