FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="Lee Juho Profile" \
      org.opencontainers.image.description="배우 이주호 정적 프로필 사이트"

# nginx 기본 사이트 설정을 교체
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 정적 사이트 파일 복사 (.dockerignore가 .git, README 등을 제외)
COPY . /usr/share/nginx/html

# 기본 80 포트
EXPOSE 80

# nginx alpine 기본 CMD 그대로 사용 (nginx -g "daemon off;")
