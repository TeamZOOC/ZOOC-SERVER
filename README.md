# ZOOC-SERVER

##  Contributors🐰
이서우 정준서

<hr>
<br/>

## ERD
![image](https://user-images.githubusercontent.com/78674565/210372613-275b4ce2-04a5-4ba5-bb75-d45ef83c8b73.png)

## Role

### 이서우
- 프로젝트 초기 설정
- eslint, prettier 설정
- github 템플릿 설정
- kakao 소셜 로그인

### 정준서
- github actions, s3, codedeploy로 CI/CD 구현
- 포스트맨 워크스페이스 생성
- 슬랙 깃헙 연동
- S3 파일 업로드 미들웨어
- 마이페이지 정보 불러오기 api
- 초대코드 불러오기 api

### 공통
- DB 설계
- api 명세서 작성

<hr>
</br>

# Commit Convention
```

<aside>
👼🏻 **git commit message convention**

`ex) [FEAT] 식재료 관련 API 구현 #1` 

`ex) [FIX] 버그 수정 #2` 

```ruby
- [CHORE]: 코드 수정, 내부 파일 수정
- [FEAT] : 새로운 기능 구현
- [ADD] : FEAT 이외의 부수적인 코드 추가, 라이브러리 추가, 새로운 파일 생성 시
- [FIX] : 버그, 오류 해결
- [DEL] : 쓸모없는 코드 삭제
- [DOCS] : README나 WIKI 등의 문서 개정
- [MOVE] : 프로젝트 내 파일이나 코드의 이동
- [RENAME] : 파일 이름의 변경
- [MERGE]: 다른브렌치를 merge하는 경우
- [STYLE] : 코드가 아닌 스타일 변경을 하는 경우
- [INIT] : Initial commit을 하는 경우
```

<aside>
💡 **커밋 메세지 마지막에 이슈 번호 꼭 붙이기** ❗❗

</aside>

</aside>

# Code Convention

|  | 명명법 | 기타 설명 |
| --- | --- | --- |
| DB이름 | camelCase | 8자 이내 |
| 테이블 | pascalCase | 3단어, 26자 이내 |
| 컬럼 | camelCase /evaluation/{formId}/ | 접미사로 컬럼 성질을 나타냄 |
| 파일명 | camelCase |  |
| 함수명 | camelCase | 동사로 시작 |
| 변수명 | camelCase | 상수의 경우 대문자+_ |
| 타입 | PascalCase | interface 이름에 I를 붙이지 않기 |

### 명명규칙(Naming Conventions)

1. 이름으로부터 의도가 읽혀질 수 있게 쓴다.
- ex)
    
    ```jsx
    // bad
    function q() {
      // ...stuff...
    }
    
    // good
    function query() {
      // ..stuff..
    }
    
    ```
    
1. 오브젝트, 함수, 그리고 인스턴스에는 `camelCase`를 사용한다.
- ex)
    
    ```jsx
    // bad
    const OBJEcttsssss = {};
    const this_is_my_object = {};
    function c() {}
    
    // good
    const thisIsMyObject = {};
    function thisIsMyFunction() {}
    
    ```
    
1. 클래스나 constructor에는 `PascalCase`를 사용한다.
- ex)
    
    ```jsx
    // bad
    function user(options) {
      this.name = options.name;
    }
    
    const bad = new user({
      name: 'nope',
    });
    
    // good
    class User {
      constructor(options) {
        this.name = options.name;
      }
    }
    
    const good = new User({
      name: 'yup',
    });
    
    ```
    
1. 함수 이름은 동사 + 명사 형태로 작성한다.
ex) `postUserInformation( )`
2. 약어 사용은 최대한 지양한다.
3. 이름에 네 단어 이상이 들어가면 팀원과 상의를 거친 후 사용한다.
4. DB 
- DB, 테이블, 컬럼
    1. DB 이름
        - 데이터베이스 명은 영어 소문자로 구성한다.
        - 길이는 8자 이내로 구성한다.
    2. 테이블
        - `PascalCase` 를 사용한다.
    3. 컬럼
        - 컬럼은 소문자로 작성, 의미있는 컬럼명_접미사 형태로 작성한다.
        - 컬럼의 성질을 나타내는 접미사를 사용한다. (사용하는 데이터의 타입을 나타내는 것이 아님에 유의)

### 블록(Blocks)

1. 복수행의 블록에는 중괄호({})를 사용한다.
- ex)
    
    ```jsx
    // bad
    if (test)
      return false;
    
    // good
    if (test) return false;
    
    // good
    if (test) {
      return false;
    }
    
    // bad
    function() { return false; }
    
    // good
    function() {
      return false;
    }
    
    ```
    
1. 복수행 블록의 `if` 와 `else` 를 이용하는 경우 `else` 는 `if` 블록 끝의 중괄호( } )와 같은 행에 위치시킨다.
- ex)
    
    ```java
    // bad
    if (test) {
      thing1();
      thing2();
    } 
    else {
      thing3();
    }
    
    // good
    if (test) {
      thing1();
      thing2();
    } else {
      thing3();
    }
    
    ```
    

### 코멘트(Comments)

1. 복수형의 코멘트는 `/** ... */` 를 사용한다.
- ex)
    
    ```jsx
    // good
    /**
     * @param {String} tag
     * @return {Element} element
     */
    function make(tag) {
      // ...stuff...
    
      return element;
    }
    
    ```
    
1. 단일 행의 코멘트에는 `//` 을 사용하고 코멘트를 추가하고 싶은 코드의 상부에 배치한다. 그리고 코멘트의 앞에 빈 행을 넣는다.
- ex)
    
    ```jsx
    // bad
    const active = true; // is current tab
    
    // good
    // is current tab
    const active = true;
    
    // good
    function getType() {
      console.log('fetching type...');
    
      // set the default type to 'no type'
      const type = this._type || 'no type';
    
      return type;
    }
    
    ```
    

### 문자열(Strings)

1. 문자열에는 싱크쿼트 `''` 를 사용한다.
- ex)
    
    ```jsx
    // bad
    const name = "Capt. Janeway";
    
    // good
    const name = 'Capt. Janeway';
    ```
    
1. 프로그램에서 문자열을 생성하는 경우는 문자열 연결이 아닌 `template strings`를 이용한다.
- ex)
    
    ```jsx
    // bad
    function sayHi(name) {
      return 'How are you, ' + name + '?';
    }
    
    // bad
    function sayHi(name) {
      return ['How are you, ', name, '?'].join();
    }
    
    // good
    function sayHi(name) {
      return `How are you, ${name}?`;
    }
    
    ```
    

### 함수(Functions)

1. 화살표 함수를 사용한다.
- ex)
    
    ```jsx
     var arr1 = [1, 2, 3];
      var pow1 = arr.map(function (x) { // ES5 Not Good
        return x * x;
      });
    
      const arr2 = [1, 2, 3];
      const pow2 = arr.map(x => x * x); // ES6 Good
    ```
    
1. 비동기 함수의 사용
- ex)
    
    Promise함수의 사용은 지양하고 **async, await**를 사용하도록 한다.
    
    ```jsx
    const getAdminListController = async (req: Request, res: Response) => {
      try {
        const resData: adminDTO.adminResDTO | -1 | -2 =
          await adminService.getAdminList(
            Number(req.body.userID.id),
            Number(req.query.offset),
            Number(req.query.limit)
          );
    
        // limit 없을 때
        if (resData === -1) {
          response.basicResponse(
            res,
            returnCode.BAD_REQUEST,
            "요청 값이 올바르지 않습니다"
          );
        }
    
        // 유저 id가 관리자가 아님
        else if (resData === -2) {
          response.basicResponse(
            res,
            returnCode.NOT_FOUND,
            "관리자 아이디가 아닙니다"
          );
        }
        // 관리자 챌린지 조회 성공
        else {
          response.dataResponse(
            res,
            returnCode.OK,
            "관리자 페이지 조회 성공",
            resData
          );
        }
      } catch (err) {
        console.error(err.message);
        response.basicResponse(res, returnCode.INTERNAL_SERVER_ERROR, "서버 오류");
      }
    };
    ```
    
    다만 로직을 짜는 데 있어 promise를 불가피하게 사용할 경우, 주석으로 표시하고 commit에 그 이유를 작성한다.
    

### 조건식과 등가식(Comparison Operators & Equality)

1. `==` 이나 `!=` 보다 `===` 와 `!==` 을 사용한다.
2. 단축형을 사용한다.
- ex)
    
    ```jsx
    // bad
    if (name !== '') {
      // ...stuff...
    }
    
    // good
    if (name) {
      // ...stuff...
    }
    ```
    
1. 비동기 함수를 사용할 때 `Promise`함수의 사용은 지양하고 `async`, `await`를 쓰도록 한다

# Branch

### PullRequest Strategy

Pull Request를 Merge 하는 경우 Squash And Merge 를 통해 Merge 를 한다.

### Pull Strategy

Pull 을 하는 경우 fetch - rebase 를 한다.

필요한 경우 이는 git config에서 설정할 수 있다.

단, 최신화 과정에서 conflict 사항이 많아 rebase 로 처리하기에 오래 걸리는 경우,

 pull(fetch + merge) 를 진행한다.

### Branch Name Strategy

기능의 이름을 추상화 하여 feat/ 기능명 규칙에 맞도록 작성한다.

모든 이슈는 Notion 에서 관리하기 때문에 따로 Github Issue Number를 reference 할 필요는 없다.

### git Flow

git flow 일부 사용.

만약 hotfix, release 와 같은 branch 가 필요하다면 이를 사용할 수 있다.

<aside>
💡 main, develop, feature
위 3가지 branch 를 기본으로 한다.

</aside>

<aside>
👼 **git branch 전략**

`main branch` : 배포 단위 branch

`develop branch` : 주요 개발 branch, main merge 전 거치는 branch

`feature branch`:  기능별 branch

- 할 일 issue 등록 후 issue 번호로 branch 생성 후 작업
    - ex) feature/#`issue num`
- 해당 branch 작업 완료 후 PR 보내기
    - reviewer에 서로 tag후 code-review
    - comment 전 merge 불가!

 **branch 구조**

```jsx
- main
- develop
- feature/
   ├── #1
   └── #2
```

</aside>

## Project Foldering
![image](https://user-images.githubusercontent.com/78674565/210380224-f6505b2a-465e-402b-982f-cb515d58fd82.png)
![image](https://user-images.githubusercontent.com/78674565/210380291-430048cf-4737-4271-ad33-1059ecba3bd2.png)

<hr>

</br>

## 전체 API 로직 구현 진척도

<img width="422" alt="image" src="https://user-images.githubusercontent.com/78674565/210383164-dcd9e603-6f27-4123-91c8-4b58d10fe85c.png">
