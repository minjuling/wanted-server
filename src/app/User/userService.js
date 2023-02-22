const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리
exports.createUser = async function (email, password, nickname, phoneNo) {
    try {
        // 이메일 중복 확인: 이메일이 있고 상태가 활동중인 경우
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0 && emailRows[0].status == 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);
        
        // 이메일 중복 확인: 이메일이 있고 상태가 휴면계정인 경우
        if (emailRows.length > 0 && emailRows[0].status == 1)
            return errResponse(baseResponse.SIGNUP_SLEPPER_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [email, hashedPassword, nickname, phoneNo];

        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS,{"userId": userIdResult[0].insertId});
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};




exports.editUser = async function (userId, nickname, phoneNo, imgUrl) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);

        // 휴면계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        

        connection.beginTransaction();
        if (nickname){
        const editUserResult = await userDao.updateUserNickname(connection, userId, nickname)
        }
        if (phoneNo){
        const editUserResult = await userDao.updateUserPhoneNo(connection, userId, phoneNo)
        }
        if (imgUrl){
            const editUserResult = await userDao.updateUserImgUrl(connection, userId, imgUrl)
            }
        connection.commit();
        
        connection.release();

        const userInfoRows = await userProvider.userCheck(userId);


        return response(baseResponse.SUCCESS, userInfoRows[0]);

    } catch (err) {
        await connection.rollback();
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    finally {
        connection.release();
    }
};

exports.editPassword = async function (userId, oldPassword, newPassword) {
    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);

        // 휴면계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);

        const hashedOldPassword = await crypto
        .createHash("sha512")
        .update(oldPassword)
        .digest("hex");


        const passwordRows = await userProvider.passwordCheck(userId);

        if (passwordRows[0]["password"] != hashedOldPassword){
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }
        // 비밀번호 암호화
        const hashedNewPassword = await crypto
        .createHash("sha512")
        .update(newPassword)
        .digest("hex");
        
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserPassword(connection, userId, hashedNewPassword)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - Edit password Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.exitUser = async function (userId) {
    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        
        //삭제 계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserExit(connection, userId)
        connection.release();

        const userInfoRows = await userProvider.userCheck(userId);


        return response(baseResponse.SUCCESS, userInfoRows[0]);

    } catch (err) {
        logger.error(`App - exitUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.editNotice = async function (userId, emailEventNotice, emailPositionNotice, smsEventNotice) {
    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);

        // 휴면계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        
        const connection = await pool.getConnection(async (conn) => conn);
        if (emailEventNotice != null){
 
        const editUserResult = await userDao.updateEmailEventNotice(connection, userId, emailEventNotice)
        }
        if (emailPositionNotice != null){
        const editUserResult = await userDao.updateEmailPositionNotice(connection, userId, emailPositionNotice)
        }
        if (smsEventNotice != null){
        const editUserResult = await userDao.updateSmsEventNotice(connection, userId, smsEventNotice)
        }
        connection.release();

        const noticeRows = await userProvider.noticeCheck(userId);


        return response(baseResponse.SUCCESS, noticeRows[0]);

    } catch (err) {
        logger.error(`App - edit Notice Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


exports.addApplication = async function (userId, positionId, resumeId, recommenderId) {

    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);

        // 휴면계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);


        // 포지션 상태 확인
        const positionStatusRows = await userProvider.positionCheck(positionId);
       
        if (positionStatusRows[0].length == 0 || positionStatusRows["status"] == 1)
        return errResponse(baseResponse.POSITION_INACTIVE_POSITION);

        // 이력서 상태 확인
        const resumeStatusRows = await userProvider.resumeCheck(resumeId);

        if (resumeStatusRows[0].length == 0 || resumeStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.RESUME_APPLICATION_NOT_EXIST);

        // 추천인 상태 확인
        if (recommenderId){
        const recommenderStatusRows = await userProvider.recommenderCheck(recommenderId);

        if (recommenderStatusRows[0].length == 0|| recommenderStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.RECOMMENDER_INACTIVE_RECOMMENDER);
        }
        else recommenderId = null;



        // 지원 상태 확인
        const applicaionRows = await userProvider.applicationCheck(userId, positionId);
        if (applicaionRows[0].length > 0 && applicaionRows[0][0]["status"] == 0) return errResponse(baseResponse.POSITION_APPLICATION_EXIST);

        const connection = await pool.getConnection(async (conn) => conn);

        const insertApplicationResult = await userDao.insertApplication(connection, userId, positionId, resumeId, recommenderId);

        const selectApplicationsResult = await userProvider.applicationCheck(userId, positionId);
        connection.release();
        return response(baseResponse.SUCCESS,selectApplicationsResult[0]);


    } catch (err) {
        logger.error(`App - Add Application error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    
};

exports.addResume = async function (userId) {

    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        

        // 휴면계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 2)
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);

        // 이력서 상태 확인
        const resumeStatusRows = await userProvider.resumeCheckByUserId(userId);
        let resumeName = null;
        if (resumeStatusRows[0].length == 0 ){
            resumeName = userStatusRows[0][0];
        } else{
            resumeName = userStatusRows[0][0]["nickname"]+resumeStatusRows[0].length;
        }
        const connection = await pool.getConnection(async (conn) => conn);

        const insertResumeResult = await userDao.insertResume(connection, userId, resumeName);
        connection.release();

        const resumeRows = await userProvider.retrieveLastResumeId(userId);
        return response(baseResponse.SUCCESS,resumeRows[0][0]);


    } catch (err) {
        logger.error(`App - Add resume error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    
};

exports.addResumeFile = async function (userId, fileName, fileLink) {

    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        const jobGroupRows = await userProvider.retrieveUserExpertCareer(userId);
        const jobRows = await userProvider.retrieveUserExpertJob(userId);
        

        // 휴면계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0].length == 0 || userStatusRows[0]["status"] == 2)
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        const connection = await pool.getConnection(async (conn) => conn);

        const insertResumeResult = await userDao.insertResumeFile(connection, userId, fileName, fileLink);
        connection.release();

        const resumeRows = await userProvider.retrieveLastResumeId(userId);

        
        return response(baseResponse.SUCCESS,resumeRows[0][0]);


    } catch (err) {
        logger.error(`App - Add resume file error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    
};

exports.addFollow = async function (userIdFromJWT, companyId) {

    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userIdFromJWT);
        // 휴면계정
        if (userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);


        // 회사 상태 확인
        const companyStatusRows = await userProvider.companyCheck(companyId);
       
        //삭제 회사
        if (companyStatusRows[0].length == 0 ||companyStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.COMPANY_INACTIVE_COMPANY);



        // 팔로우 상태 확인
        const followRows = await userProvider.followCheck(userIdFromJWT, companyId);


        const connection = await pool.getConnection(async (conn) => conn);

        if (followRows[0] === undefined){
        
        const follows = await userDao.insertFollowCompany(connection, userIdFromJWT, companyId);
        connection.release();

        return response(baseResponse.SUCCESS, {"companyId":companyId, "isFollow": 1});
        }
        if (followRows.length > 0 && followRows[0]["isFollow"] == 0){
            isFollow = 1
            const follows = await userDao.updateFollowCompany(connection, userIdFromJWT, companyId, isFollow);
        connection.release();

            return response(baseResponse.SUCCESS, {"companyId":companyId, "isFollow": isFollow});
        }
        if (followRows.length > 0 && followRows[0]["isFollow"] == 1){
            isFollow = 0
            const connection = await pool.getConnection(async (conn) => conn);
            const follows = await userDao.updateFollowCompany(connection, userIdFromJWT, companyId, isFollow);
        connection.release();

            return response(baseResponse.SUCCESS, {"companyId":companyId, "isFollow": isFollow});

        }


    } catch (err) {
        logger.error(`App - Add Follow Company error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    
};

exports.addParticipateEvent = async function (userId, eventId,email, name, companyId, jobGroupId, jobId, career, universityId, admission, graduation, isAttending ) {

    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        // 휴면계정
        if (userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);


        // 이벤트 상태 확인
        const eventStatusRows = await userProvider.eventCheck(eventId);
       
        if (eventStatusRows[0].length == 0 ||eventStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.EVENT_INACTIVE_EVENT);

        // 회사 상태 확인
        if (companyId){
        const companyStatusRows = await userProvider.companyCheck(companyId);
       
        if (companyStatusRows[0].length == 0 ||companyStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.COMPANY_INACTIVE_COMPANY);
        }

        // 직군 상태 확인
        const jobGroupStatusRows = await userProvider.jobGroupCheck(jobGroupId);
       
        if (jobGroupStatusRows[0].length == 0 ||jobGroupStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.COMPANY_JOB_GROUP_NOT_EXIST);

        // 직무 상태 확인
        const jobStatusRows = await userProvider.jobCheck(jobId);
       
        if (jobStatusRows[0].length == 0 ||jobStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.COMPANY_JOB_NOT_EXIST);

        // 직무 상태 확인
        const schoolStatusRows = await userProvider.schoolCheck(universityId);
       
        if (schoolStatusRows[0].length == 0 ||schoolStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.SCHOOL_INACTIVE_SCHOOL);



        
        const eventParticipateRows = await userProvider.eventPaticipateCheck(userId, eventId);
        console.log(eventParticipateRows)
        console.log(eventParticipateRows[0].length )
        const connection = await pool.getConnection(async (conn) => conn);


        if (eventParticipateRows[0].length == 0){
        
        const eventParticipate = await userDao.insertEventParticipate(connection,userId, eventId,email, name, companyId, jobGroupId, jobId, career, universityId, admission, graduation, isAttending);
        }

        if (eventParticipateRows[0].length > 0 && eventParticipateRows[0][0]["status"] == 1){
    
        
            const eventParticipate = await userDao.updateEventParticipate(connection, userId, eventId,email, name, companyId, jobGroupId, jobId, career, universityId, admission, graduation, isAttending, 0);

        }
        if (eventParticipateRows[0].length > 0 && eventParticipateRows[0][0]["status"] == 0){
        return errResponse(baseResponse.EVENT_ALREADY_PARTICIPATE);
        }
        connection.release();
        return response(baseResponse.SUCCESS);



    } catch (err) {
        logger.error(`App - Add event participate error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    
};

exports.addBookmark = async function (userId, positionId) {

    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        // 휴면계정
        if (userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);


        // 포지션 상태 확인
        const positionStatusRows = await userProvider.positionCheck(positionId);
       
        if (positionStatusRows[0].length == 0 ||positionStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.POSITION_INACTIVE_POSITION);



        // 북마크 상태 확인
        const bookmarkRows = await userProvider.bookmarkCheck(userId, positionId);

        const connection = await pool.getConnection(async (conn) => conn);


        if (bookmarkRows[0] === undefined){
        
        const bookmarks = await userDao.insertBookmarkPosition(connection, userId, positionId);
        connection.release();

        return response(baseResponse.SUCCESS, {"positionId":positionId, "isBookmark": 1});
        }
        if (bookmarkRows.length > 0 && bookmarkRows[0]["isBookmark"] == 0){
            isBookmark = 1
            const connection = await pool.getConnection(async (conn) => conn);
            const bookmarks = await userDao.updateBookmarkPosition(connection, userId, positionId, isBookmark);
        connection.release();

            return response(baseResponse.SUCCESS, {"positionId":positionId, "isBookmark": isBookmark});
        }
        if (bookmarkRows.length > 0 && bookmarkRows[0]["isBookmark"] == 1){
            isBookmark = 0
            const connection = await pool.getConnection(async (conn) => conn);
            const bookmarks = await userDao.updateBookmarkPosition(connection, userId, positionId, isBookmark);
        connection.release();

            return response(baseResponse.SUCCESS, {"positionId":positionId, "isBookmark": isBookmark});

        }
        connection.release();


    } catch (err) {
        logger.error(`App - Add Bookmark Position error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.addLike = async function (userId, positionId) {

    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        // 휴면계정
        if (userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);


        // 포지션 상태 확인
        const positionStatusRows = await userProvider.positionCheck(positionId);
       
        if (positionStatusRows[0].length == 0 ||positionStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.POSITION_INACTIVE_POSITION);



        // 북마크 상태 확인
        const likeRows = await userProvider.likeCheck(userId, positionId);

        const connection = await pool.getConnection(async (conn) => conn);


        if (likeRows[0] === undefined){
        
        const likes = await userDao.insertLikePosition(connection, userId, positionId);
        connection.release();
        return response(baseResponse.SUCCESS, {"positionId":positionId, "isLike": 1});
        }
        if (likeRows.length > 0 && likeRows[0]["isLike"] == 0){
            isLike = 1
            const likes = await userDao.updateLikePosition(connection, userId, positionId, isLike);
        connection.release();

            return response(baseResponse.SUCCESS, {"positionId":positionId, "isLike": isLike});
        }
        if (likeRows.length > 0 && likeRows[0]["isLike"] == 1){
            isLike = 0
            const likes = await userDao.updateLikePosition(connection, userId, positionId, isLike);
        connection.release();

            return response(baseResponse.SUCCESS, {"positionId":positionId, "isLike": isLike});

        }



    } catch (err) {
        logger.error(`App - Add Like Position error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

exports.addInterestTags = async function (userId, tagId) {
    const connection = await pool.getConnection(async (conn) => conn);


    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        // 휴면계정
        if (userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);

        let tadIdArr = new Array();
        let tagRows = null;


        connection.beginTransaction();

        for (i = 0; i< tagId.length; i++){
        
        // 태그 상태 확인
        let tagStatusRows = await userProvider.eventTagCheck(tagId[i]);
        if (tagStatusRows[0].length == 0 ||tagStatusRows[0][0]["status"] == 1)
        return errResponse(baseResponse.TAG_INACTIVE_TAG);



        // 태그 여부 확인
        tagRows = await userProvider.interestTagCheckById(userId, tagId[i]);
        console.log(tagRows[0][0])
        
        if (tagRows[0][0] === undefined){
        let tags = await userDao.insertInterestTag(connection, userId, tagId[i]);

        tadIdArr.push({"tagId":tagId[i], "isSet": 1});

        }
        else if (tagRows[0].length > 0 && tagRows[0][0]["isSet"] == 0){
            isSet = 1
            let tags = await userDao.updateInterestTag(connection, userId, tagId[i], isSet);
            tadIdArr.push({"tagId":tagId[i], "isSet": isSet});


        }
        else if (tagRows[0].length > 0 && tagRows[0][0]["isSet"] == 1){
            
            isSet = 0
            let tags = await userDao.updateInterestTag(connection, userId, tagId[i], isSet);
            tadIdArr.push({"tagId":tagId[i], "isSet": isSet});

        }
        }
        connection.commit();
        connection.release();

    return response(baseResponse.SUCCESS, tadIdArr);


    } catch (err) {
        await connection.rollback();
        logger.error(`App - Add Interest Tag error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    finally {
        connection.release();
    }
};

exports.addTagNotice = async function (userId, tagId) {
    const connection = await pool.getConnection(async (conn) => conn);


    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        // 휴면계정
        if (userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);

        let tagRows = null;

        const setNoticeZero = await userDao.updateNoticeZero(connection, userId);

        connection.beginTransaction();


        for (i = 0; i< tagId.length; i++){
        
        // 태그 상태 확인
        let tagStatusRows = await userProvider.eventTagCheck(tagId[i]);
        if (tagStatusRows[0].length == 0 ||tagStatusRows[0][0]["status"] == 1)
        return errResponse(baseResponse.TAG_INACTIVE_TAG);



        // 태그 여부 확인
        tagRows = await userProvider.tagNoticeCheckById(userId, tagId[i]);
        if (tagRows[0][0] === undefined){
        let tags = await userDao.insertTagNotice(connection, userId, tagId[i]);


        }
        else if (tagRows[0].length > 0 && tagRows[0][0]["isSet"] == 0){
            let tags = await userDao.updateTagNotice(connection, userId, tagId[i], 1);


        }
        
        }
        connection.commit();

        connection.release();

    return response(baseResponse.SUCCESS);


    } catch (err) {
        await connection.rollback();
        logger.error(`App - Add Tag Notice error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    finally {
        connection.release();
    }
};

exports.checkExpiredPoints = async function (userId) {

    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        // 휴면계정
        if (userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);

    const connection = await pool.getConnection(async (conn) => conn);
        
        const updatePointsExpired = await userDao.updatePointsExpired(connection, userId);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - check expired points error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

exports.addPoints = async function (userId, point) {

    try {

        // 계정 상태 확인
        const userStatusRows = await userProvider.userCheck(userId);
        // 휴면계정
        if (userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);

        const connection = await pool.getConnection(async (conn) => conn);
        
        const insertUser_points = await userDao.insertPoints(connection, userId, point);
        connection.release();
        return response(baseResponse.SUCCESS, {"point": point});

    } catch (err) {
        logger.error(`App - Add points error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    
};


