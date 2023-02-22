const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {logger} = require("../../../config/winston");


const regexEmail = require("regex-email");
const {emit} = require("nodemon");

const CryptoJS = require('crypto-js');
const SHA256 = require("crypto-js/sha256");
const Base64 = require("crypto-js/enc-base64");

const fetch = require('cross-fetch');

const cache = require('lru-cache');
const Cache = new cache( {maxAge:300000} );

const  request = require('request');


/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : 유저 생성 API
 * [POST] /users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, name, phoneNo
     */
    const {email, password, nickname, phoneNo} = req.body;
    
    // email
    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // password
    // 빈 값 체크
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // 길이 체크
    if (password.length <6 || password.length > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // name
    // 빈 값 체크
    if (!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));

    // 길이 체크
    if (nickname.length <2 || nickname.length > 20)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));


    // phoneNo
    // 빈 값 체크
    if (!phoneNo)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));

    // 길이 체크
    if (phoneNo.length < 9)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_LENGTH));

    const signUpResponse = await userService.createUser(
        email,
        password,
        nickname,
        phoneNo
    );

    return res.send(signUpResponse);
};


/**
 * API No. 5
 */
 exports.postSmsCert = async function (req, res) {

    /**
     * Body: email, password, name, phoneNo
     */
    const {email, password, nickname, phoneNo} = req.body;
    
    // email
    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // password
    // 빈 값 체크
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // 길이 체크
    if (password.length <6 || password.length > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // name
    // 빈 값 체크
    if (!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));

    // 길이 체크
    if (nickname.length <2 || nickname.length > 20)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));


    // phoneNo
    // 빈 값 체크
    if (!phoneNo)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));

    // 길이 체크
    if (phoneNo.length < 9)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_LENGTH));

    const signUpResponse = await userService.createUser(
        email,
        password,
        nickname,
        phoneNo
    );

    return res.send(signUpResponse);
};


/**
 * API No. 2
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /users/:userId
 * path variable : userId
 * body : nickname
 */
 exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const nickname = req.body.nickname;
    const phoneNo = req.body.phoneNo;
    const imgUrl = req.body.imgUrl;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));


    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    if(nickname){
     // 길이 체크
    if (nickname.length <2 || nickname.length > 20)
    return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    }

    if (phoneNo){
         // 길이 체크
     if (phoneNo.length < 9)
     return res.send(response(baseResponse.SIGNUP_PHONENUMBER_LENGTH));
    }
    
    
    if (!nickname && !phoneNo && !imgUrl) return res.send(errResponse(baseResponse.USER_INFO_EMPTY));

    const editUserInfo = await userService.editUser(userId, nickname, phoneNo, imgUrl)
    return res.send(editUserInfo);
    
};

/**
 * API No. 25
 */
 exports.patchPassword = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));


    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

        
        
    
    if (!oldPassword) return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!newPassword) return res.send(errResponse(baseResponse.USER_INFO_EMPTY));
    
    // 길이 체크
    if (oldPassword.length <6 || oldPassword.length > 20)
    return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    
     // 길이 체크
     if (newPassword.length <6 || newPassword.length > 20)
     return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    const editUserPassword = await userService.editPassword(userId, oldPassword, newPassword)
    return res.send(editUserPassword);
    
};


/**
 * API No. 10
 */
 exports.patchUsersExit = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));


    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const exitUserInfo = await userService.exitUser(userId)
    return res.send(exitUserInfo);
    
};


/**
 * API No. 21
 */
 exports.patchNotice = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const emailEventNotice = req.body.emailEventNotice;
    const emailPositionNotice = req.body.emailPositionNotice;
    const smsEventNotice = req.body.smsEventNotice;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));


    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    
    if (emailEventNotice==null && emailPositionNotice==null && smsEventNotice==null ) return res.send(errResponse(baseResponse.USER_INFO_EMPTY));

    const editNotice = await userService.editNotice(userId, emailEventNotice, emailPositionNotice, smsEventNotice);
    return res.send(editNotice);
    
};

/**
 * API No. 20
 */
 exports.postTagNotice = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const tagId = req.body.tagId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));


    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    if(!tagId || tagId.length == 0)
    return res.send(errResponse(baseResponse.TAG_TAGID_EMPTY));
    
    if (!Array.isArray(tagId))
    return res.send(errResponse(baseResponse.TAG_TAGID_ERROR_TYPE));

        
    const tagNotice = await userService.addTagNotice(userId, tagId);
    const tagNoticeResult = await userProvider.tagNoticeCheck(userId);
    return res.send(response(baseResponse.SUCCESS, tagNoticeResult[0]));
    
};

/**
 * API No. 14
 */
 exports.postPoints = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const point = req.body.point;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));


    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    if(point <= 0)
        return res.send(errResponse(baseResponse.POINT_POINT_ZERO));

    if(!point)
        return res.send(errResponse(baseResponse.POINT_POINT_EMPTY));

    

        
    const userPointExpired = await userService.checkExpiredPoints(userId);
    const userPointInfo = await userService.addPoints(userId, point);
    return res.send(userPointInfo);
    
};



/**
 * API No. 22
 */
 exports.getPoints = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));


    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const userPointExpired = await userService.checkExpiredPoints(userId);
    const userPointInfo = await userProvider.retrievePoints(userId)
    return res.send(response(baseResponse.SUCCESS,userPointInfo[0][0]));
    
};


/**
 * API No. 24
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    console.log("userIdFromJWT", userIdFromJWT)


    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    // 계정 상태 확인
    const userStatusRows = await userProvider.userCheck(userId);
    // 휴면계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    
    //삭제 계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 2)
    return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
    const userByUserId = await userProvider.retrieveUser(userId);
    const bookmarkByUserId = await userProvider.retrieveUserBookmark(userId);
    const likeByUserId = await userProvider.retrieveUserLike(userId);
    const followByUserId = await userProvider.retrieveUserFollow(userId);
    const pointsExpired = await userService.checkExpiredPoints(userId);

    if (!userByUserId) return res.send(errResponse(baseResponse.USER_NOT_EXIST));


    return res.send(response(baseResponse.SUCCESS, Object.assign(userByUserId, 
        {"bookmarkPositionId": bookmarkByUserId,"likePositionId": likeByUserId, "followCompanyId": followByUserId })));
};

/**
 * API No. 26
 */
exports.getResumeByUserId = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    // 계정 상태 확인
    const userStatusRows = await userProvider.userCheck(userId);
    // 휴면계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    //삭제 계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 2)
    return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));


    const resumeByUserId = await userProvider.retrieveResumeList(userId);

    return res.send(response(baseResponse.SUCCESS, resumeByUserId[0]));
};





/**
 * API No. 15
 */
 exports.getResumeDetail = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    let resumeId = req.params.resumeId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    // 계정 상태 확인
    const userStatusRows = await userProvider.userCheck(userId);
    // 휴면계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    //삭제 계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 2)
    return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));

    let resumeByUserId = null;

    if (resumeId){

    // 이력서 상태 확인
    const resumeStatusRows = await userProvider.resumeCheck(resumeId);

    if (resumeStatusRows[0].length == 0 || resumeStatusRows[0]["status"] == 1)
    return res.send(errResponse(baseResponse.RESUME_APPLICATION_NOT_EXIST));

    resumeByUserId = await userProvider.retrieveResumeDetailById(resumeId);

    }else{
        resumeByUserId = await userProvider.retrieveResumeDetail(userId);
    if (resumeByUserId[0].length == 0) 
    return res.send(errResponse(baseResponse.RESUME_APPLICATION_NOT_EXIST));
        resumeId = resumeByUserId[0][0]["resumeId"];
    }


    const resumeEducation = await userProvider.retrieveResumeEducation(resumeId);
    const resumeCareer = await userProvider.retrieveResumeCareer(resumeId);
    const resumeResult = await userProvider.retrieveResumeResult(resumeId);
    const resumeSkill = await userProvider.retrieveResumeSkill(resumeId);
    const resumePrize = await userProvider.retrieveResumePrize(resumeId);
    const resumeLanguage = await userProvider.retrieveResumeLanguage(resumeId);
    const resumeLink = await userProvider.retrieveResumeLink(resumeId);



    return res.send(response(baseResponse.SUCCESS, Object.assign(resumeByUserId[0][0], {"education": resumeEducation[0],"careerArr":resumeCareer[0] ,
    "resultArr":resumeResult[0] , "skillArr":resumeSkill[0] ,"prizeArr":resumePrize[0] ,"languageArr":resumeLanguage[0] ,"linkArr":resumeLink[0] } )));
};

/**
 * API No. 16
 */
 exports.postResume = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const isFile = req.body.isFile;
    const fileName = req.body.fileName;
    const fileLink = req.body.fileLink;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    let addResumeResult = null;
    if(isFile){
            if (!fileName) return res.send(errResponse(baseResponse.FILE_FILENAME_EMPTY));
            if (!fileLink) return res.send(errResponse(baseResponse.FILE_FILE_EMPTY));
        addResumeResult = await userService.addResumeFile(userId, fileName, fileLink);

    } else{
    addResumeResult = await userService.addResume(userId);
    }
 
    return res.send(addResumeResult);
};

/**
 * API No. 23
 */
 exports.patchResume = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    // 계정 상태 확인
    const userStatusRows = await userProvider.userCheck(userId);
    // 휴면계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    //삭제 계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 2)
    return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));


    const addResumeResult = await userService.addResume(userId);
    const resumeResult = await userProvider.getLatestResume(userId);

    return res.send(response(baseResponse.SUCCESS, resumeResult));
};


/**
 * API No. 29
 */
 exports.getUserRecommender = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    // 계정 상태 확인
    const userStatusRows = await userProvider.userCheck(userId);
    // 휴면계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    //삭제 계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 2)
    return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));

    const userRecommenderByUserId = await userProvider.retrieveUserRecommender(userId);

    return res.send(response(baseResponse.SUCCESS, userRecommenderByUserId));

};

/**
 * API No. 50
 */
 exports.getExceptCompany = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    // 계정 상태 확인
    const userStatusRows = await userProvider.userCheck(userId);
    // 휴면계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    //삭제 계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 2)
    return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));

    const excptedCompanyByUserId = await userProvider.retrieveExceptCompany(userId);

    return res.send(response(baseResponse.SUCCESS, excptedCompanyByUserId));

};

/**
 * API No. 39
 */
 exports.getUsersExpert = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    // 계정 상태 확인
    const userStatusRows = await userProvider.userCheck(userId);
    // 휴면계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    //삭제 계정
    if (userStatusRows[0].length==0 || userStatusRows[0]["status"] == 2)
    return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));

    const expertCareerByUserId = await userProvider.retrieveUserExpertCareer(userId);
    const expertJobByUserId = await userProvider.retrieveUserExpertJob(userId);
    if (expertCareerByUserId[0].length == 0)
        return res.send(response(baseResponse.SUCCESS));
    return res.send(response(baseResponse.SUCCESS, Object.assign(expertCareerByUserId[0], {"jobArr": expertJobByUserId})));

};




/**
 * API No. 6
 */
 exports.postApplication = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const positionId = req.params.positionId;
    const resumeId = req.body.resumeId;
    const userId = req.body.userId;
    let recommenderId = req.body.recommenderId;


    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if (!positionId) return res.send(errResponse(baseResponse.POSITION_POSITION_ID_EMPTY));
    if (!resumeId) return res.send(errResponse(baseResponse.RESUME_RESUME_ID_EMPTY));
    if (userId == recommenderId) return res.send(errResponse(baseResponse.RECOMMENDER_SAME_USER));
    

    const addApplicationResult = await userService.addApplication(userId, positionId, resumeId, recommenderId);

    return res.send( addApplicationResult);
};

/**
 * API No. 13
 */
exports.addFollowCompany = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;

    const companyId = req.body.companyId;
    const userId = req.body.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!companyId) return res.send(errResponse(baseResponse.COMPANY_COMPANYID_EMPTY));


    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH))


    const addFollowResponse = await userService.addFollow(userIdFromJWT, companyId);

    return res.send(addFollowResponse);

};

/**
 * API No. 18
 */
 exports.postParticipateEvent = async function (req, res) {



    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const eventId = req.params.eventId;

    const email = req.body.email;
    const name = req.body.name;
    let companyId = req.body.companyId;
    const jobGroupId = req.body.jobGroupId;
    const jobId = req.body.jobGroupId;
    const career = req.body.career;
    const universityId = req.body.universityId;
    const admission = req.body.admission;
    const graduation = req.body.graduation;
    const isAttending = req.body.isAttending;


    if (userId==null) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (eventId==null) return res.send(errResponse(baseResponse.EVENT_EVENTID_EMPTY));
    if (email==null) return res.send(errResponse(baseResponse.EVENT_PARTICIPATE_INFO_EMPTY));
    if (name==null) return res.send(errResponse(baseResponse.EVENT_PARTICIPATE_INFO_EMPTY));
    if (jobGroupId==null) return res.send(errResponse(baseResponse.EVENT_PARTICIPATE_INFO_EMPTY));
    if (jobId==null) return res.send(errResponse(baseResponse.EVENT_PARTICIPATE_INFO_EMPTY));
    if (career==null) return res.send(errResponse(baseResponse.EVENT_PARTICIPATE_INFO_EMPTY));
    if (universityId==null) return res.send(errResponse(baseResponse.EVENT_PARTICIPATE_INFO_EMPTY));
    if (admission==null) return res.send(errResponse(baseResponse.EVENT_PARTICIPATE_INFO_EMPTY));
    if (graduation==null) return res.send(errResponse(baseResponse.EVENT_PARTICIPATE_INFO_EMPTY));
    if (isAttending==null) return res.send(errResponse(baseResponse.EVENT_PARTICIPATE_INFO_EMPTY));
    if(!companyId) companyId = null;


    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH))


    const addEventResponse = await userService.addParticipateEvent(userId, eventId,email, name, companyId, jobGroupId, jobId, career, universityId, admission, graduation, isAttending );

    return res.send(addEventResponse);

};

/**
 * API No.11
 */
 exports.addBookmarkPosition = async function (req, res) {



    const userIdFromJWT = req.verifiedToken.userId;

    const positionId = req.body.positionId;
    const userId = req.body.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!positionId) return res.send(errResponse(baseResponse.POSITION_POSITION_ID_EMPTY));


    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH))


    const addBookmarkResponse = await userService.addBookmark(userIdFromJWT, positionId);

    return res.send(addBookmarkResponse);

};

/**
 * API No. 12
 */
 exports.addLikePosition = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;

    const positionId = req.body.positionId;
    const userId = req.body.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!positionId) return res.send(errResponse(baseResponse.POSITION_POSITION_ID_EMPTY));


    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH))


    const addLikeResponse = await userService.addLike(userIdFromJWT, positionId);

    return res.send(addLikeResponse);

};


/**
 * API No. 8
 */
 exports.getBookmarkPosition = async function (req, res) {

    /**
     * Body: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    // 계정 상태 확인
    const userStatusRows = await userProvider.userCheck(userId);
    // 휴면계정
    if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    
    //삭제 계정
    if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 2)
    return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));

    const positionByUserId = await userProvider.retrieveBookmarkPosition(userId);


    return res.send(response(baseResponse.SUCCESS, positionByUserId));
};

/**
 * API No. 9
 */
 exports.getLikePosition = async function (req, res) {

    /**
     * Body: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    // 계정 상태 확인
    const userStatusRows = await userProvider.userCheck(userId);
    // 휴면계정
    if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 1)
        return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
    
    //삭제 계정
    if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 2)
    return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));

    const positionByUserId = await userProvider.retrieveLikePosition(userId);


    return res.send(response(baseResponse.SUCCESS, positionByUserId));
};



/**
 * API No. 7
 */
 exports.getApplication = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;


    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const getWritingApplicationResult = await userProvider.retrieveWritingApplication(userId);
    const getApplicationResult = await userProvider.retrieveApplication(userId);
    const getApplicationNoResult = await userProvider.retrieveApplicationNo(userId);
    

    return res.send(response(baseResponse.SUCCESS, Object.assign(getApplicationNoResult[0][0],{"appliedPosition":getApplicationResult[0], "writingPosition": getWritingApplicationResult[0]})));
};

/**
 * API No. 27
 */
 exports.getMatchingStatus = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;


    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    const getMatchingResult = await userProvider.retrieveMatching(userId);
    const getMatchingNoResult = await userProvider.retrieveMatchingNo(userId);
    

    return res.send(response(baseResponse.SUCCESS, Object.assign(getMatchingNoResult[0][0],{"company":getMatchingResult[0]})));
};



/**
 * API No. 23
 */
 exports.postInterestTags = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId;

    const userId = req.params.userId;
    const tagId = req.body.tagId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));


    if (userIdFromJWT != userId) 
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));

    if(!tagId || tagId.length == 0)
        return res.send(errResponse(baseResponse.SUCCESS));
    
    if (!Array.isArray(tagId))
    return res.send(errResponse(baseResponse.TAG_TAGID_ERROR_TYPE));


        
    const userTag = await userService.addInterestTags(userId, tagId);
    return res.send(userTag);
    
};



/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};


/** 
 * API No. 3
 */
 exports.authController = async function (req, res) {
    try {
        const phoneNo = req.body.phoneNo;
        if(!phoneNo) return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
        // 코드 생성
        const randomCode = Math.floor(1000 + Math.random() * 9000);

      
        Cache.set(phoneNo, randomCode.toString());

        console.log(11)
        
        // 문자 발송 
        
        //signature 생성
        const space = " ";				// one space
        const newLine = "\n";				// new line
        const postmethod = "POST";				// method
        const url = "/sms/v2/services/ncp:sms:kr:297477775858:wanted/messages";	// url (include query string)
        var date = Date.now().toString();			// current timestamp (epoch)
        const accessKey = "lf6T09M0mtXiOk25KFeE";			// access key id (from portal or Sub Account)
        const secretKey = "y7U9hUWpoEKOUjKhYX3mOViEIm7SSWX1aUqNG4hm";			// secret key (from portal or Sub Account)

        var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
        hmac.update(postmethod);
        hmac.update(space);
        hmac.update(url);
        hmac.update(newLine);
        hmac.update(date);
        hmac.update(newLine);
        hmac.update(accessKey);

        var hash = hmac.finalize();

        const signature = hash.toString(CryptoJS.enc.Base64);

        // 문자열 배열 || 문자열 에 대한 예외처리
        

        const body = JSON.stringify({
            type: "SMS",
            from: "01048503881",
            subject:"wanted 인증번호",
            content:"인증번호는",
            messages:[
                {
                    to:phoneNo,
                    subject:"wanted 인증번호",
                    content:"wanted 인증번호는 " + randomCode + " 입니다."
                }
            ]
        });



        const naverResponse = await fetch(
            "https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:297477775858:wanted/messages",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "x-ncp-apigw-timestamp": date,
                "x-ncp-iam-access-key": accessKey,
                "x-ncp-apigw-signature-v2": signature,
            },
            body: body,
            }
        );
        console.log(naverResponse)

        const result = JSON.stringify(response);
        console.log(naverResponse.status)

        if (naverResponse.status == 202) {
            logger.info("문자 전송 성공");
            return res.send(response(baseResponse.SUCCESS));
        } else {
            logger.error("문자 전송 실패");
            return res.send(response(baseResponse.SMS_SEND_MESSAGE_FAILURE));
        }
        
      } catch (err) {
        logger.error(`sms send error\n: ${err.message} \n${JSON.stringify(err)}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
      }
    };
    /**
     * API No. 31
     */
    exports.codeValidationController= async function (req, res) {
      const { phoneNo, randomCode } = req.body;
      if(!phoneNo) return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
      if(!randomCode) return res.send(errResponse(baseResponse.SIGNUP_CODE_EMPTY));


      const result =  Cache.get(phoneNo);
        if (randomCode.toString() == result) {
            Cache.del(phoneNo);
            return res.send(response(baseResponse.SUCCESS));
        } else {
            return res.send(errResponse(baseResponse.SMS_VALIDATION_FAILURE));
        }
    };

    /**
     * API No. 19
     */
    exports.postKakaopay= async function (req, res) {
        try{
            const userIdFromJWT = req.verifiedToken.userId;

        const {  userId, eventId } = req.body;


        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        // 휴면계정
        if (userStatusRows[0]["status"] == 1)
            return res.send(errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT));
        
        //삭제 계정
        if (userStatusRows[0]["status"] == 2)
        return res.send(errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));

        const eventResult = await userProvider.eventCheck(eventId);
        if (eventResult[0].length == 0 ||eventResult[0]["status"] == 1)
        return res.send(errResponse(baseResponse.EVENT_INACTIVE_EVENT));
        const eventLengthResult = await userProvider.eventLengthCheck(eventId);


        const eventParticipateRows = await userProvider.eventPaticipateCheck(userId, eventId);
        console.log(eventParticipateRows[0].length)

        if (eventParticipateRows[0][0].length > 0 && eventParticipateRows[0][0]["status"] == 0){
            return res.send(errResponse(baseResponse.EVENT_ALREADY_PARTICIPATE));
            }


        partnerOrderId = eventLengthResult[0][0]['count(*)'];
        partnerUserId = eventId;
        eventName = eventResult[0][0]["eventTitle"];
        totalAmount = eventResult[0][0]["fee"];
        if (!totalAmount)
        return res.send(errResponse(baseResponse.EVENT_FEE_NOT_EXIST));


        console.log(partnerOrderId,eventName,totalAmount)

        const header = {
            'Authorization': 'KakaoAK d131e8ffd7e7c3636e7a83882cef5bf2',
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        };

        const params = {
            "cid": "TC0ONETIME", 
                "partner_order_id":partnerOrderId, 
                "partner_user_id":partnerUserId, 
                "item_name": eventName, 
                "total_amount":totalAmount,
                "quantity":1,
                "tax_free_amount":0, 
                        "approval_url":"https://prod.minjuling.shop/payment/kakaopay/done", 
                        "cancel_url":"https://prod.minjuling.shop/payment/kakaopay/cancel",
                        "fail_url": "https://prod.minjuling.shop/payment/kakaopay/fail"
            
            };

            var formBody = [];
            for (var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

        const kakaopayResponse = await fetch(
            "https://kapi.kakao.com/v1/payment/ready",
            {
            method: "POST",
            headers: header,
            body: formBody
            }
        )
        const data = await kakaopayResponse.json();

            console.log("kakaopayResponse.body",  data)
        if (kakaopayResponse.status == 200) {
            logger.info("카카오페이 성공");
            return res.send(response(baseResponse.SUCCESS, data));
        } else {
            logger.error("카카오페이 실패");
            return res.send(response(baseResponse.KAKAOPAY_FAILURE));
        }
        
      } catch (err) {
        logger.error(`kakaopay error\n: ${err.message} \n${JSON.stringify(err)}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
      }
  
        
      };

      /**
     * API No. 17
     */
      exports.postKakaopayApprove= async function (req, res) {
        try{

        const tid = req.body.tid;
        const pgToken = req.body.pgToken;
        const eventId  = req.body.eventId;


        const eventResult = await userProvider.eventCheck(eventId);
        if (eventResult[0].length == 0 ||eventResult[0]["status"] == 1)
        return errResponse(baseResponse.EVENT_INACTIVE_EVENT);
        
        const eventLengthResult = await userProvider.eventLengthCheck(eventId);


        
        partnerOrderId = eventLengthResult[0].length;
        partnerUserId = eventId;
        
        
        // if(!phoneNo) return res.send(errResponse(baseResponse.SIGNUP_PHONENUMBER_EMPTY));
        // if(!randomCode) return res.send(errResponse(baseResponse.SIGNUP_CODE_EMPTY));

        const header = {
            'Authorization': 'KakaoAK d131e8ffd7e7c3636e7a83882cef5bf2',
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        };

        const params = {
            "cid": "TC0ONETIME", 
            "tid": tid, 
                "partner_order_id":partnerOrderId, 
                "partner_user_id":partnerUserId, 
                "pg_token": pgToken
            
            };

            var formBody = [];
            for (var property in params) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(params[property]);
            formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

        const kakaopayResponse = await fetch(
            "https://kapi.kakao.com/v1/payment/approve",
            {
            method: "POST",
            headers: header,
            body: formBody
            }
        )
        const data = await kakaopayResponse.json();

            console.log("kakaopayResponse.body",  data)
        if (kakaopayResponse.status == 200) {
            logger.info("카카오페이 결제 성공");
            return res.send(response(baseResponse.SUCCESS, data));
        } else {
            logger.error("카카오페이 승인 실패");
            console.log("data.code ", data.code )
            if (data.code == "-702")
            return res.send(response(baseResponse.KAKAOPAY_ALREADY_PAYMENT));
            
            return res.send(response(baseResponse.KAKAOPAY_FAILURE));
        }
        
      } catch (err) {
        logger.error(`kakaopay approve error\n: ${err.message} \n${JSON.stringify(err)}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
      }
  
        
      };
  
    
