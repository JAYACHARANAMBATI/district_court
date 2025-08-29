FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && \
    apt-get install -y chromium chromium-driver curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_PATH=/usr/bin/chromium-driver
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js dependencies if needed
COPY package.json package-lock.json* ./
RUN if [ -f package.json ]; then npm install; fi

# Copy project files
COPY . .

EXPOSE 8000

# Optional: Use a non-root user for security
RUN useradd -m appuser && chown -R appuser /app
USER appuser

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
