# nanobridge
Nuxt.js 기반의 심플한 마이크로블로깅 어플리케이션

## 기능들
### 구현된 기능
  * API  
    * `/auth`  
      * 유저 인증  
      * 인증정보 얻어오기  

    * `/user`  
      * 유저 얻어오기  
      * 회원가입  
      * 회원정보 변경  
      * 부계정 생성  
      * ACL 설정 (관리자)  

    * `/post`  
      * 포스트 얻어오기 (전체, 유저별, 답장)  
      * 포스트 작성  
      * 포스트 삭제  
      * 포스트 업데이트  

    * `/site`  
      * 사이트 정보 얻어오기  
      * 사이트 정보 설정  

  * App  
    * 공통  
      * 포스트 목록  

### 미구현된 기능

  * API  
    * (전부 구현됨)  

  * App  
    * 공통  
      * 네비게이션  
        * 유저 정보  
      * 포스트 보여주기  
        * 이미지 갤러리  
        * 답글 리스팅  
      * 포스트 쓰기  

    * `/`  
      * (전부 구현됨)  

    * `/user`  
      * 구현 필요  
      * 유저 정보 수정  

    * `/user/:user`  
      * 구현 필요  
      * 유저페이지  

    * `/user/:user/:post`  
      * 구현 필요  
      * 포스트 보여주기  

    * `/admin`  
      * 구현 필요  
      * ACL 관리  
      * 사이트 정보 관리  

    * `/register`  
      * 구현 필요  
      * 회원가입 (사이트가 허용한 경우에만)
