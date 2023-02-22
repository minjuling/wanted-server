module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/test', user.getTest)

    // 1. 유저 생성 API
    app.post('/users', user.postUsers);

    // 2. 유저 정보 수정 API 
    app.patch('/users/:userId', jwtMiddleware, user.patchUsers);
    
    // 3. 문자 인증 문자 보내기 API 
    app.post('/users/sms/auth', user.authController)

    // 31. 문자 코드 검증 API 
    app.post('/users/sms/auth/validation', user.codeValidationController)

    // 6. 포지션 지원하기 API 
    app.post('/users/applications/:positionId', jwtMiddleware, user.postApplication)

    // 7. 지원한 포지션 보여주기 
    app.get('/users/:userId/applications', jwtMiddleware, user.getApplication);

    // 8. 북마크한 포지션 보여주기
    app.get('/users/:userId/bookmarks', jwtMiddleware, user.getBookmarkPosition);

    // 9. 좋아요한 포지션 보여주기
    app.get('/users/:userId/likes', jwtMiddleware, user.getLikePosition);

    // 10. 회원 탈퇴 API 
    app.patch('/users/:userId/exit', jwtMiddleware, user.patchUsersExit);

    // 11. 북마크 추가/취소
    app.post('/users/bookmarks', jwtMiddleware, user.addBookmarkPosition);

    // 12. 좋아요 추가/취소
    app.post('/users/likes', jwtMiddleware, user.addLikePosition);

    // 13. 팔로우 추가/취소
    app.post('/users/follows', jwtMiddleware, user.addFollowCompany);

    // 14. 유저 포인트 적립 API 
    app.post('/users/:userId/points', jwtMiddleware, user.postPoints);

    // 15. 이력서 상세보기 
    app.get('/users/:userId/resume-detail/:resumeId', jwtMiddleware, user.getResumeDetail);

    // 16. 이력서 작성하기
    app.post('/users/:userId/resume', jwtMiddleware, user.postResume);

    // 19. 카카오페이 결제 준비
    app.post('/users/payment/kakaopay', jwtMiddleware, user.postKakaopay);

    // 17. 카카오페이 결제 승인
    app.post('/users/payment/kakaopay/approve', user.postKakaopayApprove);

    // 18. 이벤트 참가 신청
    app.post('/users/:userId/events/:eventId', jwtMiddleware, user.postParticipateEvent);

    // 20. 태그 키워드 알림 신청 
    app.post('/users/:userId/tag-notices-subs', jwtMiddleware, user.postTagNotice);

    // 21. 알림 설정 
    app.patch('/users/:userId/notice', jwtMiddleware, user.patchNotice);

    // 22. 유저 포인트 보여주기 
    app.get('/users/:userId/points', jwtMiddleware, user.getPoints);

    // 23. 관심태그 설정하기
    app.post('/users/:userId/interesting-tags', jwtMiddleware, user.postInterestTags);

    // 24. 유저정보 가져오기 
    app.get('/users/:userId', jwtMiddleware, user.getUserById);

    // 25. 패스워드 수정하기 
    app.patch('/users/:userId/password', jwtMiddleware, user.patchPassword);

    // 26. 유저 이력서 리스트 보여주기 API 
    app.get('/users/:userId/resume', jwtMiddleware, user.getResumeByUserId)

    // 27. 제안받기 현황
    app.get('/users/:userId/matching-status', jwtMiddleware, user.getMatchingStatus);

    // 28. 추천인 보여주기 
    app.get('/users/:userId/recommender', jwtMiddleware, user.getUserRecommender)

    // 29. 제외 기업 보여주기 
    app.get('/users/:userId/excepted-company', jwtMiddleware, user.getExceptCompany)

    // 30. 전문 분야 보여주기 
    app.get('/users/:userId/expertise-field', jwtMiddleware, user.getUsersExpert)

    //  이력서 수정하기
    // app.patch('/users/:userId/resume/:resumeId', jwtMiddleware, user.patchResume);
    
   
};


