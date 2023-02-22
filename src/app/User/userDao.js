// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM user;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickname, phoneNo, imgUrl,  status
                FROM user 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// 휴대폰 번호로 회원 조회
async function selectUserPhoneNo(connection, phoneNo) {
  const selectUserEmailQuery = `
                SELECT email, nickname, phoneNo, imgUrl,  status
                FROM user 
                WHERE phoneNo = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, phoneNo);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
  SELECT user.userId, nickname as userName, imgUrl as userImg, email, phoneNo, if (interestNo,interestNo,0) as interestNo,if (resumeOpenNo,resumeOpenNo,0) as resumeOpenNo , if (proposalNo,proposalNo,0) as proposalNo
        FROM user
        left join (select distinct user.userId, count(uic.userId) as interestNo from user join user_interest_company uic on user.userId = uic.userId) as uic
        on uic.userId = user.userId
        left join (select distinct user.userId, count(cor.resumeId) as resumeOpenNo from user join resume_list rl on user.userId = rl.userId left join company_open_resume cor on rl.resumeId = cor.resumeId) as rl
        on rl.userId = user.userId
        left join (select distinct user.userId, count(cpu.userId) as proposalNo from user join company_propose_user cpu on user.userId = cpu.userId) as cpu
        on cpu.userId = user.userId
        WHERE user.userId = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}


// userId 회원 조회
async function selectUserNotice(connection, userId) {
  const selectUserIdQuery = `
        SELECT emailEventNotice, emailPositionNotice, smsEventNotice
        FROM user
        WHERE userId = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO user(email, password, nickname, phoneNo, imgUrl)
        VALUES (?, ?, ?, ?, 'https://static.wanted.co.kr/oneid-user/profile_default.png');
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, userId) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM user 
        WHERE userId = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      userId
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, userId
        FROM user 
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

async function updateUserPassword(connection, userId, password) {
  const updateUserQuery = `
  UPDATE user 
  SET password = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [password, userId]);
  return updateUserRow[0];
}

async function updateUserNickname(connection, userId, nickname) {
  const updateUserQuery = `
  UPDATE user 
  SET nickname = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, userId]);
  return updateUserRow[0];
}

async function updateUserPhoneNo(connection, userId, phoneNo) {
  const updateUserQuery = `
  UPDATE user 
  SET phoneNo = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [phoneNo, userId]);
  return updateUserRow[0];
}

async function updateUserImgUrl(connection, userId, imgUrl) {
  const updateUserQuery = `
  UPDATE user 
  SET imgUrl = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [imgUrl, userId]);
  return updateUserRow[0];
}

async function updateUserExit(connection, userId) {
  const updateUserQuery = `
  UPDATE user 
  SET status = 2
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery,  userId);
  return updateUserRow[0];
}


async function updateEmailEventNotice(connection, userId, emailEventNotice) {
  const updateUserQuery = `
  UPDATE user 
  SET emailEventNotice = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [emailEventNotice, userId]);
  return updateUserRow[0];
}

async function updateEmailPositionNotice(connection, userId, emailPositionNotice) {
  const updateUserQuery = `
  UPDATE user 
  SET emailPositionNotice = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [emailPositionNotice, userId]);
  return updateUserRow[0];
}

async function updateSmsEventNotice(connection, userId, smsEventNotice) {
  const updateUserQuery = `
  UPDATE user 
  SET smsEventNotice = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [smsEventNotice, userId]);
  return updateUserRow[0];
}

async function selectBookmarkPosition(connection, userId) {
  const userBookmarkQuery = `
  select p.positionId, p.positionName,imgUrl as positionImg, c.companyId, c.companyName, p.country, p.location, (p.compensationForRecommender + p.compensationForApplicant) as compensation
from user_bookmarks_position ubp join position p on ubp.positionId = p.positionId
join company c on p.companyId = c.companyId
join company_img ci on (ci.companyId = c.companyId and ci.isThumbnail = 1)
where userId = ? and ubp.isBookmark= 1;`;
  const userBookmarkRow = await connection.query(userBookmarkQuery, userId);
  return userBookmarkRow;
}

async function selectLikePosition(connection, userId) {
  const userLikeQuery = `
        select p.positionId, p.positionName,imgUrl as positionImg,
        c.companyId, c.companyName, p.country, p.location,
        (p.compensationForRecommender + p.compensationForApplicant) as compensation
      from user_like_position ulp join position p on ulp.positionId = p.positionId
      join company c on p.companyId = c.companyId
      join company_img ci on (ci.companyId = c.companyId and ci.isThumbnail = 1)
      where userId = ? and ulp.isLike = 1;`;
  const userLikeRow = await connection.query(userLikeQuery, userId);
  return userLikeRow;
}


async function selectUserBookmarkId(connection, userId) {
  const userBookmarkQuery = `
  select positionId
from user_bookmarks_position
where userId=? and isBookmark = 1;`;
  const userBookmarkRow = await connection.query(userBookmarkQuery, userId);
  return userBookmarkRow;
}

async function selectUserLikeId(connection, userId) {
  const userLikeQuery = `
  select positionId
from user_like_position
where userId=? and isLike = 1;`;
  const userLikeRow = await connection.query(userLikeQuery, userId);
  return userLikeRow;
}

async function selectUserFollowId(connection, userId) {
  const userFollowQuery = `
  select companyId
from user_follow_company
where userId=? and isFollow = 1;`;
  const userFollowRow = await connection.query(userFollowQuery, userId);
  return userFollowRow;
}


async function selectResumeList(connection, userId) {
  const userResumeQuery = `
      select resumeId, resumeName, rl.createdAt, isFile, fileUrl, isWriting, isMatchup, isCareerCert
      from resume_list rl join user on user.userId = rl.userId
      where user.userId = ?;`;
  const userResumeRow = await connection.query(userResumeQuery, userId);
  return userResumeRow;
}

// 팔로우 조회
async function selectFollow(connection, userId, companyId) {
  const selectTagListQuery = `
                 SELECT isFollow
                 FROM user_follow_company
                 WHERE userId = ? and companyId = ?;
                 `;
  const [tagRow] = await connection.query(selectTagListQuery, [userId,companyId] );
  return tagRow;
}

// 팔로우 조회
async function selectBookmark(connection, userId, positionId) {
  const selectBookmarkQuery = `
                 SELECT isBookmark
                 FROM user_bookmarks_position
                 WHERE userId = ? and positionId = ?;
                 `;
  const [bookmarkRow] = await connection.query(selectBookmarkQuery, [userId,positionId] );
  return bookmarkRow;
}

// 팔로우 조회
async function selectLike(connection, userId, positionId) {
  const selectLikeQuery = `
                 SELECT isLike
                 FROM user_like_position
                 WHERE userId = ? and positionId = ?;
                 `;
  const [likeRow] = await connection.query(selectLikeQuery, [userId,positionId] );
  return likeRow;
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

// 유저 상태 조회
async function selectUserStatus(connection, userId){
  const userStatusQuery = `
                  select nickname, phoneNo, imgUrl, status
                  from user
                  where userId = ?;
                 `;
  const userStatusRow = await connection.query(userStatusQuery, userId);
  return userStatusRow;
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
                  set isFollow = ?, updatedAt = Now() 
                  where companyId = ? and userId = ?;
                 `;
  const followRow = await connection.query(updateFollowQuery, [isFollow, companyId, userId]);
  return followRow;
}



async function insertEventParticipate(connection,userId, eventId,email, name, companyId, jobGroupId, jobId, career, universityId, admission, graduation, isAttending){
  const insertQuery = `
                  insert into user_participate_event(userId, eventId,email, userName, companyId, jobGroupId, jobId, career, universityId, admission, graduation, isAttending)
                  values (?, ?,?,?,?,?,?,?,?,?,?,?);
                 `;
  const insertRow = await connection.query(insertQuery, [userId, eventId,email, name, companyId, jobGroupId, jobId, career, universityId, admission, graduation, isAttending]);
  return insertRow;
}

async function updateEventParticipate(connection, userId, eventId,email, name, companyId, jobGroupId, jobId, career, universityId, admission, graduation, isAttending, status){
  const insertQuery = `
                  update user_participate_event 
                  set  email=? , userName=? , companyId=? , jobGroupId=? , jobId=?, career=?, universityId=?, admission=?, graduation=?, isAttending=?, status = ?, updatedAt = Now() 
                  where eventId = ? and userId = ?;
                 `;
  const insertRow = await connection.query(insertQuery, [email, name, companyId, jobGroupId, jobId, career, universityId, admission, graduation, isAttending, status, eventId, userId]);
  return insertRow;
}

// position bookmark
async function insertBookmarkPosition(connection, userId, positionId){
  const insertBookmarkQuery = `
                  insert into user_bookmarks_position(userId, positionId)
                  values (?, ?);
                 `;
  const bookmarkRow = await connection.query(insertBookmarkQuery, [userId, positionId]);
  return bookmarkRow;
}


// position bookmark update
async function updateBookmarkPosition(connection, userId, positionId, isBookmark){
  const updateBookmarkQuery = `
                  update user_bookmarks_position 
                  set isBookmark = ?, updatedAt = Now() 
                  where positionId = ? and userId = ?;
                 `;
  const bookmarkRow = await connection.query(updateBookmarkQuery, [isBookmark, positionId, userId]);
  return bookmarkRow;
}

// position like
async function insertLikePosition(connection, userId, positionId){
  const insertLikeQuery = `
                  insert into user_like_position(userId, positionId)
                  values (?, ?);
                 `;
  const likeRow = await connection.query(insertLikeQuery, [userId, positionId]);
  return likeRow;
}

// position like update
async function updateLikePosition(connection, userId, positionId, isLike){
  const updateLikeQuery = `
                  update user_like_position 
                  set isLike = ?, updatedAt = Now() 
                  where positionId = ? and userId = ?;
                 `;
  const likeRow = await connection.query(updateLikeQuery, [isLike, positionId, userId]);
  return likeRow;
}


// 관심 태그 설정
async function insertInterestTag(connection, userId, tagId){
  const insertLikeQuery = `
          insert user_interest_tag(userId, tagId)
          values (?, ?);
                 `;
  const likeRow = await connection.query(insertLikeQuery, [userId, tagId]);
  return likeRow;
}

// 관심 태그 업데이트
async function updateInterestTag(connection, userId, tagId, isSet){
  const updateLikeQuery = `
              update user_interest_tag
              set isSet = ?, updatedAt = Now()
              where tagId = ? and userId = ?;
                 `;
  const likeRow = await connection.query(updateLikeQuery, [isSet, tagId, userId]);
  return likeRow;
}


// 태그 알림 설정
async function insertTagNotice(connection, userId, tagId){
  const inserTagNoticeQuery = `
  insert user_notice_keyword (userId, tagId)
  values (?,?);
                 `;
  const tagNoticeRow = await connection.query(inserTagNoticeQuery, [userId, tagId]);
  return tagNoticeRow;
}

// 태그 알림 업데이트
async function updateTagNotice(connection, userId, tagId, isSet){
  const inserTagNoticeQuery = `
  update user_notice_keyword
  set isSet = ?
  where tagId = ? and userId = ?;`;
  const tagNoticeRow = await connection.query(inserTagNoticeQuery, [isSet, tagId, userId]);
  return tagNoticeRow;
}

// 태그 알림 업데이트
async function updateNoticeZero(connection, userId){
  const inserTagNoticeQuery = `
  update user_notice_keyword
  set isSet = 0
  where userId = ?;`;
  const tagNoticeRow = await connection.query(inserTagNoticeQuery, userId);
  return tagNoticeRow;
}



// point 적립
async function insertPoints(connection, userId, point){
  const insertPointQuery = `
          insert into user_points(userId, point)
          values (?, ?);
                 `;
  const pointRow = await connection.query(insertPointQuery, [userId, point, userId]);
  return pointRow;
}

// point 만료 업데이트
async function updatePointsExpired(connection, userId){
  const updatePointQuery = `
  update user_points
  set isExpired =if(Now()>endedAt, 1, 0)
  where userId = ?;
                 `;
  const pointRow = await connection.query(updatePointQuery, userId);
  return pointRow;
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

// 지원 상태 조회
async function selectApplicationByPositionId(connection, userId, positionId){
  const applicationStatusQuery = `
                  select userId, positionId, resumeId, recommenderId, status, updatedAt
                  from user_applies_position
                  where userId=? and positionId = ? and isWriting = 0;
                 `;
  const applicationStatusRow = await connection.query(applicationStatusQuery, [userId, positionId]);
  return applicationStatusRow;
}

// 포지션 지원하기
async function insertApplication(connection, userId, positionId, resumeId, recommenderId){
  const insertApplicaionQuery = `
              INSERT INTO user_applies_position (userId, positionId, resumeId, recommenderId)
              VALUES (?, ?, ?, ?);
                 `;
  const applicaionRow = await connection.query(insertApplicaionQuery, [userId, positionId, resumeId, recommenderId]);
  return applicaionRow;
}

// 포지션 지원하기
async function insertResume(connection, userId, resumeName){
  const insertApplicaionQuery = `
              INSERT INTO resume_list(userId, resumeName, introduction)
              VALUES (?, ?, '안녕하세요!');
                 `;
  const applicaionRow = await connection.query(insertApplicaionQuery, [userId, resumeName]);
  return applicaionRow;
}


// 포지션 지원하기
async function insertResumeFile(connection, userId, fileName, fileLink){
  const insertApplicaionQuery = `
              INSERT INTO resume_list(userId, resumeName, fileUrl, isFile, introduction)
              VALUES (?, ?, ?, 1, null);
                 `;
  const applicaionRow = await connection.query(insertApplicaionQuery, [userId, fileName, fileLink]);
  return applicaionRow;
}


// 포지션 상태 조회
async function selectPositionStatus(connection, positionId){
  const positionStatusQuery = `
                  select status
                  from position
                  where positionId = ?;
                 `;
  const positionStatusRow = await connection.query(positionStatusQuery, positionId);
  return positionStatusRow;
}

// 이력서 상태 조회
async function selectResumeStatus(connection, resumeId){
  const resumeStatusQuery = `
                  select status
                  from resume_list
                  where resumeId = ?;
                 `;
  const resumeStatusRow = await connection.query(resumeStatusQuery, resumeId);
  return resumeStatusRow;
}


// 이력서 상태 조회
async function selectLastResumeId(connection, userId){
  const resumeStatusQuery = `
          select * from resume_list
          where resumeId =
          (SELECT max(resumeId)
          from resume_list
          where userId = ?);
                 `;
  const resumeStatusRow = await connection.query(resumeStatusQuery, userId);
  return resumeStatusRow;
}
// 이력서 상태 조회
async function selectResumeByUserId(connection, userId){
  const resumeStatusQuery = `
                  select *
                  from resume_list
                  where userId = ?;
                 `;
  const resumeStatusRow = await connection.query(resumeStatusQuery, userId);
  return resumeStatusRow;
}

// 추천인 상태 조회
async function selectRecommenderStatus(connection, recommenderId){
  const recommenderStatusQuery = `
                  select status
                  from user_recommend_position
                  where recommenderId = ?;
                 `;
  const recommenderStatusRow = await connection.query(recommenderStatusQuery, recommenderId);
  return recommenderStatusRow;
}


// 모든 유저 조회
async function selectUserExpertCareer(connection, userId) {
  const selectUserListQuery = `
                SELECT uec.jobGroupId, jg.jobGroupName,
                case when careerType = 0 then '신입'
                when careerType = 35 then '35년 이상'
                ELSE CONCAT(careerType,'년')
                end as careeType
                FROM user_expertize_career uec join job_group jg on uec.jobGroupId = jg.jobGroupId
                where userId = ?;
                `;
  const [userRows] = await connection.query(selectUserListQuery, userId);
  return userRows;
}

// 모든 유저 조회
async function selectUserExpertJob(connection, userId) {
  const selectUserListQuery = `
          SELECT uej.jobId, j.jobName
          FROM user_expertize_job uej join job j on uej.jobId = j.jobId
          where userId = ?;
                `;
  const [userRows] = await connection.query(selectUserListQuery, userId);
  return userRows;
}

// 제외된 회사 
async function selectExceptedCompany(connection, userId) {
  const selectUserListQuery = `
          SELECT uec.companyId as exceptedCompanyId , c.companyName as exceptedCompanyName
          FROM user_except_company uec join company c on uec.companyId = c.companyId
          where userId = ?;
                `;
  const [userRows] = await connection.query(selectUserListQuery, userId);
  return userRows;
}

// 유저 추천인 조회
async function selectUserRecommender(connection, userId) {
  const selectUserListQuery = `
        select recommenderId, ru.nickName as recommenderName ,ru.imgUrl as recommenderImgUrl,
        case when relation = 0 then '직장동료'
            when relation = 1 then '비즈니스 파트너'
            when relation = 2 then '학교 동문/친구'
            end as relation, recommendation, isChoose
        from user_recommend_position urp join user u on urp.userId = u.userId
        join user ru on urp.recommenderId = ru.userId
        where u.userId = ?;
                `;
  const [userRows] = await connection.query(selectUserListQuery, userId);
  return userRows;
}

// 이력서 상태 조회
async function selectResumeDetail(connection, userId){
  const resumeDetailQuery = `
                select rl.resumeId, resumeName, rl.createdAt, introduction, isOpen, isBasic
                from resume_list rl
                where userId = ? and rl.status = 0 and isBasic = 1;
                 `;
  const resumeDetailRow = await connection.query(resumeDetailQuery, userId);
  return resumeDetailRow;
}

// 이력서 상태 조회
async function selectResumeDetailById(connection, resumeId){
  const resumeDetailQuery = `
            select resumeId, resumeName, createdAt, introduction, isOpen, isBasic
            from resume_list
            where resumeId = ? and status = 0;
                 `;
  const resumeDetailRow = await connection.query(resumeDetailQuery, resumeId);
  return resumeDetailRow;
}

// 이력서 상태 조회
async function selectResumeEducation(connection, resumeId){
  const resumeDetailQuery = `
                  select s.schoolId as univId, s.schoolName as univName, major, enrollment, learned as learnedDesc, startedAt, endedAt
                  from education join school s on education.schoolId = s.schoolId
                  where resumeId = ? and education.status = 0;
                 `;
  const resumeDetailRow = await connection.query(resumeDetailQuery, resumeId);
  return resumeDetailRow;
}

// 이력서 상태 조회
async function selectResumeCareer(connection, resumeId){
  const resumeDetailQuery = `
              select companyId, companyName, startedAt, endedAt, duringOffice, department,
              case when workingType =0 then '풀타임'
                  when workingType = 1 then '파트타임'
                  when workingType = 2 then '인턴'
              end as workingType
            from career
            where resumeId = ?;
                 `;
  const resumeDetailRow = await connection.query(resumeDetailQuery, resumeId);
  return resumeDetailRow;
}

// 이력서 상태 조회
async function selectResumeResult(connection, resumeId){
  const resumeDetailQuery = `
          select resultId, c.companyId, resultName, resultText, r.startedAt, r.endedAt
          from result r join career c on r.careerId = c.careerId
          where resumeId = ?;
                 `;
  const resumeDetailRow = await connection.query(resumeDetailQuery, resumeId);
  return resumeDetailRow;
}

// 이력서 상태 조회
async function selectResumeSkill(connection, resumeId){
  const resumeDetailQuery = `
                  select rs.skillId, skillName
                  from resume_skill rs join tech_stack ts on rs.skillId = ts.skillId
                  where resumeId = ?;
                 `;
  const resumeDetailRow = await connection.query(resumeDetailQuery, resumeId);
  return resumeDetailRow;
}

// 이력서 상태 조회
async function selectResumePrize(connection, resumeId){
  const resumeDetailQuery = `
              select prizeId, prizeName, prizedAt, prizeInfo
              from prize
              where status = 0 and resumeId = ?;
                 `;
  const resumeDetailRow = await connection.query(resumeDetailQuery, resumeId);
  return resumeDetailRow;
}

// 이력서 상태 조회
async function selectResumeLanguage(connection, resumeId){
  const resumeDetailQuery = `
          select ul.languageId, l.languageName, case when fluency = 0 then '유창함'
          when fluency = 1 then '비즈니스 회화'
          when fluency = 2 then '일상 회화'
          end as fluency, testName, score, publishDate
          from user_language ul join language l on ul.languageId = l.languageId
          where resumeId = ? and ul.status = 0;
                 `;
  const resumeDetailRow = await connection.query(resumeDetailQuery, resumeId);
  return resumeDetailRow;
}

// 이력서 상태 조회
async function selectResumeLink(connection, resumeId){
  const resumeStatusQuery = `
  select linkId, link
  from link
      where resumeId = ? and status = 0;
                 `;
  const resumeDetailRow = await connection.query(resumeStatusQuery, resumeId);
  return resumeDetailRow;
}

// 지원 상태 조회
async function selectApplication(connection, userId){
  const resumeStatusQuery = `
        select p.companyId, c.companyName,c.companyLogoUrl,uap.positionId, p.positionName, uap.createdAt as writeTime,
        case when progress = 0 then '불합격'
        when progress = 1 then '최종합격'
        when progress = 2 then '검토중' end as progress,
        recommenderId, u.nickname as recommenderName, applyCompensation
        from user_applies_position uap join position p on uap.positionId = p.positionId
        join company c on p.companyId = c.companyId
        left join user u on recommenderId = u.userId
        where uap.userId = ? and isWriting = 0 and uap.status = 0;
                 `;
  const resumeDetailRow = await connection.query(resumeStatusQuery, userId);
  return resumeDetailRow;
}

// 지원 상태 조회
async function selectWritingApplication(connection, userId){
  const resumeStatusQuery = `
          select p.companyId, c.companyName, c.companyLogoUrl, uap.positionId, p.positionName, uap.createdAt as writeTime,
          case when isWriting = 1 then '작성중' end as progress,
          recommenderId, u.nickname as recommenderName
          from user_applies_position uap join position p on uap.positionId = p.positionId
          join company c on p.companyId = c.companyId
          left join user u on recommenderId = u.userId
          where uap.userId = ? and isWriting = 1 and uap.status = 0;
                 `;
  const resumeDetailRow = await connection.query(resumeStatusQuery, userId);
  return resumeDetailRow;
}

// 지원 상태 조회
async function selectApplicationNo(connection, userId){
  const resumeStatusQuery = `
        select count(userId) as allNo,
        count(if(isWriting = 0, isWriting, null)) as applicationNo,
        count(if(isOpened = 1, isOpened, null)) as resumeOpenNo,
        count(if(progress = 1, progress, null)) as finalAcceptanceNo,
        count(if(progress = 0, progress, null)) rejectNo
        from user_applies_position
        where userId = ? and isWriting = 0 and status = 0;
                 `;
  const resumeDetailRow = await connection.query(resumeStatusQuery, userId);
  return resumeDetailRow;
}


// 제안받기 조회
async function selectMatching(connection, userId){
  const resumeStatusQuery = `
  select umc.companyId, c.companyName,c.companyLogoUrl,umc.createdAt as date,
  case when progress = 0 then '이력서 열람'
  when progress = 1 then '관심있음'
  when progress = 2 then '면접 제안'
  when progress = 3 then '불합격'
  when progress = 4 then '최종합격' end as progress
  from user_matchup_company umc
  join company c on umc.companyId = c.companyId
  where umc.userId = ? and umc.status = 0; `;
  const resumeDetailRow = await connection.query(resumeStatusQuery, userId);
  return resumeDetailRow;
}

// 지원 상태 조회
async function selectMatchingNo(connection, userId){
  const resumeStatusQuery = `
  select count(userId) as allNo,
  count(if(progress = 1, progress, null)) as interestNo,
  count(if(progress = 1, progress, null)) as resumeOpenNo,
  count(if(progress = 2, progress, null)) as proposalNo
  from user_matchup_company
  where userId = ? and status = 0;     `;
  const resumeDetailRow = await connection.query(resumeStatusQuery, userId);
  return resumeDetailRow;
}

// point 적립
async function selectUserPoints(connection, userId){
  const updatePointQuery = `
          select SUM(point) as point
          from user_points
          where userId = ? and isExpired = 0;
                 `;
  const pointRow = await connection.query(updatePointQuery, userId);
  return pointRow;
}



// tagId로 관심 태그 조회
async function selectUserInterestTagById(connection, userId, tagId){
  const interestTagQuery = `
  select uit.tagId, tagName, uit.isSet
  from user_interest_tag uit join event_tag et on uit.tagId = et.tagId
  where userId = ? and uit.tagId = ?;
                 `;
  const tagRow = await connection.query(interestTagQuery, [userId, tagId]);
  return tagRow;
}

// tagId로 관심 태그 조회
async function selectTagNoticeById(connection, userId, tagId){
  const tagNoticeQuery = `
  select unk.tagId, tagName, unk.isSet
  from user_notice_keyword unk join event_tag et on unk.tagId = et.tagId
  where userId = ? and unk.tagId = ?;
                 `;
  const tagRow = await connection.query(tagNoticeQuery, [userId, tagId]);
  return tagRow;
}

// tagId로 관심 태그 조회
async function selectTagNotice(connection, userId){
  const tagNoticeQuery = `
  select distinct unk.tagId, tagName
  from user_notice_keyword unk join event_tag et on unk.tagId = et.tagId
  where userId = ? and unk.isSet = 1; `;
  const tagRow = await connection.query(tagNoticeQuery, userId);
  return tagRow;
}





// 이벤트 태그 조회
async function selectEventTag(connection, tagId){
  const eventTagQuery = `
        select * 
        from event_tag
        where tagId = ?;
                 `;
  const tagRow = await connection.query(eventTagQuery, tagId);
  return tagRow;
}

// 이벤트 태그 조회
async function selectEvent(connection, eventId){
  const eventTagQuery = `
        select * 
        from event
        where eventId = ?;
                 `;
  const eventRow = await connection.query(eventTagQuery, eventId);
  return eventRow;
}


async function selectEventLength(connection, eventId){
  const eventQuery = `
  select count(*)
  from user_participate_event
  where eventId = ?;
                 `;
  const eventRow = await connection.query(eventQuery, eventId);
  return eventRow;
}

// 이벤트 태그 조회
async function selectJob(connection, jobId){
  const eventTagQuery = `
        select * 
        from job
        where jobId = ?;
                 `;
  const tagRow = await connection.query(eventTagQuery, jobId);
  return tagRow;
}
// 이벤트 태그 조회
async function selectJobGroup(connection, jobGroupId){
  const eventTagQuery = `
        select * 
        from job_group
        where jobGroupId = ?;
                 `;
  const tagRow = await connection.query(eventTagQuery, jobGroupId);
  return tagRow;
}
// 이벤트 태그 조회
async function selectSchool(connection, schoolId){
  const eselectSchoolQuery = `
        select * 
        from school
        where schoolId = ?;
                 `;
  const schoolRow = await connection.query(eselectSchoolQuery, schoolId);
  return schoolRow;
}

async function selectEventParticipation(connection, userId, eventId){
  const selectEventQuery = `
        select * 
        from user_participate_event
        where userId = ? and eventId = ?;
                 `;
  const eventRow = await connection.query(selectEventQuery, [userId, eventId]);
  return eventRow;
}









module.exports = {
  selectUser,
  selectUserEmail,
  selectUserPhoneNo,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  selectUserBookmarkId,
  selectUserLikeId,
  selectUserFollowId,
  selectResumeList,
  selectCompany,
  selectFollow,
  selectLike,
  selectBookmark,
  selectUserStatus,
  selectCompanyStatus,
  insertFollowCompany,
  updateFollowCompany,
  insertBookmarkPosition, 
  updateBookmarkPosition,
  insertLikePosition, 
  updateLikePosition,
  insertInterestTag, 
  updateInterestTag,
  selectApplicationByPositionId,
  insertApplication, 
  insertResume,
  insertResumeFile,
  selectPositionStatus,
  selectResumeStatus,
  selectResumeByUserId,
  selectRecommenderStatus,
  selectBookmarkPosition,
  updateUserPassword,
  updateUserNickname,
  updateUserPhoneNo,
  updateUserImgUrl,
  updateUserExit,
  selectUserExpertCareer,
  selectUserExpertJob,
  selectExceptedCompany,
  selectUserRecommender,
  selectResumeDetail,
  selectResumeDetailById,
  selectResumeEducation,
  selectResumeCareer,
  selectResumeResult,
  selectResumeSkill,
  selectResumePrize,
  selectResumeLanguage,
  selectResumeLink,
  selectApplication,
  selectWritingApplication,
  selectApplicationNo, 
  selectLikePosition,
  insertPoints,
  selectUserPoints,
  updatePointsExpired,
  selectEventTag,
  selectUserInterestTagById, 
  selectTagNoticeById,
  selectTagNotice,
  selectMatching,
  selectMatchingNo,
  updateEmailEventNotice,
  updateEmailPositionNotice,
  updateSmsEventNotice,
  selectUserNotice,
  insertTagNotice,
  updateTagNotice,
  updateNoticeZero,
  selectLastResumeId,
  selectEvent,
  selectJobGroup,
  selectJob,
  selectSchool,
  selectEventParticipation,
  insertEventParticipate,
  updateEventParticipate,
  selectEventLength,
};
