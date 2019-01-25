import { httpPostNoParam } from '../../../../services/HttpService';
import { config } from '../../../../services/HttpService';
import { routerRedux } from 'dva/router';
import key from 'keymaster';
import message from 'antd/lib/message';

export default {
    namespace: 'register',
    state: {
        currentSteps: 0,
        locationInfo: {},
        cityInfo: {},
        activationType: 1,
        activationCode: 1,
        //
        userType: 3, //存储用户类型
        //激活码类型
        activationType:3,

    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/register') {
                    dispatch({
                        type: 'getLocationInfo',
                        payload: {},
                    });
                    dispatch({
                        type: 'queryCuisinesGet',
                        payload: {},
                    });
                }
            });
        },
    },

    effects: {
        // 登录按钮点击
        *queryRegister({ payload }, { select, call, put }) {
            // payload.provinceID=yield select(({ register }) => register.locationInfo.province);
            // payload.cityID=yield select(({ register }) => register.locationInfo.city);
            // payload.areaID=yield select(({ register }) => register.locationInfo.country);
            // payload.activationType = yield select(({ register }) => register.activationType);
            // payload.activationCode = yield select(({ register }) => register.activationCode);
            console.log("下一打印的数据是参数")
            console.log(payload)
            const url = config.registerUrl;
            const { data } = yield call(httpPostNoParam, url, payload);
            console.log(data)
            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    // 成功后跳转到下一页可以点击立即使用
             
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            currentSteps: 2
                        },
                    });

                }else{
                    message.error(data.msg)
                }
            }
        },

        *queryCaptchaCode({ payload }, { select, call, put }) {
            const url = config.captchaCodeSmsUrl;
            payload.isCheckMobile = 0;
            payload.purposeType = 1;
            const { data } = yield call(httpPostNoParam, url, payload);

            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {

                }
            }else{
                message.error(data.msg)
            }
        },


        //获取位置信息
        * getLocationInfo({ payload }, { select, call, put }) {




            //获取省列表
            var cityInfo = {};
            const provinceData = yield call(httpPostNoParam, config.basedataProvincesGet, {});

            if (provinceData.data.code == config.MSGCODE_SUCCESS) {

                cityInfo.provinceList = provinceData.data.data;

                yield put({
                    type: 'updatePayload',
                    payload: {
                        cityInfo: cityInfo,
                    },
                });
            }else{
                message.error(provinceData.data.msg)
            }




        },

        //更新城市列表
        * getCityList({ payload }, { select, call, put }) {


            const register = yield select(({ register }) => register);


            const { locationInfo, cityInfo } = register;


            //获取市列表
            const cityData = yield call(httpPostNoParam, config.basedataCityGet + "/" + payload.code, { "parentId": payload.code });

            console.log("获取市列表");
            if (cityData.data.code == config.MSGCODE_SUCCESS) {

                yield put({
                    type: 'getCityInfoSuccess',
                    payload: {
                        locationInfo: { ...locationInfo, province: payload.code, city: -1, country: -1 },
                        cityInfo: { ...cityInfo, cityList: cityData.data.data },
                    },
                });

            }else{
                message.error(data.msg)
            }

        },
        //更新区县列表
        * getCountryList({ payload }, { select, call, put }) {


            const register = yield select(({ register }) => register);


            const { locationInfo, cityInfo } = register;


            //获取区县列表


            const countryData = yield call(httpPostNoParam, config.basedataCountriesGet + "/" + payload.code, { "parentId": payload.code });

            if (countryData.data.code == config.MSGCODE_SUCCESS) {

                yield put({
                    type: 'getCityInfoSuccess',
                    payload: {
                        locationInfo: { ...locationInfo, city: payload.code, country: -1 },
                        cityInfo: { ...cityInfo, countryList: countryData.data.data },
                    },
                });

            }else{
                message.error(countryData.data.msg)
            }

        },
        *queryCuisinesGet({ payload }, { select, call, put }) {

            const url = config.cuisinesGet;
           
            const { data } = yield call(httpPostNoParam, url, payload);

            if (data) {
                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            cuisinesList:data.data,
                        },
                    });
                }
            }else{
                message.error(data.msg)
            }
        },



    },
    reducers: {


        updatePayload(state, action) {

            return { ...state, ...action.payload };
        },

        /*更新区县*/
        updateCountry(state, action) {

            const { code } = action.payload;

            const { locationInfo } = state;


            locationInfo.country = code;

            return { ...state, locationInfo: locationInfo };

        },
        //城市信息获取成功
        getCityInfoSuccess(state, action) {
            return { ...state, ...action.payload };
        },




    }
}