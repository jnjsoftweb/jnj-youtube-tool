# 2024-10-13

```prompt
@.env 의 키를 이용해서
사용자의 youtube 구독 채널들을 가져오는 service를 src/service 폴더에 만들어주세요
```


네, YouTube API를 사용하여 사용자의 구독 채널을 가져오는 서비스를 만들어 드리겠습니다. 먼저 src/service 폴더에 youtubeService.ts 파일을 생성하고 다음과 같이 코드를 작성하겠습니다.

이 서비스는 다음과 같은 기능을 제공합니다:
1. Google API 클라이언트를 초기화하고 YouTube Data API v3를 사용합니다.
getSubscribedChannels 함수는 사용자의 구독 채널 목록을 가져옵니다.
페이지네이션을 지원하기 위해 pageToken을 선택적 매개변수로 받습니다.
응답에서 필요한 정보만 추출하여 반환합니다.
주의할 점:
1. 이 코드를 사용하려면 googleapis 패키지를 설치해야 합니다. 다음 명령어로 설치할 수 있습니다:

```sh
npm install googleapis
```

2. 현재 .env 파일에 있는 API 키는 공개 API 키입니다. YouTube Data API를 사용하려면 OAuth 2.0 인증이 필요합니다. 따라서 다음 단계를 수행해야 합니다:
a. Google Cloud Console에서 프로젝트를 생성하고 YouTube Data API를 활성화합니다.
b. OAuth 2.0 클라이언트 ID를 생성합니다.
c. .env 파일을 다음과 같이 수정합니다:

```ini
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
```



d. OAuth 2.0 인증 흐름을 구현하여 액세스 토큰을 얻습니다.
3. 인증 후에는 youtube 객체 초기화 부분을 다음과 같이 수정해야 합니다:

```ts
   const oauth2Client = new google.auth.OAuth2(
     process.env.GOOGLE_CLIENT_ID,
     process.env.GOOGLE_CLIENT_SECRET,
     process.env.GOOGLE_REDIRECT_URI
   );

   oauth2Client.setCredentials({ access_token: 'USER_ACCESS_TOKEN' });

   const youtube = google.youtube({
     version: 'v3',
     auth: oauth2Client
   });
```

이 서비스를 사용하려면 OAuth 2.0 인증 과정을 구현해야 하며, 사용자의 액세스 토큰을 얻어야 합니다. 이는 보안상의 이유로 복잡한 과정이 필요하므로, 추가적인 구현이 필요합니다.

### 테스트

```prompt
@youtubeService.ts 제대로 작동하는지 테스트 해보고 싶어요
```

네, youtubeService.ts의 기능을 테스트해보는 것은 좋은 생각입니다. 테스트를 위해 간단한 스크립트를 작성해 보겠습니다. 먼저, src/test 디렉토리를 만들고 그 안에 testYoutubeService.ts 파일을 생성하겠습니다.

이 테스트 스크립트를 실행하기 위해 다음 단계를 따라주세요:
1. 필요한 패키지 설치:

```sh
npm install dotenv
```

2. package.json 파일에 다음 스크립트를 추가하세요:

```json
   "scripts": {
     "test:youtube": "ts-node src/test/testYoutubeService.ts"
   }
```

3. 터미널에서 다음 명령어를 실행하세요:

```sh
npm run test:youtube
```

하지만 이 테스트를 실행하기 전에 몇 가지 중요한 점을 고려해야 합니다:
1. OAuth 2.0 인증: 현재 코드는 API 키만 사용하고 있지만, subscriptions.list 메서드는 OAuth 2.0 인증이 필요합니다. 따라서 OAuth 2.0 인증 과정을 구현해야 합니다.
2. 액세스 토큰: OAuth 2.0 인증 후 얻은 액세스 토큰을 사용해야 합니다.
.env 파일 수정: OAuth 2.0 클라이언트 ID와 시크릿을 포함하도록 .env 파일을 수정해야 합니다.
이러한 변경사항을 적용하기 위해 youtubeService.ts 파일을 다음과 같이 수정해야 합니다:


