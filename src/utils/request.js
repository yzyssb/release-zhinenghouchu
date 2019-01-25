import fetch from 'dva/fetch';
import { config } from '../services/HttpService';
const code = 200; //成功  
const code500 = 500 //系统异常（代码报错）  公共
const code201 = 201 //用户名不存在  公共
const code203 = 203 //强制下线  公共
const code204 = 204 //token 过期  公共
const code210 = 210 //该账号已被停用，请联系超级管理员！ 公共
const code401 = 401 //无帐号权限
const code402 = 402 //无系统登录权限


function parseJSON(response) {
    return response.json().then(function(json) {


    if (json.code == code201) {
      window.location.href = window.location.href.split("#")[0] + "#/login";
    }else if (json.code == code201) {
       window.location.href = window.location.href.split("#")[0] + "#/login";
    }else if (json.code == code203) {
      window.location.href = window.location.href.split("#")[0] + "#/login";
    }else if (json.code == code204) {
      window.location.href = window.location.href.split("#")[0] + "#/login";
    }else if (json.code == code401) {


        var timestamp=new Date().getTime();

        var redirectUrl;
        var prefixUrl;
        var host = window.location.protocol + '//' + window.location.host;
        if (host == 'http://dev.saas.27aichi.cn') {
            prefixUrl = host;
            redirectUrl = host+"/hestia-p/?t="+timestamp;
        } else if (host == 'http://localhost:8989'){
            prefixUrl = "http://dev.saas.27aichi.cn";
            redirectUrl = host;
        }else {
            prefixUrl = host;
            redirectUrl = host+"/hestia-p/?t="+timestamp;
        }

        //跳统一登录页  /hestia/basic/login
        window.location.href = prefixUrl+"/api/basic/login?redirectUrl="+encodeURIComponent(redirectUrl);
        return;

    }else if (json.code == code402) {

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

        //退出登录
        alert("您没有系统访问权限！");
        window.location.href =logoutUrl;
        return;

    }


    return json;
  });
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {

    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}
