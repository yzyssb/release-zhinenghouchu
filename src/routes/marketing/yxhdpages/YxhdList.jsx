import React, {PropTypes} from 'react';

import Header from '../../../components/Header';
import {connect} from 'dva';
import LeftMenu from '../../../components/LeftMenu';
import {routerRedux} from 'dva/router';
import Pagination from 'antd/lib/pagination';
import Breadcrumb from 'antd/lib/breadcrumb';
import Table from 'antd/lib/table';
import Popconfirm from 'antd/lib/popconfirm'; //确认删除

import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import Radio from 'antd/lib/radio';
import yxhdStyles from './Yxhd.less'
import moment from "moment/moment";

const RadioGroup = Radio.Group;

function YxhdList({menu, dispatch, yxhdConfig,account}) {
    const HeaderProps = {
        menu,  
        dispatch,
    };

    // 以上是分页数据=====================================

    function onChange(e) { 
        let endTime=moment().endOf("day");
        let startTime=moment().endOf("day");
        if(e.target.value=='1'){
            startTime=moment().startOf("day").format('YYYY-MM-DD 00:00:00')
        }else if(e.target.value=='2'){
            startTime=moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
            endTime=moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59');
        }else if(e.target.value=='7'){
            startTime=moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00')
        }else if(e.target.value=='30'){
            startTime=moment().subtract(30, 'days').format('YYYY-MM-DD 00:00:00')
        }else{
            startTime=moment().endOf("day")
        }
        dispatch({
            type: 'yxhdConfig/updatePayload',
            payload: {endTime:endTime,startTime:startTime,radioSelect:e.target.value}
        })
        dispatch({
            type: 'yxhdConfig/query',
            payload: {}
        })



    }

    function addActivity(type) {

        if (type == 1){
            dispatch({
                type: 'yxhdConfig/updatePayload',
                payload: {
                    couponId: '2',//弹框选中的id
                    couponName: '',//弹框选中的name
                    couponItem:{},
                }
            })

            dispatch(routerRedux.push({
                pathname: '/yxhdform',
                query: {

                },
            }));

        }else{

            dispatch(routerRedux.push({
                pathname: '/cpfjfform',
                query: {

                },
            }));

        }

    }

    return (
        <Header {...HeaderProps}>
            {/*点击查看在modal中展示当前数据的详情*/}

            <div>
                <div style={{overflow:'hidden'}}>
                    <p className={yxhdStyles.title}>活动概况 </p>

                    {yxhdConfig.activityStatData && yxhdConfig.activityStatData.length>0 && yxhdConfig.activityStatData.map((i,j)=>{

                        return (<div style={{paddingLeft: '20px',float:'left',width:300}} key={j}>

                            <div onClick={()=>addActivity(i.activityType)} className={yxhdStyles.titlediv}>
                                <p className={yxhdStyles.name}>{i.activityType == 1?'会员有礼':'菜品返积分'}</p>
                                <div style={{textAlign: 'left', paddingLeft: '15px'}}>
                                    {/*<p className={yxhdStyles.top_p}><span className={yxhdStyles.top_left}>执行中活动</span><span*/}
                                    {/*className={yxhdStyles.top_right}>1</span></p>*/}
                                    <p className={yxhdStyles.top_p} style={{display:i.activityType == 1?'block':'none'}}><span className={yxhdStyles.top_left} style={{marginRight:10}}>已核销数量</span><span
                                        className={yxhdStyles.top_right}>{i.verifyCount}</span></p>
                                    <p className={yxhdStyles.top_p} style={{display:i.activityType == 1?'block':'none'}}><span className={yxhdStyles.top_left} style={{marginRight:10}}>领取总量</span> <span
                                        className={yxhdStyles.top_right}>{i.receiveCount }</span></p>
                                    <p className={yxhdStyles.top_p} style={{display:i.activityType == 2?'block':'none'}}><span className={yxhdStyles.top_left} style={{marginRight:10}}>返积分总量</span> <span
                                        className={yxhdStyles.top_right}>{i.points}</span></p>
                                    <p className={yxhdStyles.top_p} style={{display:i.activityType == 2?'block':'none'}}><span className={yxhdStyles.top_left} style={{marginRight:10}}></span> <span
                                        className={yxhdStyles.top_right}>&nbsp;</span></p>
                                    {/*<p className={yxhdStyles.top_p}><span className={yxhdStyles.top_left}>优免总额</span> <span*/}
                                    {/*className={yxhdStyles.top_right}>22000000000</span></p>*/}
                                    <p style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        minHeight: '30px',
                                        width: '100%',
                                        justifyContent: 'center',
                                        marginBottom: '0',
                                    }}>+创建活动</p>
                                </div>

                            </div>
                        </div>)
                    })}

                </div>
                <div>
                    <p style={{borderBottom: '1px solid #ccc', padding: '12px 0px 12px 0px ',marginTop:20}}>营业情况 </p>
                    <div>
                        <div>
                            <RadioGroup onChange={onChange} value={yxhdConfig.radioSelect}>
                                <Radio value={1}>今日</Radio>
                                <Radio value={2}>昨日</Radio>
                                <Radio value={7}>近7日</Radio>
                                <Radio value={30}>近30天</Radio>
                            </RadioGroup>
                        </div>
                        <div style={{background: ' #f3f3f3', display: 'flex', textAlign: 'center', padding: '15px 0',marginTop:20}}>
                            <div className={yxhdStyles.middle_bottom}>
                                <p>人均消费</p>
                                <p className={yxhdStyles.middle_color}>{yxhdConfig.restaurantData.avgPeopleMoney||'0.00'}</p>
                            </div>
                            <div className={yxhdStyles.middle_bottom}><p>单均消费</p>
                                <p className={yxhdStyles.middle_color}>{yxhdConfig.restaurantData.avgOrderMoney||'0.00'}</p></div>
                            <div className={yxhdStyles.middle_bottom}><p>就餐总人数</p><p
                                className={yxhdStyles.middle_color}>{yxhdConfig.restaurantData.people||'0'}</p></div>
                            <div className={yxhdStyles.middle_bottom}><p>优免金额</p><p
                                className={yxhdStyles.middle_color}>{yxhdConfig.restaurantData.giftMoney||'0.00'}</p></div>
                            <div style={{display: 'flex', flex: '1', flexDirection: 'column',}}><p>实收金额</p><p
                                className={yxhdStyles.middle_color}>{yxhdConfig.restaurantData.receiveMoney||'0.00'}</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div>
                    <p style={{borderBottom: '1px solid #ccc', padding: '12px 0px 12px 0px ',marginTop:20}}>推荐活动 </p>
                    <div style={{paddingLeft: '20px', width: '100%', float: 'left',marginTop:20}}>


                        <div className={yxhdStyles.bottom_div} onClick={()=>addActivity(1)}>
                            <div className={yxhdStyles.bottom_top}>
                                <div className={yxhdStyles.bottom_top_name}>会员有礼</div>
                            </div>
                            <p style={{
                                display: 'flex', 
                                alignItems: 'center',
                                minHeight: '30px',
                                width: '100%',
                                justifyContent: 'center',
                                marginBottom: '0',
                            }}>+创建活动</p>
                        </div>
                    </div>
                </div>


            </div>
        </Header>
    );
}

YxhdList.propTypes = {
    menu: PropTypes.object,
};


function mapStateToProps({menu, yxhdConfig}) {
    return {menu, yxhdConfig, menu};
}

export default connect(mapStateToProps)(YxhdList);

