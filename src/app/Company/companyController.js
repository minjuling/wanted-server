const jwtMiddleware = require("../../../config/jwtMiddleware");
const companyProvider = require("../Company/companyProvider");
const companyService = require("../Company/companyService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");



/**
 * API No. 4
 * API Name : 회사 리스트 가져오기
 * [GET] /companies
 */
 exports.getCompanies = async function (req, res) {

    /**
     * Path Variable: jobGroupId
     * Query String: jobId, tagId
     */
    let jobGroupId = req.params.jobGroupId;
    let jobId = req.query.jobId;
    let tagId = req.query.tagId;

    let jobIdArr = new Array();
    let tagIdArr = new Array();


    if (jobId && jobId.length > 5)
    return res.send(baseResponse.COMPANY_JOB_ID_NUMBER);

    if (tagId && tagId.length > 3)
    return res.send(baseResponse.COMPANY_TAG_ID_NUMBER);

    if (jobGroupId){
        const jobGroupResponse = await companyProvider.jobGroupCheck(
            jobGroupId
        );
        // jobGroupId 있는지 체크
        if (jobGroupResponse.length == 0)
            return res.send(baseResponse.COMPANY_JOB_GROUP_NOT_EXIST);
        
    } 
    

    // jobId 있는지 체크
    if (jobId){
        //쿼리문에 넣을 배열 길이 맞추기
        if (typeof jobId == "string"){
            jobIdArr = [jobId, null, null,null,null]
        }
        else{
        for(i = 0; i<jobId.length; i++){
            jobIdArr.push(jobId[i])
        }
        if (jobIdArr.length<5){
        for(i = jobIdArr.length; jobIdArr.length<5; i++){
            jobIdArr.push(null);
        }
    }
        }
        const jobResponse = await companyProvider.jobCheck(
            jobIdArr
            );
        if (jobResponse.length == 0)
            return res.send(baseResponse.COMPANY_JOB_NOT_EXIST);
        
        //jobGroupId랑 쿼리 결과랑 다르거나, 쿼리 결과가 2개 이상일 경우(2개 이상의 job group이 나온 경우
        if ((jobGroupId && (jobResponse[0]["jobGroupId"] != jobGroupId)) || jobResponse.length > 2) 
            return res.send(baseResponse.COMPANY_JOB_AND_GROUP_NOT_MATCH );

            
    }
    

    // tagId 있는지 체크
    if (tagId){
        //쿼리문에 넣을 배열 길이 맞추기
        
        if (typeof tagId == "string"){
            tagIdArr = [tagId, null, null]
        }
        else{
        for(i = 0; i<tagId.length; i++){
            tagIdArr.push(tagId[i])
        }
        if (tagIdArr.length<3){
        for(i = tagIdArr.length; tagIdArr.length<3; i++){
            tagIdArr.push(null);
        }
    }
        }
        const tagResponse = await companyProvider.tagCheck(
            tagIdArr
            );
            if (tagResponse.length == 0)
                return res.send(baseResponse.COMPANY_TAG_NOT_EXIST);
        
        
    }
    

    // 그냥 다 분기처리 하기.. 이게 제일 에러가 안나고 깔끔하겟다..
    if (!jobGroupId && !jobId && !tagId){
        const companyListResponse = await companyProvider.retrieveCompanyList();
        return res.send(response(baseResponse.SUCCESS, companyListResponse));
    }

    if (jobGroupId && !jobId && !tagId){
        const companyListResponse = await companyProvider.retrieveCompanyListByGroup(jobGroupId);
        return res.send(response(baseResponse.SUCCESS, companyListResponse));
    }

    if (!jobGroupId && jobId && !tagId){
        const companyListResponse = await companyProvider.retrieveCompanyListByJob(jobIdArr);
        return res.send(response(baseResponse.SUCCESS, companyListResponse));
    }

    if (!jobGroupId && !jobId && tagId){
        const companyListResponse = await companyProvider.retrieveCompanyListByTag(tagIdArr);
        return res.send(response(baseResponse.SUCCESS, companyListResponse));
    }

    if (!jobGroupId && jobId && tagId){
        const companyListResponse = await companyProvider.retrieveCompanyListByJobTag(jobIdArr, tagIdArr);
        return res.send(response(baseResponse.SUCCESS, companyListResponse));
    }

    if (jobGroupId && !jobId && tagId){
        const companyListResponse = await companyProvider.retrieveCompanyListByGroupTag(jobGroupId, tagIdArr);
        return res.send(response(baseResponse.SUCCESS, companyListResponse));
    }

    if (jobGroupId && jobId && !tagId){
        const companyListResponse = await companyProvider.retrieveCompanyListByGroupJob(jobGroupId, jobIdArr);
        return res.send(response(baseResponse.SUCCESS, companyListResponse));
    }

    if (jobGroupId && jobId && tagId){
        const companyListResponse = await companyProvider.retrieveCompanyListByAll(jobGroupId, jobIdArr, tagIdArr);
        return res.send(response(baseResponse.SUCCESS, companyListResponse));
    }

};

/**
 * API No. 5
 * API Name : 특정 회사 조회
 * [GET] /companies/info/{companyId}
 */
 exports.getCompanyInfo = async function (req, res) {

    /**
     * Path Variable: companyId
     */
    const companyId = req.params.companyId;

    if (!companyId) return res.send(errResponse(baseResponse.COMPANY_COMPANYID_EMPTY));

    const companyByCompanyId = await companyProvider.retrieveCompany(companyId);
    const tags = await companyProvider.retrieveTag(companyId);
    const imgs = await companyProvider.retrieveImgUrl(companyId);
    const news = await companyProvider.retrieveNews(companyId);
    const positions = await companyProvider.retrievePosition(companyId);
    const employee = await companyProvider.retrieveEmployee(companyId);
    const companyInfo = Object.assign(companyByCompanyId[0], {"tag": tags},{"imgUrlArr":imgs}, {"companyNews":news}, {"position":positions},{"employee":employee})

    return res.send(response(baseResponse.SUCCESS, companyInfo));
};


exports.addFollowCompany = async function (req, res) {

    const userIdFromJWT = req.verifiedToken.userId;

    const companyId = req.body.companyId;
    const userId = req.body.userId;

    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));


    const addFollowResponse = await companyService.addFollow(userIdFromJWT, companyId);

    return res.send(addFollowResponse);

};

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname
     */
    const {email, password, nickname} = req.body;

    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // 기타 등등 - 추가하기


    const signUpResponse = await userService.createUser(
        email,
        password,
        nickname
    );

    return res.send(baseResponse.SUCCESS, signUpResponse);
};


/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
