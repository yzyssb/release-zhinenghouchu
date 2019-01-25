import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, Redirect } from 'dva/router';
import 'antd/dist/antd.less';
import '../customized/antd.less';


import LoginPage from './routes/base/usercenter/login/Login';

import Welcome from './routes/base/usercenter/login/Welcome';

import CtglBaseSetting from './routes/ctgl/jcsz/CtglBaseSetting';

import CtaiglPage from './routes/ctgl/ctaigl/CtaiglPage';

import YybzPage from './routes/ctgl/yybz/YybzPage';

import CdglPage from './routes/ctgl/cdgl/CdglPage';

import CpkPage from './routes/lsyy/cpk/CpkPage';

import TzzxPage from './routes/lsyy/tzzx/TzzxPage';

import CpxxPage from './routes/ctgl/cdgl/CpxxPage';

import TcxxPage from './routes/ctgl/cdgl/TcxxPage';

import LsCpxxPage from './routes/lsyy/cpk/LsCpxxPage';

import LsTcxxPage from './routes/lsyy/cpk/LsTcxxPage';

import LsCpxxDeployPage from './routes/lsyy/cpk/LsCpxxDeployPage';

import LsTcxxDeployPage from './routes/lsyy/cpk/LsTcxxDeployPage';

import LsLabelDetailPage from './routes/lsyy/cpk/LsLabelDetailPage';

import SbglPage from './routes/lsyy/sbgl/SbglPage';

import CpbjPage from './routes/ctgl/cpbj/CpbjPage';
import CpbjNewPage from './routes/ctgl/cpbj/CpbjNewPage';
import CpbjEditPage from './routes/ctgl/cpbj/CpbjEditPage';

import Sydcppx from './routes/ctgl/sydcppx/Sydcppx';

import CppxPage from './routes/ctgl/cppx/CppxPage';

import DyjglPage from './routes/ctgl/dyjgl/DyjglPage';

import { routerRedux } from 'dva/router';

//连锁-原因备注
import LsYybzPage from './routes/lsyy/lsyybz/LsYybzPage';//原因备注

//连锁-支付管理
import LsZfglPage from './routes/lsyy/lszfgl/LsZfglPage';
import LsZfglForm from './routes/lsyy/lszfgl/LsZfglPageForm';

import ZcglPage from "./routes/ctgl/zcgl/ZcglPage";  //折扣管理

import ZfglPage from "./routes/ctgl/zfgl/ZfglPage";  //支付管理

import CpyylbPage from "./routes/lsyy/cpyylb/CpyylbPage";  //菜品运营类别

import CpyylbAddPage from "./routes/lsyy/cpyylb/CpyylbAddPage";  //菜品运营类别

import CpyylbEditPage from "./routes/lsyy/cpyylb/CpyylbEditPage";  //菜品运营类别

import TcmxbPage from "./routes/bb/tcmxb/TcmxbPage";   //退菜明细表
import CpflzbPage from "./routes/bb/cpflzb/CpflzbPage";     //菜品分类占比表
import JjtjbPage from "./routes/bb/jjtjb/JjtjbPage";   //计件统计表
import MdjjxqPage from "./routes/bb/mdjjxq/MdjjxqPage";   //门店计件详情
import GrjjxqPage from "./routes/bb/grjjxq/GrjjxqPage";   //个人计件详情
import MdmxbPage from "./routes/bb/mdmxb/MdmxbPage";   //免单明细表
import FjzbbPage from "./routes/bb/fjzbb/FjzbbPage";   //反结账报表
import TczcmxbPage from "./routes/bb/tczcmxb/TczcmxbPage";   //反结账报表
import MrcpxlphfxbPage from "./routes/bb/mrcpxlphfxb/MrcpxlphfxbPage";   //每日菜品销量排行分析表

import CwkmglPage from "./routes/bb/xjbbfx/CwkmglPage";   //财务科目管理
import XjbbInfoPage from "./routes/bb/xjbbfx/XjbbInfoPage";   //现金分析
import XjrbPage from "./routes/bb/xjbbfx/XjrbPage";   //现金日报
import XjybPage from "./routes/bb/xjbbfx/XjybPage";   //现金月报

import CpxlPage from "./routes/bb/CpxlPage";   //菜品销量总表
import JjfxPage from "./routes/bb/JjfxPage";   //计件分析总表
import XjbbfxPage from "./routes/bb/XjbbfxPage";   //现金分析总表
import YybbPage from "./routes/bb/YybbPage";   //营业报表总表
import JjTotalPage from "./routes/bb/JjTotalPage";   //计件报表

import ZdglPage from "./routes/bb/ZdglPage";   //账单管理
import JyzdPage from "./routes/bb/jyzd/JyzdPage";   //交易账单
import JyzdDetailPage from "./routes/bb/jyzd/JyzdDetailPage";   //交易账单详情
import ZjzdPage from "./routes/bb/zjzd/ZjzdPage";   //资金账单
import ZhlsPage from "./routes/bb/zjzd/ZhlsPage";   //账户流水

import SdfxPage from "./routes/bb/SdfxPage";   //时段分析
import WmbbPage from "./routes/bb/WmbbPage";
import YmhzbPage from "./routes/bb/ymhzb/YmhzbPage";   //时段分析

import WmyybbPage from "./routes/bb/wmbb/WmyybbPage"; //外卖营业报表
import DdybbPage from "./routes/bb/wmbb/DdybbPage"; //订单月报表
import DdrbbPage from "./routes/bb/wmbb/DdrbbPage"; //订单月报表
import WmcpxlbPage from "./routes/bb/wmbb/WmcpxlbPage"; //外卖菜品销量表
import WmcpssbPage from "./routes/bb/wmbb/WmcpssbPage"; //外卖菜品实收表

import XtszPage from "./routes/xtgl/xtsz/XtszPage";
import ZfglPageForm from "./routes/ctgl/zfgl/ZfglPageForm"; //支付管理的二级页面
import CpxsbPage from "./routes/bb/cpxsb/CpxsbPage";
import PageSettingRoute from "./routes/smdc/smdcsz/PageSettingRoute";//扫码点餐设置
import DeskQrCode from "./routes/smdc/tssz/DeskQrCode";//桌台二维码
import YgglPage from "./routes/ctgl/yggl/YgglPage";
import ZbglPage from "./components/ctgl/yggl/ZbglPage";  //
import hyandhyksz from "./routes/hygl/hyandhyksz";  //员工管理
import HymxPage from "./routes/hygl/hymx/HymxPage";  //员工管理
import HybkxqPage from "./routes/hygl/hybkxq/HybkxqPage";  //员工管理
import Coupon from "./routes/marketing/Coupon";
import CouponAdded from "./routes/marketing/CouponAdded";
import DishesIntegration from "./routes/marketing/DishesIntegration";
import DishesIntegrationAdded from "./routes/marketing/DishesIntegrationAdded";
import Integration from "./routes/marketing/Integration"; //菜品返积分列表页面
import IntegrationAdded from "./routes/marketing/IntegrationAdded";
// 营销管理->菜品返积分列表中新增编辑功能,跳转到此页面
import CpfjfEditForm from "./routes/marketing/CpfjfEditForm";
// 营销管理->菜品返积分列表中详情页面,跳转到此页面
import CpfjfDetailForm from "./routes/marketing/CpfjfDetailForm";
import GZSCPIntegration from "./routes/marketing/GZSCPIntegration";
import GZSCPIntegrationAdded from "./routes/marketing/GZSCPIntegrationAdded";
import GZSCPIntegrationDetail from "./routes/marketing/GZSCPIntegrationDetail";

import CouponDetail from "./routes/marketing/CouponDetail";
import CouponUsageDetail from "./routes/marketing/CouponUsageDetail";


// 营销管理--优惠券活动模块--优惠券列表页
import YhqhdList from "./routes/marketing/yhqhdpages/YhqhdList";
import YhqhdForm from "./routes/marketing/yhqhdpages/YhqhdForm"; //营销管理--优惠券活动模块--优惠券form表单
import YhqhdEditForm from "./routes/marketing/yhqhdpages/YhqhdEditForm"; //营销管理--优惠券活动模块--编辑优惠券form表单

// 报表
import BillPage from "./routes/stat/bill";  //
import ChangeWorkTable from "./routes/stat/jbxxb/ChangeWorkTable";//交办信息表
import BizPage from "./routes/stat/biz";  //营业汇总
import BizDayPage from "./routes/stat/bizDay";  //营业明细表
import PayStatPage from "./routes/stat/payStat";  //

import CmpglPage from "./routes/ctgl/cmpgl/Cmpgl";  //触摸屏管理
import SetStaffList from "./routes/ctgl/cmpgl/SetStaffList";  //触摸屏管理二级页面修改员工列表
import CmpglForm from "./routes/ctgl/cmpgl/cmpglForm";  //触摸屏管理二级页面修改触摸屏

import CfgllbPage from "./routes/ctgl/cfgllb/Cfgllb";  //厨房管理列表
import kitchenNew from './routes/ctgl/cfgllb/kitchenNew';   //新增厨房
import productsSet from './routes/ctgl/cfgllb/productsSet';   //新增厨房
import SetRenwuPage from './routes/ctgl/cfgllb/SetRenwuPage';   //设置任务

// 营销中心-->营销活动模块
import HdglList from "./routes/marketing/yxhdpages/HdglList";  //营销中心下的活动管理列表页面
import YxhdList from "./routes/marketing/yxhdpages/YxhdList";  //营销中心下的活动管理列表页面
import YxhdForm from "./routes/marketing/yxhdpages/YxhdForm";  //营销中心下的创建活动表单页面
import CpfjfForm from "./routes/marketing/cpfjfpages/CpfjfForm";  //营销中心下的菜品返积分页面
import CpfjfDetail from "./routes/marketing/cpfjfpages/CpfjfDetailForm";  //营销中心下的菜品返积分页面
import CpfjfEdit from "./routes/marketing/cpfjfpages/CpfjfEditForm";  //营销中心下的菜品返积分页面
// 外卖餐厅模块
import Mdbd from "./routes/wmctpages/mdbdPages/Mdbd"; //外卖餐厅--门店绑定页面
import LookInfo from "./routes/wmctpages/mdbdPages/LookInfo"; //外卖餐厅--详细信息
import Ddgl from "./routes/wmctpages/ddglPages/Ddgl"; //外卖餐厅--订单管理
import Glwmcp from "./routes/wmctpages/glwmcpPages/GlwmcpMain"; //外卖餐厅--美团维护
// import Elmwh from "./routes/wmctpages/elmwhPages/Elmwh"; //外卖餐厅--饿了么维护

//  餐厅营销--协议企业
import Xyqy from "./routes/ctyx/xyqypages/XyqyPage";  //营销中心下的菜品返积分页面
//   连锁运营--连锁协议企业
import  LsXyqy from "./routes/lsyy/lsxyqypages/LsXyqyPage";  //营销中心下的菜品返积分页面
//   连锁运营--连锁协议企业
import  Wmsqms from "./routes/lsyy/wmsqmspages/Wmsqms";  //营销中心下的菜品返积分页面

import YwpzPage from "./routes/ywpz/ywpz/YwpzPage";  //营销中心下的菜品返积分页面

//任务管理
import PprwkPage from "./routes/lsyy/rwgl/pprwk/PprwkPage";
import RenwuAddPage from "./routes/lsyy/rwgl/pprwk/RenwuAddPage";

import FanganglPage from "./routes/lsyy/rwgl/fangangl/FanganglPage";
import NewFanganPage from "./routes/lsyy/rwgl/fangangl/NewFanganPage";

import DprwPage from "./routes/lsyy/rwgl/dprw/DprwPage";
import DprwDetailPage from "./routes/lsyy/rwgl/dprw/DprwDetailPage";

//智能后厨
import ZhinenghouchuPage from "./routes/smdc/zhinenghouchu/ZhinenghouchuPage";
import LsVideoPage from "./routes/lsyy/lsvideo/LsVideoPage";
import VideoPage from "./routes/ctgl/video/VideoPage";



const requireAuth = (nextState, replace) => {

    localStorage.setItem('routename_currentPath', nextState.location.pathname);

    if (myApp._store.getState().menu.leftSelectKeys.length > 0) {

        localStorage.setItem('routename', myApp._store.getState().menu.leftSelectKeys[0]);
    }

    if (!myApp._store.getState().account.hasLogin(myApp._store.getState().account)) {

        replace({ pathname: '/login' })

    }

    if (myApp._store.getState().menu.keys.indexOf(nextState.location.pathname) == -1 && myApp._store.getState().menu.currentRestaurantId==0){

        if (nextState.location.pathname!= '/welcome'){

            // localStorage.setItem('currentKey', nextState.location.pathname);

            var timestamp=new Date().getTime();

            var redirectUrl;

            var host = window.location.protocol + '//' + window.location.host;
            if (host == 'http://dev.saas.27aichi.cn') {
                redirectUrl = host+"/hestia-p/?t="+timestamp;
            } else if (host == 'http://localhost:8989'){

                redirectUrl = host;
            }else {

                redirectUrl = host+"/hestia-p/?t="+timestamp;
            }

            window.location.href = redirectUrl;
            return;

        }


    }
}

export default function ({ history }) {
    return (
        <Router history={history}>
            <Redirect from="/" to="/login" />
            <Route path="/login">
                <IndexRoute component={LoginPage} />
                <Route path=":login" component={LoginPage} />
            </Route>

            {/*登录欢迎页*/}
            <Route path="/welcome" onEnter={requireAuth}>
                <IndexRoute component={Welcome} />
                <Route path=":welcome" component={Welcome} />
            </Route>

            {/*菜品库*/}
            <Route path="/cpk" onEnter={requireAuth}>
                <IndexRoute component={CpkPage} />
                <Route path=":cpk" component={CpkPage} />
            </Route>

            {/*通知中心*/}
            <Route path="/tzzx" onEnter={requireAuth}>
                <IndexRoute component={TzzxPage} />
                <Route path=":tzzx" component={TzzxPage} />
            </Route>

            {/*连锁-原因备注*/}
            <Route path="/lsyybz" onEnter={requireAuth}>
                <IndexRoute component={LsYybzPage} />
                <Route path=":lsyybz" component={LsYybzPage} />
            </Route>

            {/*添加菜品*/}
            <Route path="/lscpxx" onEnter={requireAuth}>
                <IndexRoute component={LsCpxxPage} />
                <Route path=":lscpxx" component={LsCpxxPage} />
            </Route>
            {/*添加菜品*/}
            <Route path="/lstcxx" onEnter={requireAuth}>
                <IndexRoute component={LsTcxxPage} />
                <Route path=":lstcxx" component={LsTcxxPage} />
            </Route>
            {/*分配菜品*/}
            <Route path="/lscpxxdeploy" onEnter={requireAuth}>
                <IndexRoute component={LsCpxxDeployPage} />
                <Route path=":lscpxxdeploy" component={LsCpxxDeployPage} />
            </Route>
            {/*分配套餐*/}
            <Route path="/lstcxxdeploy" onEnter={requireAuth}>
                <IndexRoute component={LsTcxxDeployPage} />
                <Route path=":lstcxxdeploy" component={LsTcxxDeployPage} />
            </Route>

            {/*标签详情*/}
            <Route path="/lslabeldetail" onEnter={requireAuth}>
                <IndexRoute component={LsLabelDetailPage} />
                <Route path=":lslabeldetail" component={LsLabelDetailPage} />
            </Route>

            {/*设备管理*/}
            <Route path="/sbgl" onEnter={requireAuth}>
                <IndexRoute component={SbglPage} />
                <Route path=":sbgl" component={SbglPage} />
            </Route>

            {/*基础设置*/}
            <Route path="/jcsz" onEnter={requireAuth}>
                <IndexRoute component={CtglBaseSetting} />
                <Route path=":jcsz" component={CtglBaseSetting} />
            </Route>

            {/*原因备注*/}
            <Route path="/yybz" onEnter={requireAuth}>
                <IndexRoute component={YybzPage} />
                <Route path=":yybz" component={YybzPage} />
            </Route>

            {/*菜单管理*/}
            <Route path="/cdgl" onEnter={requireAuth}>
                <IndexRoute component={CdglPage} />
                <Route path=":cdgl" component={CdglPage} />
            </Route>

            {/*添加菜品*/}
            <Route path="/cpxx" onEnter={requireAuth}>
                <IndexRoute component={CpxxPage} />
                <Route path=":cpxx" component={CpxxPage} />
            </Route>
            {/*添加菜品*/}
            <Route path="/tcxx" onEnter={requireAuth}>
                <IndexRoute component={TcxxPage} />
                <Route path=":tcxx" component={TcxxPage} />
            </Route>
            <Route path="/cpbj" onEnter={requireAuth}>
                <IndexRoute component={CpbjPage} />
                <Route path=":cpbj" component={CpbjPage} />
            </Route>
            {/*菜品变价-新增*/}
            <Route path="/cpbjnew" onEnter={requireAuth}>
                <IndexRoute component={CpbjNewPage} />
                <Route path=":cpbjnew" component={CpbjNewPage} />
            </Route>
            {/*菜品变价-编辑*/}
            <Route path="/cpbjedit" onEnter={requireAuth}>
                <IndexRoute component={CpbjEditPage} />
                <Route path=":cpbjedit" component={CpbjEditPage} />
            </Route>
            {/*收银端菜品排序*/}
            <Route path="/sydcppx" onEnter={requireAuth}>
                <IndexRoute component={Sydcppx} />
                <Route path=":sydcppx" component={Sydcppx} />
            </Route>
            {/*菜品排序*/}
            <Route path="/cppx" onEnter={requireAuth}>
                <IndexRoute component={CppxPage} />
                <Route path=":cppx" component={CppxPage} />
            </Route>
            {/*打印机管理*/}
            <Route path="/dyjgl" onEnter={requireAuth}>
                <IndexRoute component={DyjglPage} />
                <Route path=":dyjgl" component={DyjglPage} />
            </Route>
            {/*折扣管理*/}
            <Route path="/zcgl" onEnter={requireAuth}>
                <IndexRoute component={ZcglPage} />
                <Route path=":zcgl" component={ZcglPage} />
            </Route>

            {/*支付管理*/}
            <Route path="/zfgl" onEnter={requireAuth}>
                <IndexRoute component={ZfglPage} />
                <Route path=":zfgl" component={ZfglPage} />
            </Route>

            {/*连锁支付管理*/}
            <Route path="/lszfgl" onEnter={requireAuth}>
                <IndexRoute component={LsZfglPage} />
                <Route path=":lszfgl" component={LsZfglPage} />
            </Route>
            <Route path="/lszfglForm" onEnter={requireAuth}>
                <IndexRoute component={LsZfglForm} />
                <Route path=":lszfglForm" component={LsZfglForm} />
            </Route>

            {/*支付管理的二级页面*/}
            <Route path="/zfglForm" onEnter={requireAuth}>
                <IndexRoute component={ZfglPageForm} />
                <Route path=":zfglForm" component={ZfglPageForm} />
            </Route>

            {/*员工管理*/}
            <Route path="/yggl" onEnter={requireAuth}>
                <IndexRoute component={YgglPage} onEnter={requireAuth} />
                <Route path=":yggl" component={YgglPage} />
            </Route>
            {/*组别管理*/}
            <Route path="/zbgl" onEnter={requireAuth}>
                <IndexRoute component={ZbglPage} onEnter={requireAuth} />
                <Route path=":zbgl" component={ZbglPage} />
            </Route>
            {/*餐台管理*/}
            <Route path="/ctaigl" onEnter={requireAuth}>
                <IndexRoute component={CtaiglPage} />
                <Route path=":ctaigl" component={CtaiglPage} />
            </Route>
            {/*菜品运营类别*/}
            <Route path="/cpyylb" onEnter={requireAuth}>
                <IndexRoute component={CpyylbPage} />
                <Route path=":cpyylb" component={CpyylbPage} />
            </Route>

            {/*菜品运营类别*/}
            <Route path="/cpyylbadd" onEnter={requireAuth}>
                <IndexRoute component={CpyylbAddPage} />
                <Route path=":cpyylbadd" component={CpyylbAddPage} />
            </Route>

            {/*/!*菜品运营类别*!/*/}
            <Route path="/cpyylbedit" onEnter={requireAuth}>
                <IndexRoute component={CpyylbEditPage} />
                <Route path=":cpyylbedit" component={CpyylbEditPage} />
            </Route>


            {/*扫码点餐*/}
            <Route path="/smdcsz" onEnter={requireAuth}>
                <IndexRoute component={PageSettingRoute} />
                <Route path=":smdcsz" component={PageSettingRoute} />
            </Route>

            {/*桌台二维码*/}
            <Route path="/ztewm" onEnter={requireAuth}>
                <IndexRoute component={DeskQrCode} />
                <Route path=":ztewm" component={DeskQrCode} />
            </Route>


            {/*系统设置*/}
            <Route path="/xtsz" onEnter={requireAuth}>
                <IndexRoute component={XtszPage} />
                <Route path=":xtsz" component={XtszPage} />
            </Route>

            {/*会员及会员卡设置*/}
            <Route path="/hyandhyksz" onEnter={requireAuth}>
                <IndexRoute component={hyandhyksz} />
                <Route path=":hyandhyksz" component={hyandhyksz} />
            </Route>
            {/*会员明细*/}
            <Route path="/HymxPage" onEnter={requireAuth}>
                <IndexRoute component={HymxPage} />
                <Route path=":HymxPage" component={HymxPage} />
            </Route>
            {/*会员办卡详情*/}
            <Route path="/hybkxq" onEnter={requireAuth}>
                <IndexRoute component={HybkxqPage} />
                <Route path=":hybkxq" component={HybkxqPage} />
            </Route>


            {/*营销中心  start*/}
            <Route path="/yhqlb" onEnter={requireAuth}>
                <IndexRoute component={Coupon} />
                <Route path=":yhqlb" component={Coupon} />
            </Route>

            <Route path="/plfhb" onEnter={requireAuth}>
                <IndexRoute component={DishesIntegration} />
                <Route path=":plfhb" component={DishesIntegration} />
            </Route>

            <Route path="/cpfjf" onEnter={requireAuth}>
                <IndexRoute component={Integration} />
                <Route path=":cpfjf" component={Integration} />
            </Route>

            <Route path="/yhqlbAddCoupon" onEnter={requireAuth}>
                <IndexRoute component={CouponAdded} />
                <Route path=":yhqlbAddCoupon" component={CouponAdded} />
            </Route>
            <Route path="/plfhbAddDishesIntegration" onEnter={requireAuth}>
                <IndexRoute component={DishesIntegrationAdded} />
                <Route path=":plfhbAddDishesIntegration" component={DishesIntegrationAdded} />
            </Route>
            <Route path="/cpfjfAddIntegration" onEnter={requireAuth}>
                <IndexRoute component={IntegrationAdded} />
                <Route path=":cpfjfAddIntegration" component={IntegrationAdded} />
            </Route>

            {/* 营销管理详情页面 */}
            <Route path="/cpfjfdetailform" onEnter={requireAuth}>
                <IndexRoute component={CpfjfDetailForm} />
                <Route path=":cpfjfdetailform" component={CpfjfDetailForm} />
            </Route>

            <Route path="/yhqlbCouponDetail" onEnter={requireAuth}>
                <IndexRoute component={CouponDetail} />
                <Route path=":yhqlbCouponDetail" component={CouponDetail} />
            </Route>
            <Route path="/yhqlbCouponUsageDetail" onEnter={requireAuth}>
                <IndexRoute component={CouponUsageDetail} />
                <Route path=":yhqlbCouponUsageDetail" component={CouponUsageDetail} />
            </Route>
            <Route path="/gzscp" onEnter={requireAuth}>
                <IndexRoute component={GZSCPIntegration} />
                <Route path=":gzscp" component={GZSCPIntegration} />
            </Route>
            <Route path="/gzscpAddIntegration" onEnter={requireAuth}>
                <IndexRoute component={GZSCPIntegrationAdded} />
                <Route path=":gzscpAddIntegration" component={GZSCPIntegrationAdded} />
            </Route>
            <Route path="/gzscpAddIntegrationDetail" onEnter={requireAuth}>
                <IndexRoute component={GZSCPIntegrationDetail} />
                <Route path=":gzscpAddIntegrationDetail" component={GZSCPIntegrationDetail} />
            </Route>

            {/*张总新增菜品返积分列表编辑功能*/}
            <Route path="/cpfjfeditform" onEnter={requireAuth}>
                <IndexRoute component={CpfjfEditForm} />
                <Route path=":cpfjfeditform" component={CpfjfEditForm} />
            </Route>

            {/*营销管理--优惠券活动模块--列表页*/}
            <Route path="/yhqhdlist" onEnter={requireAuth}>
                <IndexRoute component={YhqhdList} />
                <Route path=":yhqhdlist" component={YhqhdList} />
            </Route>

            {/* 营销管理--优惠券活动模块--新增优惠券表单页面*/}
            <Route path="/yhqhdform" onEnter={requireAuth}>
                <IndexRoute component={YhqhdForm} />
                <Route path=":yhqhdform" component={YhqhdForm} />
            </Route>

            {/* 营销管理--优惠券活动模块--新增优惠券表单页面*/}
            <Route path="/yhqhdeditform" onEnter={requireAuth}>
                <IndexRoute component={YhqhdEditForm} />
                <Route path=":yhqhdeditform" component={YhqhdEditForm} />
            </Route>


            {/* 营销中心-营销活动--活动管理页面*/}
            <Route path="/hdglList" onEnter={requireAuth}>
                <IndexRoute component={HdglList} />
                <Route path=":hdgllist" component={HdglList} />
            </Route>

            {/* 营销中心-营销活动*/}
            <Route path="/yxhdlist" onEnter={requireAuth}>
                <IndexRoute component={YxhdList} />
                <Route path=":yxhdlist" component={YxhdList} />
            </Route>

            {/* 营销中心-营销活动-创建活动form表单页面*/}
            <Route path="/yxhdform" onEnter={requireAuth}>
                <IndexRoute component={YxhdForm} />
                <Route path=":yxhdform" component={YxhdForm} />
            </Route>
            {/* 营销中心-营销活动-创建活动form表单页面*/}
            <Route path="/cpfjfform" onEnter={requireAuth}>
                <IndexRoute component={CpfjfForm} />
                <Route path=":cpfjfform" component={CpfjfForm} />
            </Route>
            <Route path="/cpfjfdetail" onEnter={requireAuth}>
                <IndexRoute component={CpfjfDetail} />
                <Route path=":cpfjfdetail" component={CpfjfDetail} />
            </Route>
            <Route path="/cpfjfedit" onEnter={requireAuth}>
                <IndexRoute component={CpfjfEdit} />
                <Route path=":cpfjfedit" component={CpfjfEdit} />
            </Route>





            {/*营销中心 end*/}

            {/* 报表 */}
            <Route path="/zdmxb" onEnter={requireAuth}>
                <IndexRoute component={BillPage} onEnter={requireAuth} />
                <Route path=":zdmxb" component={BillPage} />
            </Route>
            <Route path="/fklxhzb" onEnter={requireAuth}>
                <IndexRoute component={PayStatPage} onEnter={requireAuth} />
                <Route path=":fklxhzb" component={PayStatPage} />
            </Route>


            {/*交班信息表*/}

            <Route path="/jbxxb" onEnter={requireAuth}>
                <IndexRoute component={ChangeWorkTable} />
                <Route path=":jbxxb" component={ChangeWorkTable} />
            </Route>
            {/*打印机管理*/}
            <Route path="/dyjgl" onEnter={requireAuth}>
                <IndexRoute component={DyjglPage} />
                <Route path=":dyjgl" component={DyjglPage} />
            </Route>

            {/*系统设置*/}
            <Route path="/xtsz" onEnter={requireAuth}>
                <IndexRoute component={XtszPage} />
                <Route path=":xtsz" component={XtszPage} />
            </Route>
            {/*退菜明细表*/}
            <Route path="/tcmxb" onEnter={requireAuth}>
                <IndexRoute component={TcmxbPage} />
                <Route path=":tcmxb" component={TcmxbPage} />
            </Route>
            {/*菜品销售表*/}
            <Route path="/cpxsb" onEnter={requireAuth}>
                <IndexRoute component={CpxsbPage} />
                <Route path=":cpxsb" component={CpxsbPage} />
            </Route>
            {/*菜品分类占比*/}
            <Route path="/cpflzb" onEnter={requireAuth}>
                <IndexRoute component={CpflzbPage} />
                <Route path=":cpflzb" component={CpflzbPage} />
            </Route>
            {/*计件统计表*/}
            <Route path="/jjtjb" onEnter={requireAuth}>
                <IndexRoute component={JjtjbPage} />
                <Route path=":jjtjb" component={JjtjbPage} />
            </Route>
            <Route path="/jjtotal" onEnter={requireAuth}>
                <IndexRoute component={JjTotalPage} />
                <Route path=":jjtotal" component={JjTotalPage} />
            </Route>
            <Route path="/sdfx" onEnter={requireAuth}>
                <IndexRoute component={SdfxPage} />
                <Route path=":sdfx" component={SdfxPage} />
            </Route>
            {/*门店计件详情*/}
            <Route path="/mdjjxq" onEnter={requireAuth}>
                <IndexRoute component={MdjjxqPage} />
                <Route path=":mdjjxq" component={MdjjxqPage} />
            </Route>
            {/*个人计件详情*/}
            <Route path="/grjjxq" onEnter={requireAuth}>
                <IndexRoute component={GrjjxqPage} />
                <Route path=":grjjxq" component={GrjjxqPage} />
            </Route>
            {/*免单明细表*/}
            <Route path="/mdmxb" onEnter={requireAuth}>
                <IndexRoute component={MdmxbPage} />
                <Route path=":mdmxb" component={MdmxbPage} />
            </Route>
            {/*反结账报表*/}
            <Route path="/fjzbb" onEnter={requireAuth}>
                <IndexRoute component={FjzbbPage} />
                <Route path=":fjzbb" component={FjzbbPage} />
            </Route>
            {/*退菜赠菜明细表*/}
            <Route path="/tczcmxb" onEnter={requireAuth}>
                <IndexRoute component={TczcmxbPage} />
                <Route path=":tczcmxb" component={TczcmxbPage} />
            </Route>
            {/*每日菜品销量排行分析表*/}
            <Route path="/mrcpxlphfxb" onEnter={requireAuth}>
                <IndexRoute component={MrcpxlphfxbPage} />
                <Route path=":mrcpxlphfxb" component={MrcpxlphfxbPage} />
            </Route>
            {/*现金报表分析*/}
            <Route path="/xjbbfx" onEnter={requireAuth}>
                <IndexRoute component={XjbbfxPage} />
                <Route path=":xjbbfx" component={XjbbfxPage} />
            </Route>
            <Route path="/cpxl" onEnter={requireAuth}>
                <IndexRoute component={CpxlPage} />
                <Route path=":cpxl" component={CpxlPage} />
            </Route>
            <Route path="/jjfx" onEnter={requireAuth}>
                <IndexRoute component={JjfxPage} />
                <Route path=":jjfx" component={JjfxPage} />
            </Route>
            <Route path="/yybb" onEnter={requireAuth}>
                <IndexRoute component={YybbPage} />
                <Route path=":yybb" component={YybbPage} />
            </Route>
            <Route path="/zdgl" onEnter={requireAuth}>
                <IndexRoute component={ZdglPage} />
                <Route path=":zdgl" component={ZdglPage} />
            </Route>
            <Route path="/jyzd" onEnter={requireAuth}>
                <IndexRoute component={JyzdPage} />
                <Route path=":jyzd" component={JyzdPage} />
            </Route>
            <Route path="/jyzdDetail" onEnter={requireAuth}>
                <IndexRoute component={JyzdDetailPage} />
                <Route path=":jyzdDetail" component={JyzdDetailPage} />
            </Route>
            <Route path="/zjzd" onEnter={requireAuth}>
                <IndexRoute component={ZjzdPage} />
                <Route path=":zjzd" component={ZjzdPage} />
            </Route>
            <Route path="/zhls" onEnter={requireAuth}>
                <IndexRoute component={ZhlsPage} />
                <Route path=":zhls" component={ZhlsPage} />
            </Route>
            <Route path="/wmbb" onEnter={requireAuth}>
                <IndexRoute component={WmbbPage} />
                <Route path=":wmbb" component={WmbbPage} />
            </Route>
            {/*财务科目管理*/}
            <Route path="/cwkmgl" onEnter={requireAuth}>
                <IndexRoute component={CwkmglPage} />
                <Route path=":cwkmgl" component={CwkmglPage} />
            </Route>
            {/*现金报表*/}
            <Route path="/xjbbInfo" onEnter={requireAuth}>
                <IndexRoute component={XjbbInfoPage} />
                <Route path=":xjbbInfo" component={XjbbInfoPage} />
            </Route>
            {/*现金日报*/}
            <Route path="/xjrb" onEnter={requireAuth}>
                <IndexRoute component={XjrbPage} />
                <Route path=":xjrb" component={XjrbPage} />
            </Route>
            {/*现金月报*/}
            <Route path="/xjyb" onEnter={requireAuth}>
                <IndexRoute component={XjybPage} />
                <Route path=":xjyb" component={XjybPage} />
            </Route>
            <Route path="/yyhzb" onEnter={requireAuth}>
                <IndexRoute component={BizPage} />
                <Route path=":yyhzb" component={BizPage} />
            </Route>
            <Route path="/yymxb" onEnter={requireAuth}>
                <IndexRoute component={BizDayPage} />
                <Route path=":yymxb" component={BizDayPage} />
            </Route>
            {/*优免汇总表*/}
            <Route path="/ymhzb" onEnter={requireAuth}>
                <IndexRoute component={YmhzbPage} />
                <Route path=":ymhzb" component={YmhzbPage} />
            </Route>
            {/*外卖报表*/}
            <Route path="/wmyybb" onEnter={requireAuth}>
                <IndexRoute component={WmyybbPage} />
                <Route path=":wmyybb" component={WmyybbPage} />
            </Route>
            <Route path="/ddybb" onEnter={requireAuth}>
                <IndexRoute component={DdybbPage} />
                <Route path=":ddybb" component={DdybbPage} />
            </Route>
            <Route path="/ddrbb" onEnter={requireAuth}>
                <IndexRoute component={DdrbbPage} />
                <Route path=":ddrbb" component={DdrbbPage} />
            </Route>
            <Route path="/wmcpxlb" onEnter={requireAuth}>
                <IndexRoute component={WmcpxlbPage} />
                <Route path=":wmcpxlb" component={WmcpxlbPage} />
            </Route>
            <Route path="/wmcpssb" onEnter={requireAuth}>
                <IndexRoute component={WmcpssbPage} />
                <Route path=":wmcpssb" component={WmcpssbPage} />
            </Route>
            {/* 触摸屏管理 */}
            <Route path="/cmpgl" onEnter={requireAuth} >
                <IndexRoute component={CmpglPage} />
                <Route path=":cmpgl" component={CmpglPage} />
            </Route>

            {/* 触摸屏管理二级页面设置店员页面 */}
            <Route path="/setStaff" onEnter={requireAuth}>
                <IndexRoute component={SetStaffList} />
                <Route path=":setStaff" component={SetStaffList} />
            </Route>

            {/* 触摸屏管理二级页面设置店员页面 */}
            <Route path="/cmpglForm" onEnter={requireAuth}>
                <IndexRoute component={CmpglForm} />
                <Route path=":cmpglForm" component={CmpglForm} />
            </Route>

            {/* 厨房管理列表 */}
            <Route path="/cfgllb" onEnter={requireAuth}>
                <IndexRoute component={CfgllbPage} />
                <Route path=":cfgllb" component={CfgllbPage} />
            </Route>
            {/* 厨房管理列表 */}
            <Route path="/kitchenNew" onEnter={requireAuth}>
                <IndexRoute component={kitchenNew} />
                <Route path=":kitchenNew" component={kitchenNew} />
            </Route>
            {/* 设置生产产品 */}
            <Route path="/productsSet" onEnter={requireAuth}>
                <IndexRoute component={productsSet} />
                <Route path=":productsSet" component={productsSet} />
            </Route>
            {/* 设置任务 */}
            <Route path="/setRenwu" onEnter={requireAuth}>
                <IndexRoute component={SetRenwuPage} />
                <Route path=":setRenwu" component={SetRenwuPage} />
            </Route>

            {/*任务管理*/}
            <Route path="/pprwk" onEnter={requireAuth}>
                <IndexRoute component={PprwkPage} />
                <Route path=":pprwk" component={PprwkPage} />
            </Route>
            <Route path="/renwuAdd" onEnter={requireAuth}>
                <IndexRoute component={RenwuAddPage} />
                <Route path=":renwuAdd" component={RenwuAddPage} />
            </Route>

            <Route path="/rwfa" onEnter={requireAuth}>
                <IndexRoute component={FanganglPage} />
                <Route path=":rwfa" component={FanganglPage} />
            </Route>
            <Route path="/newFangan" onEnter={requireAuth}>
                <IndexRoute component={NewFanganPage} />
                <Route path=":newFangan" component={NewFanganPage} />
            </Route>

            <Route path="/lsvideo" onEnter={requireAuth}>
                <IndexRoute component={LsVideoPage} />
                <Route path=":lsvideo" component={LsVideoPage} />
            </Route>

            <Route path="/video" onEnter={requireAuth}>
                <IndexRoute component={VideoPage} />
                <Route path=":video" component={VideoPage} />
            </Route>

            {/*  餐厅营销---协议企业 */}
            <Route path="/xyqy" onEnter={requireAuth}>
                <IndexRoute component={Xyqy} />
                <Route path=":xyqy" component={Xyqy} />
            </Route>

            {/*  连锁运营---连锁协议企业 */}
            <Route path="/lsxyqy" onEnter={requireAuth}>
                <IndexRoute component={LsXyqy} />
                <Route path=":lsxyqy" component={LsXyqy} />
            </Route>

            {/*  连锁运营---外卖授权模式设置 */}
            <Route path="/wmsqms" onEnter={requireAuth}>
                <IndexRoute component={Wmsqms} />
                <Route path=":wmsqms" component={Wmsqms} />
            </Route>
            {/*  业务配置 */}
            <Route path="/ywpz" onEnter={requireAuth}>
                <IndexRoute component={YwpzPage} />
                <Route path=":ywpz" component={YwpzPage} />
            </Route>

            <Route path="/dprw" onEnter={requireAuth}>
                <IndexRoute component={DprwPage} />
                <Route path=":dprw" component={DprwPage} />
            </Route>
            <Route path="/dprwDetail" onEnter={requireAuth}>
                <IndexRoute component={DprwDetailPage} />
                <Route path=":dprwDetail" component={DprwDetailPage} />
            </Route>

            <Route path="/znhc" onEnter={requireAuth}>
                <IndexRoute component={ZhinenghouchuPage} />
                <Route path=":znhc" component={ZhinenghouchuPage} />
            </Route>


            { /* 外卖餐厅--门店绑定 */}

            <Route path="/mdbd" onEnter={requireAuth}>
                <IndexRoute component={Mdbd} />
                <Route path=":mdbd" component={Mdbd} />
            </Route>
            { /* 外卖餐厅--门店绑定--详细信息页面 */}
            <Route path="/lookinfo" onEnter={requireAuth}>
                <IndexRoute component={LookInfo} />
                <Route path=":lookinfo" component={LookInfo} />
            </Route>

            {/* 外卖餐厅--订单管理 */}
            <Route path="/ddgl" onEnter={requireAuth}>
                <IndexRoute component={Ddgl} />
                <Route path=":ddgl" component={Ddgl} />
            </Route>

            {/* 外卖餐厅--美团维护 */}
            <Route path="/glwmcp" onEnter={requireAuth}>
                <IndexRoute component={Glwmcp} />
                <Route path=":glwmcp" component={Glwmcp} />
            </Route>

            {/* 外卖餐厅--饿了么维护 */}
            {/* <Route path="/elmwh" onEnter={requireAuth}>
                <IndexRoute component={Elmwh} />
                <Route path=":elmwh" component={Elmwh} />
            </Route> */}
        </Router>

    );
}
