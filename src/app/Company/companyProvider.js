const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const companyDao = require("./companyDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveCompanyList = async function () {

    const connection = await pool.getConnection(async (conn) => conn);
    const companyListResult = await companyDao.selectCompany(connection);
    connection.release();

    return companyListResult;
  }

  exports.retrieveCompanyListByGroup = async function (jobGroupId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const companyListResult = await companyDao.selectCompanyByGroup(connection, jobGroupId);
    connection.release();

    return companyListResult;
  }

  exports.retrieveCompanyListByJob = async function ( jobId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const companyListResult = await companyDao.selectCompanyByJob(connection, jobId);
    connection.release();

    return companyListResult;
  }

  exports.retrieveCompanyListByTag = async function (tagId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const companyListResult = await companyDao.selectCompanyByTag(connection, tagId);
    connection.release();

    return companyListResult;
  }

  exports.retrieveCompanyListByJobTag = async function (jobId, tagId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const companyListResult = await companyDao.selectCompanyByJobTag(connection, jobId, tagId);
    connection.release();

    return companyListResult;
  }

  exports.retrieveCompanyListByGroupTag = async function (jobGroupId,  tagId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const companyListResult = await companyDao.selectCompanyByGroupTag(connection, jobGroupId, tagId);
    connection.release();

    return companyListResult;
  }

  exports.retrieveCompanyListByGroupJob = async function (jobGroupId, jobId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const companyListResult = await companyDao.selectCompanyByGroupJob(connection, jobGroupId, jobId);
    connection.release();

    return companyListResult;
  }

  exports.retrieveCompanyListByAll = async function (jobGroupId, jobId, tagId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const companyListResult = await companyDao.selectCompanyByAll(connection, jobGroupId, jobId,tagId );
    connection.release();

    return companyListResult;
  }


exports.retrieveCompany = async function (companyId) {

    const connection = await pool.getConnection(async (conn) => conn);
    const companyInfoResult = await companyDao.selectCompanyById(connection, companyId);
    connection.release();

    return companyInfoResult;
};

exports.retrieveTag = async function (companyId) {

  const connection = await pool.getConnection(async (conn) => conn);
  const companyInfoResult = await companyDao.selectCompanyTagByCompanyId(connection, companyId);
  connection.release();

  return companyInfoResult;
};

exports.retrieveImgUrl = async function (companyId) {

  const connection = await pool.getConnection(async (conn) => conn);
  const companyInfoResult = await companyDao.selectImgUrlByCompanyId(connection, companyId);
  connection.release();

  return companyInfoResult;
};


exports.retrieveNews = async function (companyId) {

  const connection = await pool.getConnection(async (conn) => conn);
  const companyInfoResult = await companyDao.selectNewsByCompanyId(connection, companyId);
  connection.release();

  return companyInfoResult;
};


exports.retrievePosition = async function (companyId) {

  const connection = await pool.getConnection(async (conn) => conn);
  const companyInfoResult = await companyDao.selectPositionByCompanyId(connection, companyId);
  connection.release();

  return companyInfoResult;
};


exports.retrieveEmployee = async function (companyId) {

  const connection = await pool.getConnection(async (conn) => conn);
  const companyInfoResult = await companyDao.selectEmployeeByCompanyId(connection, companyId);
  connection.release();

  return companyInfoResult;
};


exports.jobGroupCheck = async function (jobGroupId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const jobGroupCheckResult = await companyDao.selectJobGroup(connection, jobGroupId);
  connection.release();

  return jobGroupCheckResult;
};

exports.jobCheck = async function (jobId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const jobCheckResult = await companyDao.selectJob(connection, jobId);
  connection.release();
  return jobCheckResult;
};

exports.tagCheck = async function (tagId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const tagCheckResult = await companyDao.selectTag(connection, tagId);
  connection.release();

  return tagCheckResult;
};

exports.followCheck = async function (userId, companyId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const followCheckResult = await companyDao.selectFollow(connection, userId, companyId);
  connection.release();

  return followCheckResult;
};

exports.userCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userCheckResult = await companyDao.selectUserStatus(connection, userId);
  connection.release();

  return userCheckResult;
};

exports.companyCheck = async function (companyId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const companyCheckResult = await companyDao.selectCompanyStatus(connection, companyId);
  connection.release();

  return companyCheckResult;
};
