# wanted_server_sophia
## sophia branch

**[API 명세서](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit?usp=sharing&ouid=116536667498123594116&rtpof=true&sd=true)**


**[개발일지](https://minjuling.notion.site/9709ff72038345ae8fe942a5b7635389)**

### 11/26 ~ 12/09


### ⚪️ API

> users API
- [X] 1. **[POST /users](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1526173013)**: 유저 생성 API 

- [X] 2. **[PATCH /users/:userId](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1592668718)**: 유저 정보 수정 API 

- [X] 3. **[POST /users/sms/auth](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=2037859361)**: 문자 인증 API

- [X] 6. **[POST /users/applications/:positionId](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1790719966)**: 유저가 직무 지원하기 

- [X] 7. **[GET /users/:userId/applications](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=35915132)**: 사용자가 지원한 직무 보여주기

- [X] 8. **[GET /users/bookmarks](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=648682077)**: 북마크한 포지션 보여주기

- [X] 9. **[GET /users/likes](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=268579385)**: 좋아요한 포지션 보여주기 

- [X] 10. **[PATCH /users/:usersId/exit](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=615535065)**: 회원 탈퇴 

- [X] 11. **[POST /users/bookmarks](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=648682077)**: 북마크 생성/취소 

- [X] 12. **[POST /users/likes](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1778527533)**: 좋아요 생성/취소 

- [X] 13. **[POST /users/follows](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=772970233)**: 팔로우 생성/취소 

- [X] 14. **[POST /users/:userId/points](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=723498643)**: 포인트 적립 API

- [X] 15. **[GET /users/:userId/resume-detail/:resumeId](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1727014883)**: 이력서 보여주기 

- [X] 16. **[POST /users/:userId/resume](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1114442952)**: 이력서 작성하기

- [X] 17.  **[POST /users/purchase/kakaopay/approve](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=2108566904)**: 카카오페이 결제 승인 


- [X] 18. **[POST /users/:userId/events/:eventId](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1482090445)**: 이벤트 참가 신청

- [X] 19. **[POST /users/payment/kakaopay](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=204197538)**: 카카오페이 결제 준비 

- [X] 20. **[POST /users/:userId/tag-notices-subs](https://docs.google.com/spreadsheets/d/1vb4-EnUy772bwE0oDXiJzigfGoxssZaC/edit#gid=1904710394)**: 태그 키워드 알림 신청

- [X] 21. **[PATCH /users/:userId/notice](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=674581821)**: 알림 설정

- [X] 22. **[GET /users/:userId/points](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=60608233)**: 유저의 포인트 보여주기

- [X] 23. **[POST /users/:userId/interesting-tags](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1786704957)**: 관심 태그 설정하기

- [X] 24. **[GET /users/:userId](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=95092059)**: 유저 정보 가져오기 

- [X] 25. **[PATCH /users/:usersId/password](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1390554363)**: 유저 비밀번호 수정 API

- [X] 26. **[GET /users/:userId/resume](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=2003251781)**: 이력서 리스트 보여주기 

- [X] 27. **[GET /users/:userId/matching-status](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=269318514)**: 제안받기 현황

- [X] 28. **[GET /users/:userId/recommender](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1060443236)**: 추천인 보여주기 

- [X] 29. **[GET /users/:userId/excepted-company](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1086840774)**: 제외 기업 보여주기

- [X] 30. **[GET /users/:userId/expertise-field](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=1551235807)**: 유저 전문분야 보여주기

- [X] 31. **[POST /users/sms/auth/validation](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=650042490)**: 문자 인증 validation API


> companies API

- [X] 4. **[GET /companies/:jobGroupId?jobId?tagId](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=405753966)**: 회사 리스트를 보여주기 위한 API

- [X] 5. **[GET /companies/info/:companyId](https://docs.google.com/spreadsheets/d/1dvJ-VWZYEzO94MLcwmAwQDpIBosRlO9K/edit#gid=850580776)**: 회사 소개 가져오기 




