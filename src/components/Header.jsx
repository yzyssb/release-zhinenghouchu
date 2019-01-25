import React, { PropTypes } from 'react';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
import { Link } from 'dva/router';
import LeftMenu from '../components/LeftMenu';
import Headright from '../components/Headright';
import styles from './Header.less';
import ChooseRestaurant from '../components/base/usercenter/ChooseRestaurant';

const Header = ({menu,dispatch,children,welcome}) => {

    function onMenuClick (item) {
        dispatch({
            type: 'menu/changeHeaderData',
            payload: {
                currentItem: item,
            },
        });
    }

    const ChooseProps = {

        menu,
        dispatch,
    }


    var html=[];
    //<Icon type="home" />{j.name}
    menu.mainmenu.map((j, k) => {
        html.push (
            <Menu.Item key={j.code}>
                <Icon type={j.icontype} />{j.name}
            </Menu.Item>
        )
    })

    return (
        <div>

            <ChooseRestaurant {...ChooseProps}></ChooseRestaurant>

            <div className={styles.headerlogo}>路上会员宝</div>
            <Menu mode="horizontal" theme = "dark" onSelect={onMenuClick} className={styles.header} selectedKeys={menu.defaultHeaderMenu} defaultSelectedKeys={menu.defaultHeaderMenu}>


            </Menu>

            <Headright dispatch={dispatch} menu = {menu} welcome = {welcome}></Headright>

            <LeftMenu menu = {menu.allMenu} leftSelectKeys={menu.leftSelectKeys} dispatch={dispatch} openKeys={menu.openKeys}>
            </LeftMenu>

            <div className={styles.main}  >
                <div className={styles.child}  >
                    {children}
                </div>
            </div>
        </div>
    );

}

export default Header;
