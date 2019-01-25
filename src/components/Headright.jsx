import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import {Link} from 'dva/router';
import styles from './Headright.less';
import Popover from 'antd/lib/popover';
import Button from 'antd/lib/button';
import {getUserName,getUserId,getUserToken} from '../services/CommonService';
import { routerRedux } from 'dva/router';
import { logoutUrl } from '../services/HttpService';
import { portalUrl } from '../services/HttpService';
import Icon from 'antd/lib/icon';

const Headright = ({dispatch,menu}) => {

    return (
        <div>


            <div className={styles.setArea}>
                <a className={styles.userName} onClick = {()=>{
                    dispatch({type: 'menu/updatePayload', payload:{modalVisible:true}});

                }}>{menu.realRestaurantName?menu.realRestaurantName:'切换门店'} <Icon type="down" /></a>

                <Popover className={styles.fl} content={
                    <div>
                        <p><a onClick={()=>{window.location.href = portalUrl;}}>返回引导页</a></p>
                        <p><a onClick={()=>{window.location.href = logoutUrl;}}>退出登录</a></p>
                    </div>}>
                    <div className={styles.userName}>
                        {getUserName()}<Icon style = {{marginLeft:3}} type="down" />
                    </div>
                </Popover>

            </div>

        </div>
    );

};



export default Headright;  