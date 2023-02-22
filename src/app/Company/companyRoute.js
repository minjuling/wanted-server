module.exports = function(app){
    const company = require('./companyController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 4. 회사 리스트 보여주기 API
    app.get('/companies', company.getCompanies)
    app.get('/companies/:jobGroupId', company.getCompanies)
    
    // 5. 회사 소개 페이지 API
     app.get('/companies/info/:companyId', company.getCompanyInfo)
    
     

};

