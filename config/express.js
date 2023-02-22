const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
var cors = require('cors');
module.exports = function () {
    const app = express();

    app.use(compression());

    app.use(express.json());

    app.use(express.urlencoded({extended: true}));

    app.use(methodOverride());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    require('../src/app/Company/companyRoute')(app);
    require('../src/app/Event/eventRoute')(app);
    require('../src/app/Jobgroup/jobgroupRoute')(app);
    require('../src/app/Login/loginRoute')(app);
    require('../src/app/Logout/logoutRoute')(app);
    require('../src/app/Position/positionRoute')(app);
    require('../src/app/Search/searchRoute')(app);
    require('../src/app/Tag/tagRoute')(app);
    require('../src/app/User/userRoute')(app);

    return app;
};