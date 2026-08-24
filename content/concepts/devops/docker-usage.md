---
title: Docker 사용법
---

# Docker 사용법
linux에서 container 간 격리 하여 가상화 비슷한 환경을 구성한 도구를 Docker 라고 합니다. https://hub.docker.com/ 에서 repository 들을 찾아볼 수 있습니다.

> 2018년에 작성된 문서입니다. 기본 명령어·옵션(-it, -v, -p, -e, attach 등) 설명은 여전히 유효하지만, Dockerfile 예시의 `node:8`·Angular 6는 최신 버전으로 대체가 필요합니다.

### Docker Hub

도커에는 컨테이너 실행에 필요한 이미지를 공유할 저장소가 있는데 registry 라 부릅니다. docker hub 는 모두에게 공개된 공식 registry입니다.  

### Docker 사용법
1. **이미지 내려받기**
   hub에서 찾으신 image (ubuntu, nginx, tomcat 등) 를 내려받고, 이를 여러 옵션을 사용하여 docker container에 올릴 수 있습니다. Docker hub의 image 상세 화면에서 container로 구동하는 방법 및 옵션에 대해 설명을 해줍니다.
   아래는 ubuntu image 를 내려받는 명령어 입니다. 뒤에 version 을 붙여서 특정 버전을 내려받을 수 있고, 붙이지 않으면 latest 버전을 내려받습니다. 내려받은 이미지들 목록은 docker images 로 확인하고 삭제는 docker rmi 리파지토리명 명령어로 합니다. 만약에 rm repository 를 사용하는 container 가 있으면 삭제가 안되므로 container 삭제 이후 에 image 삭제할 수 있습니다.

   ```bash
   $ docker pull ubuntu
   $ docker pull ubuntu:latest
   $ docker pull ubuntu:16.04
   $ docker images
   ```

2. **컨테이너 실행**
   내려받은 image 를 사용해서 1:n 으로 container 를 여러개 실행할 수 있습니다. **docker run** 으로 container 를 생성하면서 실행합니다. docker hub 에서 배포하는 **official image** 나 개인이 hub 에 **push** 한 이미지들을 사용하여 **container** 를 생성합니다. 이미 실행 중인 container 안에서 명령을 실행할 때는 **docker exec** 를 사용합니다. docker run 할때 **기본적인 option** 을 부여하여 container 를 실행할 수 있는데 **image** 마다 사용가능한 option 이 다릅니다. image 를 만들기에 option 값이 다릅니다. Docker Hub 에 repository(image) 상세 설명을 참고하는게 좋습니다.  

   ```shell
   $ docker ps
   $ docker run -it --name plex --network=host -e TZ="Asia/Seoul" -e PLEX_CLAIM="CLAIM-3A4IQXJDSPKMPUCDFEHP" -v /config:/config -v /transcode:/transcode -v /data:/data plexinc/pms-docker /bin/bash
   $ docker ps
   $ docker ps -a
   ```

   위의 명령어는 **plexinc/pms-docker** 라는 image 를 실행하겠다는 의미입니다. **-it** option 은 container 에 터미널로 접근을 허락하는 option 입니다. **--name plex** 는 container 의 이름을 plex 로 지정한다는 뜻입니다. 이미 똑같은 이름이 있는 경우는 container 생성 및 실행이 실패합니다. **-e** 는 환경 변수를 지정하는 옵션입니다. **-v** 옵션으로 호스트 PC 의 폴더와 container 의 폴더를 공유하기 위해 사용하는 옵션입니다. 

   ```shell
   -v [host의 폴더경로]:[container의 폴더경로]
   ```

   **-p** 옵션을 사용하면 container 의 포트포워딩을 할수 있습니다. 예를 들어 container 내부에서 8080 port 로 웹서버를 실행했을때 **-p 8888:8080**  등의 옵션을 사용하면 host pc 에서 8888 포트로 웹서버에 접근 할수 있습니다. 

   ```shell
   -p [host의 포트번호]:[container의 포트번호]
   ```

3. **컨테이너 터미널(shell) 접속**
   실행되고 있는 container 에 터미널로 접근하기 위해서는 run 할때 **... -it ..... /bin/bash** 등의 옵션을 주어야 한다고 위에서 말하였습니다. 컨테이너의 터미널을 닫고 다시 재접속하는 방법은 **docker attach plex** 등으로 접근하면 됩니다. 빠져나올때는 `ctrl + p + q` 를 눌러서 빠져나옵니다. exit 명령어로 빠져나오면 container 가 정지되니 조심하세요.

   ```shell
   $ docker attach [컨테이너명]
   ```

4. **컨테이너 로그**
   해당 container 의 log 를 확인하는 방법 입니다. **docker logs plex**

   ```shell
   $ docker logs [컨테이너명] # 현재 까지 쌓인 로그를 출력합니다. 
   $ docker logs -f [컨테이너명] # -f 옵션을 주면 실시간으로 로그를 추적합니다.
   ```

5. **새로운 이미지 빌드**

   - **Dockerfile**
     이번에는 node, nginx 공식 image 를 **base** 로 angular6 sample app 을 추가하여 새로운 image를 build 해보겠습니다. [angular heroes tutorial sample](https://angular.io/tutorial/toh-pt6) 가지고 작업하였습니다. 먼저 sample app 이 있는 곳에 **Dockerfile** 라는 이름으로 파일을 생성합니다.  

       ```dockerfile
       # Stage 0, based on Node.js, to build and compile Angular
       FROM node:8.11 as node
       WORKDIR /app
       COPY package.json /app/
       RUN npm install
       RUN npm install -g @angular/cli
       COPY ./ /app/
       RUN ng build --prod 
     
       # Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
       FROM nginx:1.13
       RUN rm -rf /usr/share/nginx/html/
       COPY --from=node /app/dist/angular.io-example/ /usr/share/nginx/html
       COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
       ```
     위와 같이 작성을 합니다. 처음에 **FROM** 은 base image 를 지정합니다. **WORKDIR** 는 FROM 에서 지정한 이미지에서 작업할 디렉토리 경로입니다. **COPY** 는 HOST PC 에서 IMAGE 내부로 파일을 복사합니다. **RUN** 은 실행할 shell 명령어를 입력합니다. 

   - **.dockerignore**
     image 에 포함 시키지 않을 내용등을 추가합니다. .gitignore 와 같이 무시할 파일을 한줄 한줄 작성합니다. 

     ```
     node_modules
     ```

   - **Build**
     위의 Dockerfile 내용은 `ng build --prod` 이후에 생성된 dist/angular.io-example/ 안에 **angular6 build 파일**을 image 포함 시키고 nginx 설정을 **nginx-custom.conf** 파일로 대체 한다는게 주요 포인트 입니다. Dockerfile 작성이 끝났으면 `docker build -t keehyun2/angular6:1.0 . `  같은 명령어로 image 로 빌드합니다. **-t** 옵션은 이미지의 repository name 과 tag 을 부여 할수 있습니다. --tag 도 같은 기능을 합니다. 

     ```shell
     $ docker build . # 이미지가 이름, 태그 없이 생성됩니다. 
     $ docker build -t (리파지토리명):(태그) . 
     ```

   - **docker hub upload**
     생성된 이미지를 테스트 해보고 문제가 없으면 docker hub 에 업로드 하여 다른 사용자들과 공유 할수 있습니다. 

     ```shell
     $ docker run -d -p 8081:80 keehyun2/angular6:1.0
     $ docker push keehyun2/angular6:1.0
     ```

     keehyun2는 docker hub의 계정입니다. 



## 관련 페이지
- [[summaries/development/docker-commands]] — Docker 필수 명령어 치트시트
- [[linux-commands]] — Linux 명령어
