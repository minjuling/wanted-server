const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);
  connection.release();

  return userResult[0];
};

exports.retrieveUserResumeNo = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserResumeListNo(connection, userId);
  connection.release();

  return userResult[0];
};



exports.retrieveUserRecommender = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserRecommender(connection, userId);
  connection.release();

  return userResult;
};



exports.retrieveUserExpertCareer = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserExpertCareer(connection, userId);
  connection.release();

  return userResult;
};

exports.retrieveUserExpertJob = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserExpertJob(connection, userId);
  connection.release();

  return userResult;
};

exports.retrieveExceptCompany = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectExceptedCompany(connection, userId);
  connection.release();

  return userResult;
};


exports.retrieveBookmarkPosition = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const positionResult = await userDao.selectBookmarkPosition(connection, userId);
  connection.release();

  return positionResult[0];
};

exports.retrieveLikePosition = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const positionResult = await userDao.selectLikePosition(connection, userId);
  connection.release();

  return positionResult[0];
};


exports.retrieveUserBookmark = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserBookmarkId(connection, userId);
  connection.release();

  return userResult[0];
};

exports.retrieveUserLike = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserLikeId(connection, userId);
  connection.release();

  return userResult[0];
};

exports.retrieveUserFollow = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserFollowId(connection, userId);
  connection.release();

  return userResult[0];
};

exports.retrieveResumeList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectResumeList(connection, userId);
  connection.release();

  return resumeResult;
};
exports.retrieveLastResumeId = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectLastResumeId(connection, userId);
  connection.release();

  return resumeResult;
};


exports.retrieveResumeDetail = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectResumeDetail(connection, userId);
  connection.release();

  return resumeResult;
};

exports.retrieveResumeDetailById = async function (resumeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectResumeDetailById(connection, resumeId);
  connection.release();

  return resumeResult;
};


exports.retrieveResumeEducation = async function (resumeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectResumeEducation(connection, resumeId);
  connection.release();

  return resumeResult;
};

exports.retrieveResumeCareer = async function (resumeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectResumeCareer(connection, resumeId);
  connection.release();

  return resumeResult;
};

exports.retrieveResumeResult = async function (resumeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectResumeResult(connection, resumeId);
  connection.release();

  return resumeResult;
};

exports.retrieveResumeSkill = async function (resumeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectResumeSkill(connection, resumeId);
  connection.release();

  return resumeResult;
};

exports.retrieveResumePrize = async function (resumeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectResumePrize(connection, resumeId);
  connection.release();

  return resumeResult;
};

exports.retrieveResumeLanguage = async function (resumeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectResumeLanguage(connection, resumeId);
  connection.release();

  return resumeResult;
};

exports.retrieveResumeLink = async function (resumeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeResult = await userDao.selectResumeLink(connection, resumeId);
  connection.release();

  return resumeResult;
};

exports.retrieveWritingApplication = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const applicationResult = await userDao.selectWritingApplication(connection, userId);
  connection.release();

  return applicationResult;
};

exports.retrieveApplication = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const applicationResult = await userDao.selectApplication(connection, userId);
  connection.release();

  return applicationResult;
};

exports.retrieveApplicationNo = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const applicationNoResult = await userDao.selectApplicationNo(connection, userId);
  connection.release();

  return applicationNoResult;
};

exports.retrieveMatching = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const matchingResult = await userDao.selectMatching(connection, userId);
  connection.release();

  return matchingResult;
};

exports.retrieveMatchingNo = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const matchingResult = await userDao.selectMatchingNo(connection, userId);
  connection.release();

  return matchingResult;
};

exports.retrievePoints = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userPointsResult = await userDao.selectUserPoints(connection, userId);
  connection.release();

  return userPointsResult;
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.phoneNoCheck = async function (phoneNo) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserPhoneNo(connection, phoneNo);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      userId
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

exports.followCheck = async function (userId, companyId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const followCheckResult = await userDao.selectFollow(connection, userId, companyId);
  connection.release();

  return followCheckResult;
};

exports.bookmarkCheck = async function (userId, positionId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const bookmarkCheckResult = await userDao.selectBookmark(connection, userId, positionId);
  connection.release();

  return bookmarkCheckResult;
};

exports.likeCheck = async function (userId, positionId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const likeCheckResult = await userDao.selectLike(connection, userId, positionId);
  connection.release();

  return likeCheckResult;
};



exports.userCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userCheckResult = await userDao.selectUserStatus(connection, userId);
  connection.release();

  return userCheckResult;
};

exports.positionCheck = async function (positionId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const companyCheckResult = await userDao.selectPositionStatus(connection, positionId);
  connection.release();

  return companyCheckResult;
};


exports.resumeCheck = async function (resumeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeCheckResult = await userDao.selectResumeStatus(connection, resumeId);
  connection.release();

  return resumeCheckResult;
};

exports.resumeCheckByUserId = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const resumeCheckResult = await userDao.selectResumeByUserId(connection, userId);
  connection.release();

  return resumeCheckResult;
};

exports.recommenderCheck = async function (recommenderId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const companyCheckResult = await userDao.selectRecommenderStatus(connection, recommenderId);
  connection.release();

  return companyCheckResult;
};

exports.companyCheck = async function (companyId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const companyCheckResult = await userDao.selectCompanyStatus(connection, companyId);
  connection.release();

  return companyCheckResult;
};

exports.applicationCheck = async function (userId, positionId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const applicationCheckResult = await userDao.selectApplicationByPositionId(connection, userId, positionId);
  connection.release();

  return applicationCheckResult;
};



exports.interestTagCheckById = async function (userId, tagId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const applicationCheckResult = await userDao.selectUserInterestTagById(connection, userId, tagId);
  connection.release();

  return applicationCheckResult;
};
exports.tagNoticeCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const tagNoticeCheckResult = await userDao.selectTagNotice(connection, userId);
  connection.release();

  return tagNoticeCheckResult;
};

exports.tagNoticeCheckById = async function (userId, tagId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const tagNoticeCheckResult = await userDao.selectTagNoticeById(connection, userId, tagId);
  connection.release();

  return tagNoticeCheckResult;
};

exports.eventTagCheck = async function (tagId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const applicationCheckResult = await userDao.selectEventTag(connection, tagId);
  connection.release();

  return applicationCheckResult;
};


exports.noticeCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const noticeCheckResult = await userDao.selectUserNotice(connection, userId);
  connection.release();

  return noticeCheckResult;
};

exports.eventCheck = async function (eventId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkResult = await userDao.selectEvent(connection, eventId);
  connection.release();

  return checkResult;
};

exports.eventLengthCheck = async function (eventId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkResult = await userDao.selectEventLength(connection, eventId);
  connection.release();

  return checkResult;
};



exports.jobGroupCheck = async function (jobGroupId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkResult = await userDao.selectJobGroup(connection, jobGroupId);
  connection.release();

  return checkResult;
};

exports.jobCheck = async function (jobId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkResult = await userDao.selectJob(connection, jobId);
  connection.release();

  return checkResult;
};

exports.schoolCheck = async function (schoolId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkResult = await userDao.selectSchool(connection, schoolId);
  connection.release();

  return checkResult;
};

exports.eventPaticipateCheck = async function (userId, eventId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkResult = await userDao.selectEventParticipation(connection, userId, eventId);
  connection.release();
  return checkResult;
};





