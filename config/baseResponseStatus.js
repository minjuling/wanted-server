module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, 

    SMS_SEND_MESSAGE_FAILURE : { "isSuccess": false, "code": 1002, "message":"문자 발송 실패" },
    SMS_VALIDATION_FAILURE : { "isSuccess": false, "code": 1003, "message":"문자 인증 실패" },
    KAKAOPAY_FAILURE : { "isSuccess": false, "code": 1004, "message":"카카오페이 실패" },
    KAKAOPAY_ALREADY_PAYMENT : { "isSuccess": false, "code": 1005, "message":"이미 결제되었습니다." },

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"이름을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"이름은 2~20자리를 입력해주세요." },
    SIGNUP_PHONENUMBER_EMPTY : { "isSuccess": false,"code": 2019,"message":"휴대폰 번호를 입력해주세요." },
    SIGNUP_PHONENUMBER_LENGTH : { "isSuccess": false,"code": 2020,"message":"휴대폰 번호는 9자리 이상 입력해주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },

    COMPANY_JOB_ID_NUMBER : { "isSuccess": false, "code": 2019, "message": "직무는 5개 이하로 골라주세요" },
    COMPANY_TAG_ID_NUMBER : { "isSuccess": false, "code": 2020, "message": "태그는 3개 이하로 골라주세요" },
    COMPANY_COMPANYID_EMPTY : { "isSuccess": false, "code": 2021, "message": "회사Id가 없습니다." },

    POSITION_POSITION_ID_EMPTY : { "isSuccess": false, "code": 2022, "message": "포지션 Id가 없습니다." },
    RESUME_RESUME_ID_EMPTY : { "isSuccess": false, "code": 2023, "message": "이력서 Id가 없습니다." },
    USER_INFO_EMPTY : { "isSuccess": false, "code": 2024, "message": "변경할 값을 입력해주세요" },
    POINT_POINT_EMPTY : { "isSuccess": false, "code": 2025, "message": "point 값이 없습니다." },
    POINT_POINT_ZERO : { "isSuccess": false, "code": 2026, "message": "추가된 point값이 0 이하입니다." },
    TAG_TAGID_EMPTY : { "isSuccess": false, "code": 2027, "message": "추가할 태그 Id가 없습니다." },
    TAG_TAGID_ERROR_TYPE : { "isSuccess": false, "code": 2028, "message": "태그 Id를 array로 보내주세요." },
    FILE_FILENAME_EMPTY : { "isSuccess": false, "code": 2029, "message": "파일 이름이 없습니다." },
    FILE_FILE_EMPTY : { "isSuccess": false, "code": 2030, "message": "파일이 없습니다." },
    EVENT_EVENTID_EMPTY : { "isSuccess": false, "code": 2031, "message": "이벤트 Id가 없습니다." },
    EVENT_PARTICIPATE_INFO_EMPTY : { "isSuccess": false, "code": 2032, "message": "이벤트 신청 정보가 없습니다." },
    SIGNUP_CODE_EMPTY : { "isSuccess": false,"code": 2033,"message":"코드를 입력해주세요." },
    SIGNUP_CODE_LENGTH : { "isSuccess": false,"code": 2034,"message":"코드는 4자리입니다." },



    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_SLEPPER_EMAIL : { "isSuccess": false, "code": 3007, "message":"휴면계정입니다. 로그인해주세요." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },
    SIGNUP_REDUNDANT_PHONENUMBER : { "isSuccess": false, "code": 3008, "message":"중복된 휴대폰 번호입니다." },


    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    COMPANY_JOB_GROUP_NOT_EXIST : { "isSuccess": false, "code": 3009, "message": "잘못된 직군입니다." },
    COMPANY_JOB_NOT_EXIST : { "isSuccess": false, "code": 3010, "message": "잘못된 직무입니다." },
    COMPANY_TAG_NOT_EXIST : { "isSuccess": false, "code": 3011, "message": "잘못된 태그입니다." },
    COMPANY_JOB_AND_GROUP_NOT_MATCH : { "isSuccess": false, "code": 3012, "message": "직무의 직군이 동일하지 않습니다." },
    COMPANY_INACTIVE_COMPANY : { "isSuccess": false, "code": 3013, "message": "회사가 존재하지 않습니다." },
    POSITION_INACTIVE_POSITION : { "isSuccess": false, "code": 3014, "message": "포지션이 존재하지 않습니다." },
    USER_NOT_EXIST : { "isSuccess": false, "code": 3015, "message": "유저 정보가 존재하지 않습니다." },
    POSITION_APPLICATION_EXIST : { "isSuccess": false, "code": 3016, "message": "이미 지원한 회사입니다." },
    RECOMMENDER_INACTIVE_RECOMMENDER : { "isSuccess": false, "code": 3017, "message": "추천인이 존재하지 않습니다." },
    RECOMMENDER_SAME_USER : { "isSuccess": false, "code": 3018, "message": "추천인과 지원자는 동일할 수 없습니다." },
    RESUME_APPLICATION_NOT_EXIST : { "isSuccess": false, "code": 3019, "message": "이력서가 존재하지 않습니다." },
    TAG_INACTIVE_TAG : { "isSuccess": false, "code": 3020, "message": "태그가 존재하지 않습니다." },
    SCHOOL_INACTIVE_SCHOOL : { "isSuccess": false, "code": 3021, "message": "학교가 존재하지 않습니다." },
    EVENT_INACTIVE_EVENT : { "isSuccess": false, "code": 3022, "message": "이벤트가 존재하지 않습니다." },
    EVENT_ALREADY_PARTICIPATE : { "isSuccess": false, "code": 3023, "message": "이미 신청한 이벤트 입니다." },
    EVENT_FEE_NOT_EXIST : { "isSuccess": false, "code": 3024, "message": "결제금액이 없습니다." },




    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
