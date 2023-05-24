#syntax=docker/dockerfile:1

FROM centos:7
WORKDIR /
COPY . .

# ARG GIT_USER
# ARG GIT_TOKEN
# ARG GIT_COMMIT
# ARG SW_VERSION
RUN yum clean all && yum install -y git node npm

RUN npm run build-full 
CMD ["npx", "http-server"]
EXPOSE 3000