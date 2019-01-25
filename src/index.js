import dva, { connect } from 'dva';
import createLoading from 'dva-loading';
import './index.html';
import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';

import LocaleProvider from 'antd/lib/locale-provider';

import zhCN from 'antd/lib/locale-provider/zh_CN';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

// import { browserHistory } from 'dva/router';

// 1. Initialize
// const app = dva({
//   history: browserHistory,
// });

const app = dva();

window.myApp = app;

// 2. Plugin
app.use(createLoading());

// 3. Model

// 引入登录页model

app.model(require('./models/base/usercenter/login/login'));

app.model(require('./models/base/account/account'));

app.model(require('./models/base/mainmenu/mainmenu'));

app.model(require('./models/base/usercenter/login/welcome'));

//餐厅管理

//基础设置
app.model(require('./models/ctgl/ctglBaseSetting'));
app.model(require('./models/cpbj/cpbjSetting'));

//原因备注
app.model(require('./models/ctgl/yybz'));

//菜品运营类别
app.model(require('./models/lsyy/lscpyylb/cpyylb'));

//员工管理的弹框
app.model(require('./models/yggl/yggl'));
app.model(require('./models/yggl/zbgl'));

//菜品信息
app.model(require('./models/ctgl/menumanager/cpxx'));

//菜品分类
app.model(require('./models/ctgl/menumanager/cpfl'));

//规格管理
app.model(require('./models/ctgl/menumanager/gggl'));

//套餐管理
app.model(require('./models/ctgl/menumanager/tcxx'));

//做法管理
app.model(require('./models/ctgl/menumanager/zfgl'));

//菜品单位
app.model(require('./models/ctgl/menumanager/cpdw'));

//可售清单
app.model(require('./models/ctgl/menumanager/ksqd'));

//连锁菜品信息
app.model(require('./models/lsyy/cpk/lscpxx'));

//连锁菜品分类
app.model(require('./models/lsyy/cpk/lscpfl'));

//连锁规格管理
app.model(require('./models/lsyy/cpk/lsgggl'));

//连锁套餐管理
app.model(require('./models/lsyy/cpk/lstcxx'));

//连锁做法管理
app.model(require('./models/lsyy/cpk/lszfgl'));

//连锁菜品单位
app.model(require('./models/lsyy/cpk/lscpdw'));

//连锁口味标签
app.model(require('./models/lsyy/cpk/lslabel'));

//连锁可售清单
app.model(require('./models/lsyy/cpk/lsksqd'));

app.model(require('./models/lsyy/tzzx/tzzx'));

//设备管理
app.model(require('./models/lsyy/sbgl/sbgl'));


//刘志华折扣管理
app.model(require('./models/zcgl/zcgl'));

// 支付管理
app.model(require('./models/zfgl/zfgl'));

// 连锁支付管理
app.model(require('./models/lsyy/lszfgl/lszfglConfig'));

// 触摸屏管理
app.model(require('./models/cmpgl/cmpgl'));
// 触摸屏管理中的店员管理模块
app.model(require('./models/cmpgl/staff'));

// 厨房管理列表
app.model(require('./models/ctgl/cfgllb'));

//设置任务
app.model(require('./models/ctgl/setRenwu'));


//餐台管理
app.model(require('./models/ctgl/ctaigl'));

//菜品变价
app.model(require('./models/cpbj/cpbj'));

//收银端菜品排序
app.model(require('./models/sydcppx/sydcppx'));

//打印机管理
app.model(require('./models/dyjgl/dyjgl'));
app.model(require('./models/dyjgl/printer'));

//系统设置
app.model(require('./models/ctgl/xtsz'));

//退菜明细表
app.model(require('./models/bb/tcmxb'));	

//菜品分类占比表
app.model(require('./models/bb/cpflzb'));

//菜品销售表
app.model(require('./models/bb/cpxsb'));

//计件统计表
app.model(require('./models/bb/jjtjb'));
//门店计件详情
app.model(require('./models/bb/mdjjxq'));
//个人计件详情
app.model(require('./models/bb/grjjxq'));

app.model(require('./models/bb/jyzd'));
app.model(require('./models/bb/jyzdDetail'));

app.model(require('./models/bb/zjzd'));
app.model(require('./models/bb/zhls'));

//免单明细单
app.model(require('./models/bb/mdmxb'));

//反结账报表
app.model(require('./models/bb/fjzbb'));

//赠菜明细表
app.model(require('./models/bb/tczcmxb'));

//每日菜品销量排行分析表
app.model(require('./models/bb/mrcpxlphfxb'));

//现金报表分析
app.model(require('./models/bb/xjbbInfo'));

//财务科目管理
app.model(require('./models/bb/cwkmgl'));

//现金日报
app.model(require('./models/bb/xjrb'));

//现金月报
app.model(require('./models/bb/xjyb'));

//时段分析
app.model(require('./models/bb/sdfx'));

//优免汇总表
app.model(require('./models/bb/ymhzb'));

//外卖营业报表
app.model(require('./models/bb/wmyybb'));
app.model(require('./models/bb/ddybb'));
app.model(require('./models/bb/ddrbb'));
app.model(require('./models/bb/wmcpxlb'));
app.model(require('./models/bb/wmcpssb'));

// 选择地区
app.model(require('./models/base/common/addressselect'));

//封面设置
app.model(require('./models/smdc/pageSettingRoute'));


//堂食设置
app.model(require('./models/smdc/deskQrCode'));

//优惠券列表
app.model(require('./models/markerting/marketingModel'));

// 营销管理中的菜品返积分编辑
app.model(require('./models/markerting/cpfjfEditConfig'));

// 营销管理中的菜品返积分详情
app.model(require('./models/markerting/cpfjfDetailConfig'));

// 营销管理-优惠券活动模块
app.model(require('./models/markerting/yhqhdconfig/yhqhdConfig'));

// 营销活动-活动管理模块
app.model(require('./models/markerting/yxhdconfig/hdglConfig'));
app.model(require('./models/markerting/yxhdconfig/yxhdConfig'));

// 报表
app.model(require('./models/stat/bill')); //账单明细
app.model(require('./models/stat/changeWorkTable'));//交班信息表
app.model(require('./models/stat/biz')); //营业汇总
app.model(require('./models/stat/payStat')); //营业汇总

app.model(require('./models/stat/bizDay')); //营业汇总

//任务管理
app.model(require('./models/lsyy/rwgl/pprwk'));
app.model(require('./models/lsyy/rwgl/renwuAdd'));

app.model(require('./models/lsyy/rwgl/fangangl'));
app.model(require('./models/lsyy/rwgl/newFangan'));

app.model(require('./models/lsyy/rwgl/dprw'));

//会员及会员卡明细
app.model(require('./models/hygl/hyandhyksz/jfgz/jfgz'));
//退卡申请
app.model(require('./models/hygl/hyandhyksz/tksq/xfjl'));
app.model(require('./models/hygl/hyandhyksz/tksq/sqtk'));

//会员明细
app.model(require('./models/hygl/hymx/hymx'));

//会员办卡详情
app.model(require('./models/hygl/hybkxq/hybkxq'));
// 外卖餐厅模块
app.model(require('./models/wmct/mdbdConfig'));  //门店绑定
// app.model(require('./models/wmct/mtwhConfig'));  //美团维护
app.model(require('./models/wmct/glwmcpConfig'));  //关联外卖菜品
app.model(require('./models/wmct/ddglConfig'));  //订单管理

// 餐厅营销--协议企业
app.model(require('./models/ctyx/xyqyConfig'));

//  连锁运营模块--连锁协议企业
app.model(require('./models/lsyy/lsctyx/lsxyqyConfig'));

// 业务配置
app.model(require('./models/ywpz/ywpz'));

// 菜品排序
app.model(require('./models/ctgl/cppx'));

app.model(require('./models/ctgl/video'));

//连锁-原因备注
app.model(require('./models/lsyy/lsyybz/lsyybz'));

// 外卖授权模式设置
app.model(require('./models/lsyy/wmsqms/wmsqmsconfig'));


// 4. Router
app.router(require('./router'));

// 5. Start
// app.start('#root');
const App = app.start();
ReactDOM.render(<LocaleProvider locale={zhCN}><App /></LocaleProvider>,
document.getElementById('root'));
