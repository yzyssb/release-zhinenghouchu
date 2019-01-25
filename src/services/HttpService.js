import request from '../utils/request';
import {
    parse
} from 'qs';
import {
    getUserName,
    getUserId,
    getUserToken
} from '../services/CommonService';


//发布修改此地址
var prefixUrl;
var prefixUrlBase;
const host = window.location.protocol + '//' + window.location.host;
if (host == 'http://localhost:8989') {
    prefixUrl = "http://dev.saas.27aichi.cn/api/";
    prefixUrlBase = "http://dev.saas.27aichi.cn/api/";
} else {
    prefixUrl = window.location.protocol + '//' + window.location.host + '/api/';
    prefixUrlBase = window.location.protocol + '//' + window.location.host + '/api/';
}

var logoutUrl = '';
if (window.location.host.startsWith('pre-')) {
    logoutUrl = 'http://pre-sso.27aichi.cn/logout';
} else if (window.location.host.startsWith('test-')) {
    logoutUrl = 'http://test-sso.27aichi.cn/logout';
} else if (window.location.host.startsWith('saas')) {
    logoutUrl = 'https://sso.27aichi.com/logout';
} else {
    logoutUrl = 'http://dev-sso.27aichi.cn/logout';
}

var portalUrl = '';
if (window.location.host.startsWith('pre-')) {
    portalUrl = 'http://pre-sso.27aichi.cn/portal';
} else if (window.location.host.startsWith('test-')) {
    portalUrl = 'http://test-sso.27aichi.cn/portal';
} else if (window.location.host.startsWith('saas')) {
    portalUrl = 'https://sso.27aichi.com/portal';
} else {
    portalUrl = 'http://dev-sso.27aichi.cn/portal';
}

module.exports = {

    'logoutUrl': logoutUrl,
    'portalUrl': portalUrl,
    "linkOrigin": prefixUrl,
    "config": {

        /*通用msg code*/
        //系统异常 公共
        MSGCODE_SYSTEMERROR: "500",
        //成功 公共
        MSGCODE_SUCCESS: "200",
        //用户名不存在 公共
        MSGCODE_USERNOTEXIST: "201",
        //输入密码有误  5次机会
        MSGCODE_PASSWORDERROR: "202",
        //强制下线  公共
        MSGCODE_FORCEOFFLINE: "203",
        //token 过期  公共
        MSGCODE_TOKENVOERDUE: "204",
        //验证码生成异常 验证码
        MSGCODE_VERIFICATIONCODEEXCEPTION: "205",
        //验证码错误 验证码
        MSGCODE_VERIFICATIONCODEERROR: "206",
        //验证码已失效  验证码
        MSGCODE_VERIFICATIONCODEINVALID: "207",
        //角色名称重复
        MSGCODE_ROLENAMEREPETITION: "208",
        //角色id错误
        MSGCODE_ROLEIDERROR: "209",
        //该账号已被停用，请联系超级管理员！ 公共
        MSGCODE_ACCOUNTDISABLED: "210",
        //登录失败次数已达上限，请联系超级管理员或明日重试  登陆
        MSGCODE_LOGINFAILURELIMIT: "211",
        //用户已存在
        MSGCODE_USEREXISTS: "212",
        //激活码不存在或已经失效
        MSGCODE_ACTIVATIONCODEEXCEPTION: "213",
        //未激活
        MSGCODE_NOTACTIVE: "214",
        //角色有用户关联
        MSGCODE_ROLEASSOCIATION: "215",
        //用户不存在
        // MSGCODE_USERNOTEXIST:"216",
        //无权限 公共
        MSGCODE_NOPERMISSIONS: "217",
        //新增版本重复
        MSGCODE_VERSIONREPEAT: "304",


        /**
         登录相关接口
         */
        //登录接口
        loginUrl: "basic/login",
        //获取验证码接口
        captchaCodeUrl: "basic/captcha",

        //获取短信验证码接口
        captchaCodeSmsUrl: "basic/sms/getsms",

        //获取权限接口
        getPermissionsUrl: "arch/perm/get-permissions?appId=",

        //门店列表
        choseRestaurantListUrl: 'arch/perm/chose-restaurant-list',

        //选择门店
        choseRestaurantUrl: 'arch/perm/chose-restaurant',

        //统一登录页
        basicLoginUrl: "basic/login",

        //用户注册
        registerUrl: '/basic/member/register',
        //上传图片
        uploadUrl: prefixUrl + 'food-stream/upload-image?' + 'token=',
        uploadFoodImage: prefixUrl + 'food-stream/upload-food-image?',
        uploadFileUrl: prefixUrl + 'food-stream/import-food?' + 'token=',
        uploadCertUrl: prefixUrl + 'food-stream/import-cert?' + 'token=',

        //获取餐厅管理基础信息
        ctglBaseGet: 'basic/restaurant/base/get',

        cuisinesGet: 'basic/base-data/name-code/cuisines/get',

        //更新餐厅管理基础信息
        ctglBaseUpdate: 'basic/restaurant/base/update',

        //获取餐厅管理位置信息
        ctglAddressGet: 'basic/restaurant/address/get',

        //更新餐厅管理位置信息
        ctglAddressUpdate: 'basic/restaurant/address/update',

        //新增备注
        addCommentUrl: 'basic/restaurant/comment',
        //获取备注列表
        commentget: 'basic/restaurant/comment/get',
        //获取备注类型
        commentTypesUrl: 'basic/base-data/comment-types/get',
        //更新备注
        commentUpdateUrl: 'basic/restaurant/comment',
        //删除备注
        deleteCommentUrl: 'basic/restaurant/comment/delete/',

        //连锁-原因备注
        commentQuery: 'basic/hq/comment/query',//列表
        commentPost: 'basic/hq/comment/post',//新增/修改
        commentDeleteById: 'basic/hq/comment/delete-by-id',//删除
        commentCheckName: 'basic/hq/comment/checkName',//判断名称是否重复
        commentAllotComments: 'basic/hq/comment/allotComments',//原因备注下发
        storeByBrandId: 'arch/org/store-by/',//品牌id查询门店


        //获取菜品单位列表
        cpdwGetAllDWListUrl: 'food-service/unit/query',
        //菜品单位新增
        cpdwAddDwUrl: 'food-service/unit',
        //菜品单位删除
        cpdwDeleteDWUrl: 'food-service/unit/delete-by-id?id=',

        unitNameCheckUrl: 'food-service/unit/check-name',

        unitCodeCheckUrl: 'food-service/unit/check-code',
        foodUnitAllUrl: 'food-service/unit/select-data',

        //菜品信息接口
        foodqueryUrl: 'food-service/food/query',

        foodNameCheckUrl: 'food-service/food/check-name',
        foodCodeCheckUrl: 'food-service/food/check-code',
        foodAddUrl: 'food-service/food/',
        foodGetUrl: 'food-service/food/select-by-id?id=',
        foodGetMaxCodeUrl: 'food-service/food/get-max-code',
        foodComboGetMaxCodeUrl: 'food-service/combo-food/get-max-code',
        foodRecommendData: 'food-service/food/food-recommend-data/',

        //菜品导出
        exportFoodUrl: prefixUrl + 'food-stream/export-food',

        //删除菜品
        foodDeleteUrl: 'food-service/food/delete-by-id?id=',
        // batch delete
        foodBatchDeleteUrl: 'food-service/food/batch-delete',

        //获取收银端菜品排序列表接口
        foodCateList: 'food-service/category/sort',
        // 收银端菜品列表排序接口
        foodCateSort: 'food-service/category/sort/move',
        //收银端菜品列表展开分类接口
        foodSubcateList: 'food-service/category/food/sort',
        foodSubCateSort: 'food-service/category/food/sort/move',

        //扫码点餐菜品菜类排序接口
        ScanfoodCateList: 'food-service/category/oos/sort',
        ScanfoodCateSort: 'food-service/category/oos/sort/move',
        ScanfoodSubcateList: 'food-service/category/oos/food/sort',
        ScanfoodSubCateSort: 'food-service/category/oos/food/sort/move',

        //连锁菜品排序
        foodCateList1: 'food-service/hq/category/sort',
        foodCateSort1: 'food-service/hq/category/sort/move',
        foodSubcateList1: 'food-service/hq/category/food/sort',
        foodSubCateSort1: 'food-service/hq/category/food/sort/move',
        ScanfoodCateList1: 'food-service/hq/category/oos/sort',
        ScanfoodCateSort1: 'food-service/hq/category/oos/sort/move',
        ScanfoodSubcateList1: 'food-service/hq/category/oos/food/sort',
        ScanfoodSubCateSort1: 'food-service/hq/category/oos/food/sort/move',


        //打印机管理
        printCategoryList: 'food-service/print-category/query',
        printCategoryNew: 'food-service/print-category',
        printCategoryCheckN: 'food-service/print-category/check-name',
        printCategoryCheckC: 'food-service/print-category/check-code',
        printCategoryDelete: 'food-service/print-category/delete-by-id',
        printFoodList: 'food-service/category/foods-print-category',
        printFoodEdit: 'food-service/print-category/update-food-print-category',
        //退菜明细表接口
        tuiCaiMxbBase: 'basic/store/token/listHierarchy',
        tuiCaiMxbDate: 'basic/store/token/list',
        tuiCaiMxbTotal: 'report-api/report/retreat/stat',
        tuiCaiMxbList: 'report-api/report/retreat/detail',

        //计件统计表
        brandStat: 'report-api/report/piece/brand-stat', //计件统计表统计数据
        brandDetail: 'report-api/report/piece/brand-detail', //计件统计表明细数据
        resDetail: 'report-api/report/piece/res-detail', //门店计件明细数据
        employeeDetail: 'report-api/report/piece/employee-detail', //几人计件明细数据

        //免单明细表
        freeDetail: 'report-api/report/free/detail',
        //反结账报表
        recashDetail: 'report-api/report/recash/detail',
        recashInfo: 'report-api/report/recash/info',
        //退菜赠菜明细表
        giftStat: 'report-api/report/gift/stat',
        giftDetail: 'report-api/report/gift/detail',
        //每日菜品销量排行分析表
        fooddayDetail: 'report-api/report/foodday/detail',

        //现金报表分析
        financeDay: '/report-api/report/finance/day',
        financeDayIn: 'report-api/report/finance/day-in',
        financeDaySelect: 'report-api/report/finance/day-select',
        financeMonth: 'report-api/report/finance/month',
        financeMonthIn: 'report-api/report/finance/month-in',
        financeMonthSelect: 'report-api/report/finance/month-select',
        financedayExport: 'report-api/report/export/financeday', //现金日报导出
        financemonthExport: 'report-api/report/export/financemonth', //现金月报导出

        selectWaiterGroup: 'basic/user/waiter/selectWaiterGroup', //获取员工组别下拉列表

        tuiCaiMxbTotal1: 'report-api/report/foodcategory/stat',
        tuiCaiMxbList1: 'report-api/report/foodcategory/detail',

        //系统设置
        systemSettingBase: 'basic/store/settingShop/get',
        systemSettingSave: 'basic/store/settingShop/set',
        systemSettingReset: 'basic/store/settingShop/reset',

        //可售清单
        sellTimeUrl: 'food-service/selltime/select-all',
        //新增可售清单
        sellTimeAddUrl: 'food-service/selltime/add-update',

        //
        sellFoodComboUrl: 'food-service/selltime/select-all-combo',

        sellFoodUrl: 'food-service/selltime/select-all-food',

        sellFoodDeleteUrl: 'food-service/selltime/delete-by-id?id=',

        sellFoodSelectFoodUrl: 'food-service/selltime/select-food?sellTimeId=',

        sellFoodSelectComboUrl: 'food-service/selltime/select-combo?sellTimeId=',


        //菜品分类接口
        //新增菜品分类
        cpflAddUrl: "food-service/category",

        foodCategoryQueryUrl: 'food-service/category/query',

        //删除菜品分类
        foodCategoryDeleteUrl: 'food-service/category/delete-by-id?id=',

        foodCategoryAllUrl: 'food-service/category/select-data',

        //规格列表
        foodSpecQueryUrl: 'food-service/spec/query',

        foodSpecAllUrl: 'food-service/spec/select-data',

        //新增规格
        foodSpecAddUrl: 'food-service/spec',

        //删除规格
        foodSpecDeleteUrl: 'food-service/spec/delete-by-id?id=',

        //检查规格名称是否存在
        specNameCheckUrl: 'food-service/spec/check-name',

        //删除做法
        foodMethodDeleteUrl: 'food-service/method/delete-by-id?id=',

        //做法列表
        foodMethodQueryUrl: 'food-service/method/query',

        foodMethodAllUrl: 'food-service/method/select-data',
        //新增修改做法
        addFoodMethodUrl: 'food-service/method',

        methodNameCheckUrl: 'food-service/method/check-name',


        //套餐列表
        foodComboQueryUrl: 'food-service/combo-food/query',
        // 检查套餐名字是否重复
        checkPackageNameUrl: "food-service/combo-food/check-name",

        // 检查套餐编码是否重复
        checkPackageCodeUrl: "food-service/combo-food/check-code",


        //新增套餐
        foodComboAddUrl: 'food-service/combo-food',

        //根据id查询套餐信息
        foodComboByIdUrl: 'food-service/combo-food/select-by-id?id=',

        printCategoryUrl: 'food-service/print-category/select-data',


        //删除套餐
        foodComboDeleteUrl: 'food-service/combo-food/delete-by-id?id=',


        //根据菜类Id查菜品
        foodByCategoryUrl: 'food-service/category/foods-combo?id=',

        //获取省列表
        basedataProvincesGet: 'arch/base/provinces/get',

        //获取市列表
        basedataCityGet: 'arch/base/cities/get',

        //获取县列表
        basedataCountriesGet: 'arch/base/counties/get',

        // 折扣管理页面接口开始
        discountUrl: "food-service/discount/query", // 请求折扣管理列表数据
        caiPinSelectUrl: "food-service/category/select-data", // 菜品下拉框数据
        delDiscountRowUrl: "food-service/discount/delete-by-id", // 删除折扣管理列表中的数据
        foodProducts: "food-service/category/foods-discount", // 根据菜类id请求对应的菜品
        addDiscountUrl: "food-service/discount", //新增折扣
        findPackageData: "food-service/combo-food/select-data", //查询套餐数据
        getDiscountDetailUrl: "food-service/discount/select-by-id", //查询折扣详情
        getAllDiscountListUrl: "food-service/discount/select-by-id", //新增和修改时获取数据，query传参
        checkNameUrl: "food-service/discount/check-name", //新增或者修改时验证名字是否已经存在

        //支付管理模块开始
        getpayListUrl: "basic/pay-method/get", //获得支付管理列表
        addPayMethod: "basic/pay-method/add", //新增支付方式
        deletePayMethod: "basic/pay-method/delete/", //删除支付方式注意后面要接一个{payMethodId},不是键值对也不是query方式，如.../5
        editPayMethod: "basic/pay-method/modify/", //修改支付方式注意后面要接一个{payMethodId},不是键值对也不是query方式
        checkPayNameUrl: "basic/pay-method/checkoutName", //检查支付名称是否存在过
        getPayDetail: "basic/pay-method/", //点击修改获得对应数据的详情,注意拼接一个{payMethodId}

        //连锁-支付管理
        payTypeQuery: 'basic/hq/pay-type/query',//支付管理列表
        payTypePost: 'basic/hq/pay-type/post',//添加修改支付方式
        payTypeCheckName: 'basic/hq/pay-type/check-name',//检查支付名称是否存在过
        payTypeDeleteById: 'basic/hq/pay-type/delete-by-id',//根据id删除支付方式
        payTypeAllotPayMethod: 'basic/hq/pay-type/allot-pay-method',//连锁方式下发
        payTypeSelectById: 'basic/hq/pay-type/select-by-id',//根据id获取详情

        // 获取员工管理列表
        userWaitersListUrl: 'basic/user/waiters/list',
        // 职级的列表

        userWaiterGroupsUrl: 'basic/base-data/name-code/waiter/groups/get',
        // 添加员工POST /basic/user/waiter/
        userWaiterAddUrl: 'basic/user/waiter/add',
        userWaiterGetUrl: 'basic/user/waiter/get/',
        userWaiterUpdateUrl: 'basic/user/waiter/update/',
        userWaiterDeleteUrl: 'basic/user/waiter/delete/',
        // 组别管理
        allPowerUrl: 'basic/base-data/powers/get',
        userGroupUrl: 'basic/user/group/list',
        userGroupAddUrl: 'basic/user/group/add',
        userGroupUpdateUrl: 'basic/user/group/update/',
        userGroupDeleteUrl: 'basic/user/group/delete/',
        userGroupGetUrl: 'basic/user/group/get/',
        /*
         * 餐台管理 start*/
        // 餐台列表
        tableListUrl: 'basic/table/list',
        //区域列表
        regionListUrl: 'basic/table/region/list',
        //更新table
        updateTableListUrl: 'basic/table/update',
        //更新区域
        updateRegionUrl: 'basic/table/region',
        //添加table
        addTableUrl: 'basic/table/add',
        //删除table
        deleteTableUrl: 'basic/table/delete',
        //添加region
        addRegionUrl: 'basic/table/region/add',
        //批量添加table
        groupAddTableUrl: 'basic/table/batch-add',
        //获取餐厅人员下拉列表
        getWaitersUrl: 'basic/user/waiter/getUserSelect',
        //修改区域
        editRegionsUrl: 'basic/table/region',
        //删除区域
        deleteRegionUrl: 'basic/table/region/delete',
        /**
         * 餐台管理 end */

        /*扫码点餐 start*/
        getQrCodeList: 'basic/table/indexList', //'basic/table/list',//'wechat/subscribe/qrCodeList',
        getWxUrl: 'wxopen/get_gzh_auth_url', //获取微信url
        getPageImgUrl: 'weixin/cover/', //'wechat/subscribe/viewCoverSet',//获取封面url
        savePageImgUrl: 'weixin/cover/add', //'wechat/subscribe/addCoverSet',//添加更新封面
        deletePageImgurl: 'wechat/subscribe/deleteCoverSet', //删除封面
        GetQrImgUrl: 'weixin/qrcode-by-id/', //获取二维码

        GetTaImgUrl: 'weixin/takeaway-code', //获取外带二维码

        weinxinQueryAuth: 'weixin/restaurant/query-auth',

        //获取微信url
        NewGetWXUrl: 'weixin/binding', //获取微信url
        //获取授权状态
        GetWXState: 'weixin/auth/query', //获取授权信息
        CancleWxUrl: 'weixin/auth/cancel', //取消授权
        DownloadQrCode: 'weixin/qrcodes.zip', //下载二维码

        //取消授权

        menuEditUpdate: 'weixin/menu/update',

        menuEditGet: 'weixin/menu?appid=',

        settingsUpdate: 'weixin/settings/update',

        settingsGet: 'weixin/settings/get',

        evSettingsUpdate: 'weixin/settings/update-comment-config',

        evSettingsGet: 'weixin/settings/get-comment-config',

        updateOrderMergeTime: 'basic/restaurant/base/update-order-merge-time/',

        getOrderMergeTime: 'basic/restaurant/base/get-order-merge-time',

        getOosBase: 'basic/restaurant/base/get-oos-base',

        updateOosBase: 'basic/restaurant/base/update-oos-base',



        /*扫码点餐 end*/


        /**
         * 会员管理相关接口
         */
        //积分规则列表
        getListScoreRule: 'score/listScoreRule',
        //删除1条积分规则
        getDelScoreRule: 'score/delScoreRule',
        //增加积分规则
        getAddScoreRule: 'score/addScoreRule',
        //修改积分规则
        getModifyScoreRule: 'score/modifyScoreRule',
        //查看积分返利规则详细信息
        getScoreRule: 'score/getScoreRule',
        //会员等级列表
        getListVipLevel: 'level/listVipLevel',

        vipDetailUrl: 'vip/web/stat/list',

        vipExportUrl: prefixUrlBase + 'vip/web/stat/export',
        /**
         * 营销活动start
         */
        //优惠券列表
        getCouponListUrl: 'marketing/coupon/getCouponList',
        //新增优惠券
        addCouponUrl: 'marketing/coupon/addCoupon',
        //优惠券详情
        getCouponUrl: 'marketing/coupon/getCoupon',
        //启用or停用
        updateCoupon: "marketing/coupon/updateCoupon",
        //优惠券发放记录
        getCouponRecordList: "marketing/coupon/getCouponRecordList",
        //评价红包列表
        evaluationList: "marketing/evaluation/getEvaluationList",
        //创建评价红包
        addEvaluation: "marketing/evaluation/addEvaluation",
        //物理删除评价红包
        delEvaluation: "marketing/evaluation/delEvalution",
        //跳转修改页面功能
        byIdEvaluation: "marketing/evaluation/getEvaluationById",
        //修改功能
        updateEvaluation: "marketing/evaluation/updateEvaluation",
        //指定菜品返积分活动列表
        getActivityList: "marketing/backIntegral/getActivityList",
        //指定菜品创建活动
        addActivity: "marketing/backIntegral/addActivity",
        //指定菜品返积分活动列表中的详情数据
        getActivity: "marketing/backIntegral/getActivity",
        //活动启用禁用功能
        updateActivity: "marketing/backIntegral/updateActivity",
        storeListUrl: 'basic/store/token/list',
        foodListUrl: 'food-service/food/query',

        saveEditUrl: "marketing/backIntegral/updateMarketing", //营销活动保存修改接口

        // 优惠券管理模块
        yhqhdListUrl: "activity/coupon/query", //优惠券列表查询
        changeYhqStatusUrl: "activity/coupon/", //优惠券列表切换优惠券状态/activity/coupon/{id}/{type}
        addYhqUrl: "activity/coupon/add", //添加优惠券
        getYhqDetailUrl: "activity/coupon/", //优惠券列表查看优惠券详情activity/coupon/{id}
        storeUrl: "arch/h5/restaurant/id-names", //餐软1.2中品牌餐厅接口
        // foodUrl: "mgr/brand/food/id-names", // 餐软1.2中菜品接口,分为3级
        foodUrl: "food-service/hq/by-company-Id/all-food-names", // longbin 新提供接口 餐软1.2中菜品接口,分为3级
        checkNameIsRepeatUrl: "activity/coupon-check/check-name", //验证优惠券名字是否重复

        /**
         * 营销活动end
         */

        //  组织机构
        orgCompanyUrl: 'basic/company/info',
        orgBrandListUrl: 'basic/company/brand/list',
        orgBrandSaveUrl: 'basic/company/brand/insertOrUpdate',
        orgAreaListUrl: 'basic/company/area/list',
        orgAreaSaveUrl: 'basic/company/area/insertOrUpdate',
        orgStoreListUrl: 'basic/store/list',
        orgStoreSaveUrl: 'basic/store/insertOrUpdate',
        orgStoreAllUrl: 'basic/store/token/list',
        orgBrandDeleteUrl: 'basic/company/brand/delete/', //品牌删除
        orgStoreDeleteUrl: 'basic/store/settingShop/delete/', //店铺删除
        orgAreaDeleteUrl: 'basic/company/area/settingShop/delete/', //区域删除
        // 报表
        billListUrl: 'report-api/report/bill/detail', // 账单明细表
        billInfoUrl: 'report-api/report/bill/info', //
        billStatUrl: 'report-api/report/bill/stat', //
        billStatExportUrl: prefixUrl + 'report-api/report/export/bill', // 账单明细表 export
        bizStatUrl: 'report-api/report/biz/stat', // 营业汇总
        bizStatDetailUrl: 'report-api/report/biz/detail', // 营业汇总表各门店数据
        bizStatExportUrl: prefixUrl + 'report-api/report/export/biz', // 营业汇总表各门店数据 export
        payStatUrl: 'report-api/report/pay/stat', // 付款类型汇总
        payStatDetailUrl: 'report-api/report/pay/detail', // 付款类型汇总表各门店数据
        payStatExportUrl: prefixUrl + 'report-api/report/export/pay', // 付款类型汇总表各门店数据 export

        bizRestaurant: 'report-api/report/biz/restaurant', //营业汇总表各门店数据 修改
        bizRestaurantExport: prefixUrl + 'report-api/report/export/biz/restaurant', //营业汇总表各门店数据 export 修改


        bizDay: 'report-api/report/biz/day', //营业明细表 新增
        bizDayExport: prefixUrl + 'report-api/report/export/biz/day', //营业明细表 export

        //时段分析
        analyseFoodDetail: 'report-api/report/analyse/food-detail',
        analyseFoodStat: 'report-api/report/analyse/food-stat',
        analyseResDetail: 'report-api/report/analyse/res-detail',
        analyseResStat: 'report-api/report/analyse/res-stat',
        brandAllFood: 'food-service/brand-all-food',
        brandAllFoodNames: 'food-service/brand-all-food-names',
        brandAllComboNames: 'food-service/brand-all-combo-names',
        brandAllFoodSpec: 'food-service/brand-all-food-spec',

        //优免汇总表
        discountRestaurant: 'report-api/report/discount/restaurant',
        exportDiscountRestaurant: prefixUrl + 'report-api/report/export/discount/restaurant',

        //外卖报表接口
        takeoutBizDetail: 'report-api/report/takeout/biz/detail',
        takeoutBizStat: 'report-api/report/takeout/biz/stat',
        takeoutFoodDetail: 'report-api/report/takeout/food/detail',
        takeoutFoodStat: 'report-api/report/takeout/food/stat',
        takeoutOrderDayDetail: 'report-api/report/takeout/order/day-detail',
        takeoutOrderDayStat: 'report-api/report/takeout/order/day-stat',
        takeoutOrderMonthDetail: 'report-api/report/takeout/order/month-detail',
        takeoutOrderMonthStat: 'report-api/report/takeout/order/month-stat',
        takeoutFoodRealRecv:'report-api/report/takeout/food_real_recv',
        //外卖报表导出接口
        exportTakeoutBiz: prefixUrl + 'report-api/report/export/takeout/biz',
        exportTakeoutDayOrder: prefixUrl + 'report-api/report/export/takeout/day-order',
        exportTakeoutFood: prefixUrl + 'report-api/report/export/takeout/food',
        exportTakeoutMonthOrder: prefixUrl + 'report-api/report/export/takeout/month-order',
        exportTakeoutFoodRealRecv: prefixUrl + 'report-api/report/export/takeout/food_real_recv',

        //单品销售表接口
        foodSellUrl: 'report-api/report/foodsell/detail',
        combosellList: 'report-api/report/combosell/detail',
        combosellStat: 'report-api/report/combosell/stat',
        foodsellStat: 'report-api/report/foodsell/stat',

        changeWorkUrk: 'report-api/report/duty/detail', //换班报表
        getStoreParm: '/basic/store/token/list', //根据token获取门店信息


        comboByBrandId: 'food-service/brand-all-combo-names-byBrandId',//查询品牌下套餐的名称通过品牌id
        comboByRestaurantIds: 'food-service/brand-all-combo-names-byRestaurantIds',//查询品牌下套餐的名称通过restaurantIds
        foodByBrandId: 'food-service/brand-all-food-names-byBrandId',//查询品牌下菜品的名称（仅菜品）通过品牌id
        foodByRestaurantIds: 'food-service/brand-all-food-names-byRestaurantIds',//查询品牌下菜品的名称（仅菜品）通过restaurantIds
        specByBrandId: 'food-service/brand-all-food-spec-byBrandId',//查询品牌下菜品的名称 带规格 通过品牌id
        specByRestaurantIds: 'food-service/brand-all-food-spec-byRestaurantIds',//查询品牌下菜品的名称 带规格 通过restaurantIds

        categorySelectDataByRes: 'food-service/category/selectData-byRes',//查询品牌下菜类的名称通过门店ids
        categorySelectDataByBrandId: 'food-service/hqcategory-for-report/selectData-by-brandId',//根据品牌id查询所有菜类
        foodSelectDataByBrandId: 'food-service/hq/selectData-by-brandId',//根据品牌id查询所有菜品（带规格）

        //删除会员等级
        getDeleteVipLevel: 'level/delVipLevel',
        //增加会员等级
        getAddVipLevel: 'level/addVipLevel',
        //查看会员等级详细信息
        getVipLevel: 'level/getVipLevel',
        //修改会员等级
        getModifyVipLevel: 'level/modifyVipLevel',
        //根据手机号查询会员信息
        getMemberInfo: 'member/getMemberInfo',
        //根据手机号查询会员消费记录
        getConsumeList: 'member/getConsumeList',
        //上传审核文件
        getUploadImg: 'vipCard/uploadImg',
        //退卡申请
        getApplyBackCard: 'vipCard/applyBackCard',
        // 会员审核列表
        getListOpBackCard: 'vipcard/listOpBackCard',
        //消费明细列表
        consumeList: 'statistical/consumeList',
        //购卡明细列表
        getVipCardList: 'statistical/vipCardList',
        //积分清算列表
        getScoreList: 'statistical/storeScoreList',


        // 触摸屏管理
        touchListUrl: "basic/touchscreen/list", //触摸屏管理列表查询
        addTouchListUrl: "basic/touchscreen/add", //新增触摸屏
        deltouchUrl: "basic/touchscreen/delete/", //删除触摸屏后面接一个{touchscreenId}
        editTouchUrl: "basic/touchscreen/update/", //编辑完成后保存触摸屏信息

        // 触摸屏管理员工部分
        useIdGetStaffList: "basic/touchscreen/listUser/", //根据触摸屏id查询员工列表，地址后面要接一个id
        getModalStaffList: "basic/user/waiter/getwaiterList", //点击选择店员请求modal中的员工列表，所有数据一起给，不分页请求
        addModalStaffToList: "basic/touchscreen/batch-addTouchscreenUser", //添加触摸屏与人员关系表
        delStaffData: "basic/touchscreen/deleteTouchscreenUser/", //删除员工管理列表中的员工


        //厨房管理
        kitchenNew: 'basic/kitchen/add', //新增厨房
        addKitchenFood: 'basic/kitchen/batch-addKitchenFood', //添加厨房与产品的关系表
        kitchenDelete: 'basic/kitchen/delete/', //删除厨房
        kitchenGet: 'basic/kitchen/kitchenPrint/get/', //查询厨房详情
        kitchenList: 'basic/kitchen/list', //查询厨房
        kitchenUpdate: 'basic/kitchen/update/', //修改厨房
        touchscreenList: 'basic/touchscreen/allList', //根据厨房查询触摸屏
        deleteFood: 'basic/kitchen/deleteFood/', //根据产品id删除产品
        kitchenFoodList: 'basic/kitchen/kitchenFoot/get/', //查询厨房的产品
        kitchenFoodAll: 'basic/kitchen/food/kitchenFoodList', //菜品选择查询不分页
        storeFoodAll: 'basic/kitchen/food/all', //门店所有菜品
        storeFoodChoosed: 'basic/kitchen/food/chose', //门店已选菜品

        //广告管理
        AddAvertUrl: 'ad/adPhoto/add', //添加广告
        DeleteAvertUrl: 'ad/adPhoto/delete', //删除广告
        GetAvertUrl: 'ad/adPhoto/list', //获取列表
        UpdateAvertUrl: 'ad/adPhoto/update', //更新广告

        //
        printerList: 'food-service/print-category/select-data', //获取打印机分类
        printerTable: 'basic/print/printList', //查询打印机
        printerUpdate: 'basic/print/update', //更新打印机
        printerDelete: 'basic/print/delete/', //删除打印机
        printerchoosedD: 'basic/print/getPrintCategoryRelation/', //查询已经选择的出品部门
        printerchoosedL: 'basic/print/getPrintSortRelation/', //查询已经选择的打印类型

        //微信公众号授权开放平台相关接口
        weixinAuth: 'weixin/auth/', //品牌授权情况
        weixinBinded: 'weixin/binded/', //品牌下已授权门店
        mpBind: 'weixin/mp/bind', //授权公众号，重定向到微信授权页
        mpBindCancel: 'weixin/mp/bind/cancel', //取消授权
        mpBindUpdate: 'weixin/mp/bind/update', //更新授权
        weixinUnbind: 'weixin/unbind/', //品牌下可授权门店

        //导出交班信息表
        ExportJBForm: 'report-api/report/duty/duty-export', //导出交班信息表

        //百度地图获取经纬度接口
        bdMapGetLatLng: 'basic/restaurant/address/getlnglat/',

        companyManagerOWNUrl: 'mgr/company/companyManagerOWN',

        queryforstorelist: 'api/activity/query-for-store-list', //营销活动
        activityCreateUrl: 'activity/activity/add', //创建营销活动--会员有礼
        activityQueryUrl: 'activity/activity/query', //营销活动管理列表接口
        activityDetailUrl: 'activity/activity/', //营销活动管理详情 {id}
        activityOpenCloseUrl: 'activity/activity/', //活动启用/停用{id}/{type}
        activityStatUrl: 'activity/activity/stat', //活动概况
        getYouHuiQuanListUrl: "activity/coupon/query-sso-commerce", //会员有礼form表单中优惠券列表

        //菜品运营类别
        operateCategoryList: 'food-service/hq/operateCategory/query',
        operateCategoryDeleteById: 'food-service/hq/operateCategory/deleteById?id=',
        operateCategoryAddOrEdit: 'food-service/hq/operateCategory/addOrEdit',
        operateCategorySelectById: 'food-service/hq/operateCategory/selectById',
        operateCategorySelectFoods: 'food-service/hq/operateCategory/selectFoods',
        operateCategoryAllUrl: 'food-service/hq/category/select-data',

        //连锁菜品

        //菜品信息接口
        hqFoodqueryUrl: 'food-service/hq/food/query',
        hqFoodNameCheckUrl: 'food-service/hq/food/check-name',
        hqFoodCodeCheckUrl: 'food-service/hq/food/check-code',
        hqFoodAddUrl: 'food-service/hq/food/',
        hqFoodGetUrl: 'food-service/hq/food/select-by-id?id=',
        hqFoodGetMaxCodeUrl: 'food-service/hq/food/get-max-code',
        hqFoodComboGetMaxCodeUrl: 'food-service/hq/combo-food/get-max-code',
        hqFoodRecommendData: 'food-service/hq/food/food-recommend-data/',
        exportHqFoodUrl: prefixUrl + 'food-stream/export-food',
        hqFoodDeleteUrl: 'food-service/hq/food/delete-by-id?id=',
        hqFoodBatchDeleteUrl: 'food-service/hq/food/batch-delete',
        hqFoodAllot2restaurantUrl: 'food-service/hq/food/allot2restaurant',

        //套餐信息接口
        hqFoodComboQueryUrl: 'food-service/hq/combo-food/query',
        hqComboCheckPackageNameUrl: "food-service/hq/combo-food/check-name",
        hqComboCheckPackageCodeUrl: "food-service/hq/combo-food/check-code",
        hqFoodComboAddUrl: 'food-service/hq/combo-food',
        hqFoodComboByIdUrl: 'food-service/hq/combo-food/select-by-id?id=',
        hqComboPrintCategoryUrl: 'food-service/hq/print-category/select-data',
        hqFoodComboDeleteUrl: 'food-service/hq/combo-food/delete-by-id?id=',
        hqFoodByCategoryUrl: 'food-service/hq/category/foods-combo?id=',
        hqFoodComboGetMaxCodeUrl: 'food-service/hq/combo-food/get-max-code',
        hqFoodComboAllot2restaurantUrl: 'food-service/hq/combo-food/allot2restaurant',


        //菜品分类接口
        hqFoodCategoryAllUrl: 'food-service/hq/category/select-data',
        hqFoodCategoryQueryUrl: 'food-service/hq/category/query',
        hqCpflAddUrl: "food-service/hq/category",
        hqFoodCategoryDeleteUrl: 'food-service/hq/category/delete-by-id?id=',

        //菜品单位接口
        hqFoodUnitAllUrl: 'food-service/hq/unit/select-data',
        hqCpdwGetAllDWListUrl: 'food-service/hq/unit/query',
        hqCpdwAddDwUrl: 'food-service/hq/unit',
        hqCpdwDeleteDWUrl: 'food-service/hq/unit/delete-by-id?id=',
        hqUnitNameCheckUrl: 'food-service/hq/unit/check-name',
        hqUnitCodeCheckUrl: 'food-service/hq/unit/check-code',

        //规格管理接口
        hqFoodSpecAllUrl: 'food-service/hq/spec/select-data',
        hqFoodSpecQueryUrl: 'food-service/hq/spec/query',
        hqFoodSpecAddUrl: 'food-service/hq/spec',
        hqFoodSpecDeleteUrl: 'food-service/hq/spec/delete-by-id?id=',
        hqSpecNameCheckUrl: 'food-service/hq/spec/check-name',

        //做法管理接口
        hqFoodMethodQueryUrl: 'food-service/hq/method/query',
        hqAddFoodMethodUrl: 'food-service/hq/method',
        hqFoodMethodDeleteUrl: 'food-service/hq/method/delete-by-id?id=',
        hqMethodNameCheckUrl: 'food-service/hq/method/check-name',

        //口味标签接口
        hqFoodLabelQueryUrl: 'food-service/hq/laber/query',
        hqAddFoodLabelUrl: 'food-service/hq/laber',
        hqFoodLabelDeleteUrl: 'food-service/hq/laber/deleteById?id=',
        hqLabelNameCheckUrl: 'food-service/hq/laber/checkName',
        hqLabelDetailNameCheckUrl: 'food-service/hq/detail/checkByName',
        hqLabelDetailUrl: 'food-service/hq/laber/selectById?id=',
        hqLabelDetailAddUrl: 'food-service/hq/detail',
        hqFoodLabelDetailDeleteUrl: 'food-service/hq/detail/deleteById?id=',
        hqLabelDetailIsDefaultUrl: 'food-service/hq/detail/detailIsDefault?laberDetailId=',
        hqLabelAllUrl: 'food-service/hq/laber/selectAll',

        //菜品排序
        restaurants_yzy: 'arch/org/restaurants/select-by-brand',
        allot2restaurant_yzy: 'food-service/hq/sort/allot2restaurant',
        //菜品排序
        restaurants_yzy: 'arch/org/restaurants/select-by-brand',
        allot2restaurant_yzy: 'food-service/hq/sort/allot2restaurant',
        selectAllRestaurant: 'food-service/selltime/select-all-restaurant',

        selectBusinessHours: 'food-service/selltime/select-business-hours',

        //连锁菜品品牌列表
        brandListUrl: 'arch/brand/list-by-user-power',

        //门店列表（树形）
        userPower: 'arch/org/load-tree/user-power',
        listByUserPower: 'arch/brand/list-by-user-power',

        //门店列表（树形）
        userPower: 'arch/org/load-tree/user-power',
        // 选择品牌后根据品牌 id调取门店
        chooseBrandUrl: 'arch/perm/chose-brand?brandId=',

        restaurantInfoUrl: 'arch/org',

        /*连锁菜品弹框 start*/
        pullFoodList: "food-service/hq/food/pull-food-list",
        pullToRestaurant: "food-service/hq/food/pull2restaurant",

        /*套餐*/
        comboFoodList: "food-service/hq/combo-food/pull-combo-food-list",
        comboPullToRestaurant: "food-service/hq/combo-food/pull2restaurant",
        /*连锁菜品弹框   end*/

        // 连锁运营
        getBdStateUrl: "waimai/restaurant/query-auth-type",//获取当前授权模式
        updateBdStateUrl: "waimai/restaurant/update-auth-type/",//更新授权模式/api/waimai/restaurant/update-auth-type/{type}

        // 外卖餐厅-----门店绑定模块
        getStoreInfoUrl: "waimai/restaurant/get", // ***查看门店信息
        getIframeStoreMapUrl: "waimai/restaurant/get-store-map-param", //***提供门店映射请求地址
        storeOpenOrCloseUrl: "waimai/restaurant/open-or-close", //门店营业或休息
        getMenDianStatusUrl: "waimai/restaurant/query-status", //***门店状态信息查询
        changeStoreTimeUrl: "waimai/restaurant/update-open-time", //***修改门店营业时间
        jiebangStoreUrl: "waimai/restaurant/get-store-release-param", //提供门店解绑请求地址
        getElmSqIframeUrl: "waimai/restaurant/get-auth-url", //获取饿了么授权iframe地址
        elmModalStoreListUrl: "waimai/restaurant/get-auth-shops",//获取饿了么可选则的门店列表
        saveLinkStoreUrl: "waimai/restaurant/save-auth-shop", //饿了么modal保存绑定门店

        // 外卖餐厅-----订单管理模块
        getStatisticsDataUrl: "waimai/order/statistics", //获取订单管理tab统计数据
        getOrderListUrl: "waimai/order/list", //获取订单管理订单数据
        getOrderDetailUrl: "waimai/order/get", //获取订单详情
        getOrderPlatformListUrl: "waimai/restaurant/select-option", //后端根据网关获取外卖平台可选项
        getOrderStateListUrl: "waimai/restaurant/order-state-option", //订单状态列表
        getDeliveryStateListUrl: "waimai/restaurant/delivery-state-option", //配送状态选择列表


        // 外卖餐厅-----饿了么菜品映射
        getElmFoodListUrl: "waimai/food/query-waimai-food", //获取饿了么菜品列表
        getErpFoodListUrl: "waimai/food/query-erp-food", //查询菜品映射ERP系统所有菜品（美团|饿了么共用）
        saveFoodErpToElmUrl: "waimai/food/save-food-ref", //饿了么确定关联接口
        delFoodErpToElmUrl: "waimai/food/delete-food-ref", //饿了么删除关联菜品接口
        getMeiTuanYingSheUrl: "waimai/food/food-map", //获得美团菜品映射地址

        /* =============================*/
        sendManageAddUpdate: 'food-service/send-manage/add-update',//通知保存或更新
        sendManageDeleteById: 'food-service/send-manage/delete/by-id',//删除通知
        sendManageQueryByBrandId: 'food-service/send-manage/query/by-brand-id',//通知查询

        //后厨任务-连锁任务
        chaintaskTaskAdd: 'basic/chaintask/task/add',//新增任务
        chaintaskTaskDelete: 'basic/chaintask/task/delete/',//删除任务
        chaintaskTaskList: 'basic/chaintask/task/list',//任务列表不分页
        chaintaskTaskPage: 'basic/chaintask/task/page',//任务列表
        chaintaskTaskSelect: 'basic/chaintask/task/select/',//查询任务
        chaintaskTaskUpdate: 'basic/chaintask/task/update',//编辑任务
        //selectByBrandId:'food-service/hq/food/selectByBrandId',//获取品牌下的所有菜品
        selectByBrandId: 'food-service/hq/food/get-brand-food',
        chaintaskTaskDetail:'basic/chaintask/task/detail',//任务详情

        //后厨任务-连锁方案
        chainprogrammeAdd: 'basic/chainprogramme/add',//新增方案
        chainprogrammeDetele: 'basic/chainprogramme/detele/',//删除方案
        chainprogrammeList: 'basic/chainprogramme/list',//方案列表
        chainprogrammeQuery: 'basic/chainprogramme/query-one/',//方案详情
        queryRestaurantInfo: 'basic/chainprogramme/queryRestaurantInfo/',//选择方案使用门店
        choseProgramme: 'basic/chainprogramme/restaurantChose/choseProgramme',//门店已有任务
        choseProgrammeKitchen: 'basic/chainprogramme/restaurantChose/choseProgrammeKitchen/',//门店已选方案
        chainprogrammeRestaurantList: 'basic/chainprogramme/restaurantList',//门店方案统计列表
        chainprogrammeUpdate: 'basic/chainprogramme/update',//修改方案

        programmeDetail: 'basic/chainprogramme/get/programme-detail',//店铺任务方案详情

        restaurantChoseChoseProgrammeKitchen: 'basic/chainprogramme/restaurantChose/choseProgrammeKitchen',//保存厨房配置的任务
        deleteChoseProgrammeKitchen: 'basic/chainprogramme/restaurantChose/delete-choseProgrammeKitchen',//删除厨房配置的任务
        selectProgrammeKitchenId: 'basic/chainprogramme/restaurantChose/selectProgrammeKitchenId',//查看厨房已有任务
        restaurantChoseSeleteTask: 'basic/chainprogramme/restaurantChose/selete-task',//查看厨房可选择的任务

        restaurantChoseCheckName: 'basic/chainprogramme/restaurantChose/check-name',//方案名称的校验
        chaintaskTaskCheckName: 'basic/chaintask/task/check-name',//任务名称的校验

        //审计账单查询
        auditBillsPayDetail: 'gaea/audit-bills/pay-detail',//消费详情分页查询
        auditBillsRefundDetail: 'gaea/audit-bills/refund-detail',//退款详情分页查询
        storeMemshipByTheDay: 'gaea/audit-bills/store-memship/by-the-day',//店铺会籍费查询
        storeByTheDay: 'gaea/audit-bills/store/by-the-day',//店铺收单查询
        getStoreInfo: 'gaea/audit-bills/get-store-info',//店铺信息查询
        receivablesList: 'gaea/receivables/list',//获取所有的收款类型

        auditBillsExportDetail:prefixUrl+'gaea/audit-bills/export-detail',//消费详情导出
        auditBillsExportRefundDetail:prefixUrl+'gaea/audit-bills/export-refund-detail',//退款详情导出
    
        // 餐厅营销

        getEnterpriseListUrl: "basic/corporateDiscount/query-list", //查询企业列表
        addEnterpriseUrl: "basic/corporateDiscount/addCompany", //添加企业
        getEnterpriseDetailUrl: "basic/corporateDiscount/queryone/", //拿到企业详情 basic/corporateDiscount/queryone/{id}
        saveEditEnterpriseUrl: "basic/corporateDiscount/update/", //保存编辑的企业 basic/corporateDiscount/update/{id}
        getStaffListUrl: "basic/corporateDiscount/queryMember", //查看员工列表/api/basic/corporateDiscount/queryMember/{zyCompanyId}

        // 业务配置
        queryTakeoutSate: 'basic/store/settingShop/queryTakeoutSate',
        setHomeTakeoutState: 'basic/store/settingShop/setHomeTakeoutState',
        setPackageTakeoutState: 'basic/store/settingShop/setPackageTakeoutState',

        zyTakeoutAddConfig: 'basic/zyTakeout/addConfig',
        zyTakeoutUpdateConfig: 'basic/zyTakeout/updateConfig/',
        zyTakeoutQueryConfig: 'basic/zyTakeout/queryConfig',

        //资金流水
        fundBillDetail: 'gaea/fund-bill/detail',//详情分页查询
        fundBillStore: 'gaea/fund-bill/store',//门店账户查询
        fundBillExport:prefixUrl+'gaea/fund-bill/export',//详情导出

        getTouchScreen: 'basic/video/get-touch-screen',
        videoSet: 'basic/video/set',
        videoGet: 'basic/video/get',

        storeById: 'arch/org/store-by/',
        roleTabDataUrl: "arch/user/user-org", //用户框数据

        // 连锁运营---连锁企业协议
        getStroeListUrl: "basic/hq-corporateDiscount/query-restaurant-by-brandId", //连锁获取所有门店列表，王奇单独提供的
        getStoreListByBrandIdUrl: "arch/org/store-by/", //连锁企业协议根据品牌获取门店列表 /api/arch/org/store-by/{brandId}
        saveLsEnterpriseUrl: "basic/hq-corporateDiscount/addCompany", //保存连锁企业
        getLsEnterpriseListUrl: "basic/hq-corporateDiscount/query", //获取连锁协议企业列表
        getLsStaffListUrl: "basic/hq-corporateDiscount/queryMember", //查看员工列表
        getLsEnterpriseDetailUrl: "basic/hq-corporateDiscount/select-by-id?id=", //拿到连锁企业详情
        checkCanLoadUrl: "weixin/check-can-load", //判断是否能下载二维码
    },


    httpPostByBase: async function (url, payload) {

        //payload.token = getUserToken();


        return request(prefixUrlBase + url, {
            method: 'post',
            body: JSON.stringify(parse(payload)),
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

    },

    httpPostWithOnlyId: async function (url, payload, id) {

        //payload.token = getUserToken();

        return request(prefixUrl + url + "?id=" + id, {
            method: 'post',
            body: JSON.stringify(parse(payload)),
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

    },
    httpPostWithId: async function (url, payload, id) {

        //payload.token = getUserToken();

        return request(prefixUrl + url + '/' + id, {
            method: 'post',
            body: JSON.stringify(parse(payload)),
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

    },
    httpPostWithIds: async function (url, payload, id, regionName, seatNum, remark) {

        //payload.token = getUserToken();

        return request(prefixUrl + url + '/' + id + "?regionName=" + regionName + "&seatNum=" + seatNum + "&remark=" + remark, {
            method: 'post',
            body: JSON.stringify(parse(payload)),
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

    },

    httpPost: async function (url, payload) {

        //payload.token = getUserToken();


        return request(prefixUrl + url, {
            method: 'post',
            body: JSON.stringify(parse(payload)),
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

    },

    httpPostWithParam: async function (url, payload, id) {

        //payload.token = getUserToken();

        return request(prefixUrl + url + id, {
            method: 'post',
            body: JSON.stringify(parse(payload)),
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

    },

    httpPostNoParam: async function (url, payload) {


        return request(prefixUrl + url, {
            method: 'post',
            body: JSON.stringify(parse(payload)),
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
    },


    httpPostByIds: async function (url, brandId, restaurantId) {

        return request(prefixUrl + url + "?brandId=" + brandId + "&restaurantId=" + restaurantId, {
            method: 'post',
            body: '',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

    },
    httpPostById: async function (url, payload, id) {

        //payload.token = getUserToken();

        return request(prefixUrl + url + '/' + id, {
            method: 'post',
            body: JSON.stringify(parse(payload)),
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });

    },

    delay: async function (timeout) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }


}