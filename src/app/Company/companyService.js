const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const companyProvider = require("./companyProvider");
const companyDao = require("./companyDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리


exports.addFollow = async function (userIdFromJWT, companyId) {

    try {

        // 계정 상태 확인
        const userStatusRows = await companyProvider.userCheck(userIdFromJWT);
        // 휴면계정
        if (userStatusRows[0]["status"] == 1)
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        
        //삭제 계정
        if (userStatusRows[0]["status"] == 2)
        return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);


        // 회사 상태 확인
        const companyStatusRows = await companyProvider.companyCheck(companyId);
       
        //삭제 회사
        if (companyStatusRows[0]["status"] == 1)
        return errResponse(baseResponse.COMPANY_INACTIVE_COMPANY);



        // 팔로우 상태 확인
        const followRows = await companyProvider.followCheck(userIdFromJWT, companyId);
    const connection = await pool.getConnection(async (conn) => conn);


        console.log("followRows", followRows)
        if (followRows[0] === undefined){
        
        const follows = await companyDao.insertFollowCompany(connection, userIdFromJWT, companyId);
        connection.release();
        return response(baseResponse.SUCCESS, {"companyId":companyId, "isFollow": 1});
        }
        console.log("followRows[0].length > 0 ", followRows.length, followRows[0]["status"])
        if (followRows.length > 0 && followRows[0]["status"] == 0){
            isFollow = 1
            const subs = await companyDao.updateFollowCompany(connection, userIdFromJWT, companyId, isFollow);
            connection.release();
            return response(baseResponse.SUCCESS, {"companyId":companyId, "isFollow": isFollow});
        }
        if (followRows.length > 0 && followRows[0]["status"] == 1){
            isFollow = 0
            const follows = await companyDao.updateFollowCompany(connection, userIdFromJWT, companyId, isFollow);
            connection.release();
            return response(baseResponse.SUCCESS, {"companyId":companyId, "isFollow": isFollow});

        }

    } catch (err) {
        await connection.rollback();
        logger.error(`App - Add Follow Company error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

