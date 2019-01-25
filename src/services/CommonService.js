import fetch from 'dva/fetch';
import FileSaver from 'file-saver';
import { stringify } from 'qs';
import { parse } from 'qs';

export  function getUserName() {

    const userStatus = myApp._store.getState().account.username;

    return userStatus;

}     


export  function getUserId() {

    const userStatus = myApp._store.getState().account.userid;

    return userStatus;

}


export  function getUserToken() {

    const userStatus = myApp._store.getState().account.token;

    return userStatus;
}


export  function getCompanyId() {

    const userStatus = myApp._store.getState().account.companyId;

    return userStatus;

}


export  function getRestaurantId() {

    const userStatus = myApp._store.getState().menu.currentRestaurantId;

    return userStatus;

}


export function getWxToken() {

    const userStatus = myApp._store.getState().deskQrCode.wxToken;

    return userStatus;

}

export function getWxState() {

    const userStatus = myApp._store.getState().deskQrCode.wxState;

    return userStatus;

}



export  function getCurrentTab() {

    const currentTab = myApp._store.getState().inventory.currentTab;

    return currentTab;

}

export  function getRoleType() {

    const rolename = myApp._store.getState().welcome.role[0].roletype;

    return rolename;

}

export  function getUserPhone() {

    const rolename = myApp._store.getState().account.phone;

    return rolename;

}

export function postExportFile(url, data, name = "报表.xlsx") {
    data.token = getUserToken();
    // 表单格式
    Object.keys(data).map((key) => {
        if(typeof data[key]=="string") return
        data[key] = JSON.stringify(data[key]);
    });
    fetch(url, {
        //credentials: 'same-origin',
		credentials: 'include',
        method: 'post',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: stringify(data)
    }).then(function (response) {
        return response.blob();
    }).then(function (blob) {
        if(blob.type=="text/plain"){
            window.location.reload()
            return false
        }
        FileSaver.saveAs(blob, name);
    })
}

export function postVipExportFile(url, data, name = "报表.xls") {
    data.token = getUserToken();
 
    fetch(url, {
		//credentials: 'same-origin',
        credentials: 'include',
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
        },
        body: JSON.stringify(parse(data)),
    }).then(function (response) {
        return response.blob();
    }).then(function (blob) {
        FileSaver.saveAs(blob, name);
    })
}



