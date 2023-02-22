const e = require("express");

// 직군 조회
async function selectJobGroup(connection, jobGroupId) {
  const selectJobGroupListQuery = `
                SELECT jobGroupName 
                FROM job_group
                WHERE jobGroupId = ? and status = 0;
                `;
  const [jobGroupRows] = await connection.query(selectJobGroupListQuery, jobGroupId);
  return jobGroupRows;
}

// 직무 조회
async function selectJob(connection, jobId) {
  const selectJobListQuery = `
                SELECT distinct(jobGroupId)
                FROM job
                WHERE (jobId = ? or jobId = ? or jobId = ? or jobId = ? or jobId = ?) and status = 0;
                `;
  const [jobRows] = await connection.query(selectJobListQuery, jobId);
  return jobRows;
}

// 태그 조회
async function selectTag(connection, tagId) {
  const selectTagListQuery = `
                 SELECT tagName
                 FROM company_and_position_tag 
                 WHERE (tagId = ? or tagId = ? or tagId = ?)  and status = 0;
                 `;
  const [tagRow] = await connection.query(selectTagListQuery, tagId);
  return tagRow;
}

// 팔로우 조회
async function selectFollow(connection, userId, companyId) {
  const selectTagListQuery = `
                 SELECT status
                 FROM user_follow_company
                 WHERE userId = ? and companyId = ?;
                 `;
  const [tagRow] = await connection.query(selectTagListQuery, [userId,companyId] );
  return tagRow;
}

// 회사 조회
async function selectCompany(connection) {
  const selectCompanyListQuery = `
                    SELECT C.companyId, C.companyName, C.companyLogoUrl, CI.imgUrl, T.tagName, P.positionNo
                    FROM company as C left join company_img as CI on (C.companyId = CI.companyId and CI.isThumbnail = 1)
                    join company_and_position_tag as T on C.categoryId = T.tagId
                    left join(select COUNT(PO.positionId) as positionNo, C.companyId
                    from company as C join position as PO on C.companyId = PO.companyId
                    group by PO.companyId) as P on P.companyId = C.companyId
                    where C.status = 0 
                    order by rand()
                    limit 5;
                 `;
  const [companyRow] = await connection.query(selectCompanyListQuery);
  return companyRow;
}

// ID로 회사 조회
async function selectCompanyById(connection, companyId) {
  const selectCompanyInfoQuery = `
  SELECT C.companyId, C.companyName,T.tagName as companyCategoryName, C.companyLogoUrl, C.info as introduction, C.avgSalaryHtml, C.responseRate,
        case when C.responseRate > 95 then '응답률 매우 높음'
            when C.responseRate > 90 then '응답률 높음'
            when C.responseRate > 85 then '응답률 평균 이상'
            when C.responseRate > 80 then '응답률 평균'
            when C.responseRate > 75 then '응답률 낮음'
            when C.responseRate <= 75 then '응답률 매우 낮음'
            end as responseLevel
FROM company as C join company_and_position_tag as T on C.categoryId = T.tagId
where C.status = 0 and C.companyId=?;
                 `;
                
  const [companyInfoRow] = await connection.query(selectCompanyInfoQuery, companyId);
  return companyInfoRow;
}

// ID로 회사 태그 조회
async function selectCompanyTagByCompanyId(connection, companyId) {
const selectCompanyInfoQuery = `
            SELECT DISTINCT tag.tagName
            FROM company_and_position_tagging as tagging join company_and_position_tag as tag
            on tagging.tagId = tag.tagId
            where tag.status = 0 and tagging.status = 0 and tagging.companyId= ?;

                 `;
                
  const [companyInfoRow] = await connection.query(selectCompanyInfoQuery, companyId);
  return companyInfoRow;
}


// ID로 회사 이미지 조회
async function selectImgUrlByCompanyId(connection, companyId) {
  const selectCompanyInfoQuery = `
  select imgUrl from company_img
  where status = 0 and companyId = ?
                   `;
                  
    const [companyInfoRow] = await connection.query(selectCompanyInfoQuery, companyId);
    return companyInfoRow;
  }
  

  // ID로 회사 뉴스 조회
async function selectNewsByCompanyId(connection, companyId) {
  const selectCompanyInfoQuery = `
  select newsTitle as newsName, publishDate as newsDate, newsUrl as newsLink, newspaperUrl as newspaperLink
  from company_news
  where status = 0 and companyId = ?
                   `;
                  
    const [companyInfoRow] = await connection.query(selectCompanyInfoQuery, companyId);
    return companyInfoRow;
  }
  

    // ID로 회사 포지션 조회
async function selectPositionByCompanyId(connection, companyId) {
  const selectCompanyInfoQuery = `
  select positionId, positionName, if (deadline = 0, '상시', deadline) as dueDate, compensationForApplicant+position.compensationForRecommender as Compensation
  from position
  where status = 0 and companyId = ?    
                   `;
                  
    const [companyInfoRow] = await connection.query(selectCompanyInfoQuery, companyId);
    return companyInfoRow;
  }

    // ID로 회사 인원 조회
async function selectEmployeeByCompanyId(connection, companyId) {
  const selectCompanyInfoQuery = `
  select case when type = 0 then 'total'
  when type = 1 then 'in'
  when type = 2 then 'out'
  end as employeeType, employeeHtml, lastYear
  from employee
  where status = 0 and companyId = ?
                   `;
                  
    const [companyInfoRow] = await connection.query(selectCompanyInfoQuery, companyId);
    return companyInfoRow;
  }



// 직군 ID로 회사 ID 검색
async function selectCompanyByGroup(connection, jobGroupId) {
  const selectCompanyListQuery = `
  SELECT C.companyId, C.companyName, C.companyLogoUrl, CI.imgUrl, T.tagName, P.positionNo
  FROM company as C left join company_img as CI on ( C.companyId = CI.companyId and CI.isThumbnail = 1)
  join company_and_position_tag as T on C.categoryId = T.tagId
  join (select DISTINCT P.companyId
  from position as P join job_group as JG
  on P.jobGroupCategoryId = JG.jobGroupId
  where JG.jobGroupId = ? ) as JG on JG.companyId = C.companyId
  left join(select COUNT(PO.positionId) as positionNo, C.companyId
  from company as C join position as PO on C.companyId = PO.companyId
  group by PO.companyId) as P on P.companyId = C.companyId
  order by rand()
  limit 5;`;
  const [companyRow] = await connection.query(selectCompanyListQuery, jobGroupId);
  return companyRow;
  
}



// 직무 ID로 회사 ID 검색
async function selectCompanyByJob(connection, jobId) {
  const selectCompanyListQuery = `
  SELECT C.companyId, C.companyName, C.companyLogoUrl, CI.imgUrl, T.tagName, P.positionNo
  FROM company as C left join company_img as CI on ( C.companyId = CI.companyId and CI.isThumbnail = 1)
  join company_and_position_tag as T on C.categoryId = T.tagId
  join (select PO.companyId
  from job as J join position as PO on J.jobId = PO.jobCategoryId
  where  (jobId = ? or jobId = ? or jobId = ? or jobId = ? or jobId = ?)
  group by PO.companyId
  ) as J on C.companyId = J.companyId
  left join(select COUNT(PO.positionId) as positionNo, C.companyId
  from company as C join position as PO on C.companyId = PO.companyId
  group by PO.companyId) as P on P.companyId = J.companyId
  order by rand()
  limit 5;
`;
  const [companyRow] = await connection.query(selectCompanyListQuery, jobId);
  return companyRow;
  
}

// 태그 ID로 회사 ID 검색
async function selectCompanyByTag(connection, tagId) {
  const selectCompanyListQuery = `
  SELECT C.companyId, C.companyName, C.companyLogoUrl, CI.imgUrl, T.tagName, P.positionNo
  FROM company as C left join company_img as CI on ( C.companyId = CI.companyId and CI.isThumbnail = 1)
  join company_and_position_tag as T on C.categoryId = T.tagId
  join (select companyId
    from company_and_position_tagging
    where (tagId = ? or tagId = ? or tagId = ?)
    order by rand()
    ) as TA on TA.companyId = C.companyId
  left join(select COUNT(PO.positionId) as positionNo, C.companyId
  from company as C join position as PO on C.companyId = PO.companyId
  group by PO.companyId) as P on P.companyId = C.companyId
  order by rand()
  limit 5;`;
  const [companyRow] = await connection.query(selectCompanyListQuery, tagId);
  return companyRow;
  
}

// 직무, 태그 ID로 회사 ID 검색
async function selectCompanyByJobTag(connection, jobId, tagId) {
  const selectCompanyListQuery = `
  SELECT C.companyId, C.companyName, C.companyLogoUrl, CI.imgUrl, T.tagName, P.positionNo
        FROM company as C left join company_img as CI on ( C.companyId = CI.companyId and CI.isThumbnail = 1)
        join company_and_position_tag as T on C.categoryId = T.tagId
        join (select PO.companyId
        from job as J join position as PO on J.jobId = PO.jobCategoryId
        where  (jobId = ? or jobId = ? or jobId = ? or jobId = ? or jobId = ?) 
        group by PO.companyId
        ) as J on C.companyId = J.companyId
        join (select companyId
        from company_and_position_tagging
        where (tagId = ? or tagId = ? or tagId = ?)
        order by rand()
        ) as TA on TA.companyId = C.companyId
        left join(select COUNT(PO.positionId) as positionNo, C.companyId
        from company as C join position as PO on C.companyId = PO.companyId
        group by PO.companyId) as P on P.companyId = J.companyId
        order by rand()
        limit 5;
        `;
  const [companyRow] = await connection.query(selectCompanyListQuery, [jobId[0] ,jobId[1] ,jobId[2],jobId[3],jobId[4],tagId[0], tagId[1], tagId[2]]);
  return companyRow;
  
}

// 직군, 태그 ID로 회사 ID 검색
async function selectCompanyByGroupTag(connection, jobGroupId, tagId) {
  const selectCompanyListQuery = `
  SELECT C.companyId, C.companyName, C.companyLogoUrl, CI.imgUrl, T.tagName, P.positionNo
        FROM company as C left join company_img as CI on ( C.companyId = CI.companyId and CI.isThumbnail = 1)
        join company_and_position_tag as T on C.categoryId = T.tagId
        join (select DISTINCT P.companyId
          from position as P join job_group as JG
          on P.jobGroupCategoryId = JG.jobGroupId
          where JG.jobGroupId = ? ) as JG on JG.companyId = C.companyId
        join (select companyId
        from company_and_position_tagging
        where (tagId = ? or tagId = ? or tagId = ?)
        order by rand()
        ) as TA on TA.companyId = C.companyId
        left join(select COUNT(PO.positionId) as positionNo, C.companyId
        from company as C join position as PO on C.companyId = PO.companyId
        group by PO.companyId) as P on P.companyId = C.companyId
        order by rand()
        limit 5;
        `;
  const [companyRow] = await connection.query(selectCompanyListQuery, [jobGroupId,tagId[0], tagId[1], tagId[2]]);
  return companyRow;
  
}

// 직군, 태그 ID로 회사 ID 검색
async function selectCompanyByGroupJob(connection, jobGroupId, jobId) {
  const selectCompanyListQuery = `
  SELECT C.companyId, C.companyName, C.companyLogoUrl, CI.imgUrl, T.tagName, P.positionNo
        FROM company as C left join company_img as CI on ( C.companyId = CI.companyId and CI.isThumbnail = 1)
        join company_and_position_tag as T on C.categoryId = T.tagId
        join (select DISTINCT P.companyId
          from position as P join job_group as JG
          on P.jobGroupCategoryId = JG.jobGroupId
          where JG.jobGroupId = ? ) as JG on JG.companyId = C.companyId
          join (select PO.companyId
            from job as J join position as PO on J.jobId = PO.jobCategoryId
            where  (jobId = ? or jobId = ? or jobId = ? or jobId = ? or jobId = ?) 
            group by PO.companyId
            ) as J on C.companyId = J.companyId
        left join(select COUNT(PO.positionId) as positionNo, C.companyId
        from company as C join position as PO on C.companyId = PO.companyId
        group by PO.companyId) as P on P.companyId = J.companyId
        order by rand()
        limit 5;
        `;
  const [companyRow] = await connection.query(selectCompanyListQuery, [jobGroupId,jobId[0] ,jobId[1] ,jobId[2],jobId[3],jobId[4]]);
  return companyRow;
  
}



// job group Id로 companyId 조회
async function selectCompanyByAll(connection, jobGroupId, jobId, tagId) {
  const selectCompanyIdListQuery = 
  `
  SELECT C.companyId, C.companyName, C.companyLogoUrl, CI.imgUrl, T.tagName, P.positionNo
        FROM company as C left join company_img as CI on ( C.companyId = CI.companyId and CI.isThumbnail = 1)
        join company_and_position_tag as T on C.categoryId = T.tagId
        join (select DISTINCT P.companyId
        from position as P join job_group as JG
        on P.jobGroupCategoryId = JG.jobGroupId
        where JG.jobGroupId = ? ) as JG on JG.companyId = C.companyId
        join (select PO.companyId
        from job as J join position as PO on J.jobId = PO.jobCategoryId
        where  (jobId = ? or jobId = ? or jobId = ? or jobId = ? or jobId = ?) 
        group by PO.companyId
        ) as J on C.companyId = J.companyId
        join (select companyId
        from company_and_position_tagging
        where (tagId = ? or tagId = ? or tagId = ?)
        order by rand()
        ) as TA on TA.companyId = C.companyId
        left join(select COUNT(PO.positionId) as positionNo, C.companyId
        from company as C join position as PO on C.companyId = PO.companyId
        group by PO.companyId) as P on P.companyId = J.companyId
        order by rand()
        limit 5;
  
  `;
  const [tagRow] = await connection.query(selectCompanyIdListQuery, [jobGroupId, jobId[0] ,jobId[1] ,jobId[2],jobId[3],jobId[4], tagId[0], tagId[1], tagId[2]] );
  return tagRow;
}

// company follow
async function insertFollowCompany(connection, userId, companyId){
  const insertFollowQuery = `
                  insert into user_follow_company(userId, companyId)
                  values (?, ?);
                 `;
  const followRow = await connection.query(insertFollowQuery, [userId, companyId]);
  return followRow;
}

// company follow update
async function updateFollowCompany(connection, userId, companyId, isFollow){
  const updateFollowQuery = `
                  update user_follow_company 
                  set status = ?, updatedAt = Now() 
                  where companyId = ? and userId = ?;
                 `;
  const followRow = await connection.query(updateFollowQuery, [isFollow, companyId, userId]);
  return followRow;
}

// 유저 상태 조회
async function selectUserStatus(connection, userId){
  const userStatusQuery = `
                  select status
                  from user
                  where userId = ?;
                 `;
  const userStatusRow = await connection.query(userStatusQuery, userId);
  return userStatusRow;
}

// 회사 상태 조회
async function selectCompanyStatus(connection, companyId){
  const companyStatusQuery = `
                  select status
                  from company
                  where companyId = ?;
                 `;
  const companyStatusRow = await connection.query(companyStatusQuery, companyId);
  return companyStatusRow;
}






module.exports = {
  selectCompany,
  selectCompanyByGroup,
  selectCompanyByJob,
  selectCompanyByTag,
  selectCompanyByJobTag,
  selectCompanyByGroupTag,
  selectCompanyByGroupJob,
  selectCompanyByAll,
  selectJobGroup,
  selectJob,
  selectTag,
  selectCompanyById,
  selectCompanyTagByCompanyId,
  selectImgUrlByCompanyId,
  selectNewsByCompanyId,
  selectPositionByCompanyId,
  selectEmployeeByCompanyId,
  insertFollowCompany,
  updateFollowCompany, 
  selectFollow,
  selectUserStatus,
  selectCompanyStatus

};
