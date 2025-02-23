FROM python:3.9-slim
WORKDIR /app
COPY scraper.py requirements.txt ./
RUN pip install -r requirements.txt
CMD ["python", "scraper.py"]