import React, { PropTypes } from 'react';
import {Link} from 'dva/router';
import styles from './LeftMenu.less';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';
const SubMenu = Menu.SubMenu;

function getMenuKeyFromUrl(pathname) {
    let key = '';
    try {
        key = pathname.match(/\/([^\/]*)/i)[1];
    } catch (e) {}
    return key;
}




const LeftMenu = ({menu,leftSelectKeys,dispatch,openKeys}) => {

    function onOpenChange (openKeys) {

        let newOpenKeys = [];
        newOpenKeys.push(openKeys[openKeys.length-1]);

        if(dispatch){

            dispatch({
                type: 'menu/onOpenChange',
                payload: {
                  openKeys: openKeys,
                },
           });

        }
}

function onMenuClick (item) {

      dispatch({
        type: 'menu/leftmenuClick',
        payload: {
          currentItem: item,
        },
      });


}

    var leftMenuHtml=[];

    menu.map((j) => {

        if(j.children){



            var subMenuHtml=[];

            j.children.map((h) => {

                if (h.children){

                    var thirdMenuHtml = [];

                    h.children.map((a)=>{

                        thirdMenuHtml.push(< Menu.Item key={a.code} >
                            < Link to = {a.resourceroute}  >  {a.name} </Link>
                        </Menu.Item>)

                    })

                    subMenuHtml.push( < SubMenu key={h.code}  title={h.name}>
                        {thirdMenuHtml}
                    </SubMenu>)
                }else{
                    subMenuHtml.push(
                        < Menu.Item key={h.code} >
                            < Link to = {h.resourceroute}  >  {h.name} </Link>
                        </Menu.Item>
                    )
                }

            })
            leftMenuHtml.push (
                < SubMenu key={j.code} title={<span><Icon type={j.icontype} /><span>{j.name}</span></span>}>
                   {subMenuHtml}
                </SubMenu>
            )


        }else{
            leftMenuHtml.push (
                <Menu.Item key={j.code} >
                  < Link to = {j.resourceroute} ><Icon type={j.icontype} />  {j.name} </Link>
                </Menu.Item>
            )
        }

    })

    return ( 
        <Menu className = {styles.container} mode = "inline" theme = "dark" onOpenChange={onOpenChange} openKeys={openKeys} defaultOpenKeys={openKeys} onSelect={onMenuClick} selectedKeys={leftSelectKeys}>
            {leftMenuHtml}
        </Menu>
    );

};

export default LeftMenu;