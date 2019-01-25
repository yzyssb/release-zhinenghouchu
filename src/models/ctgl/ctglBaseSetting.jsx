import {httpPost,httpGetLatLng} from '../../services/HttpService';
import {config} from '../../services/HttpService';
import {routerRedux} from 'dva/router';
import message from 'antd/lib/message';
import Message from "antd/lib/message/index";

function sortarr(arr){
    for(var i=0;i<arr.length-1;i++){
        for(var j=0;j<arr.length-1-i;j++){
            if(arr[j].startTime>arr[j+1].startTime){
                var temp=arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=temp;
            }
        }
    }
    return arr;
}

export default {
    namespace: 'ctglBaseSetting',
    state: {
        baseInfoFormRest: 0,
        baseInfo: {},
        loading: false,
        locationInfo: {},
        cityInfo: {},
        lat:0,
        lng:0,
        imageUrls:[],
        restaurantStartTime:0,
        couponStartDay:0
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/jcsz') {
                    dispatch({
                        type: 'getBase',
                        payload: {},
                    });
                }
                if (location.pathname === '/cdgl') {
                    dispatch({
                        type: 'getBase',
                        payload: {},
                    });
                }
            });
        },
    },

    effects: {

        //获取基本信息
        * getBase({payload}, {select, call, put}) {

            yield put({type: 'showLoading'});

            const baseGetUrl = config.ctglBaseGet;


            const {data} = yield call(httpPost, baseGetUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {


                    if (data.data && data.data.businessHours && data.data.businessHours.length == 1) {

                        data.data.businessHours.push({

                            "name": "",
                            "startHour": "00:00",
                            "endHour": "00:00",

                        });
                    }

                    let newRestaurantStartTime;
                    if (!data.data.restaurantStartTime){
                        newRestaurantStartTime = 0;
                    }else {
                        newRestaurantStartTime = data.data.restaurantStartTime;
                    }
                    yield put({
                        type: 'getBaseSuccess',
                        payload: {
                            baseInfo: data.data,
                            imageUrls:data.data.imageUrls,
                            QRcodeUrl:data.data.managerWechatUrl,
                            coverImageUrl:data.data.restaurantCoverImageUrl.length>0?data.data.restaurantCoverImageUrl[0]:'',
                            restaurantStartTime:newRestaurantStartTime,
                            couponStartDay:!data.data.couponStartDay?0:data.data.couponStartDay,
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },

        //更新基本信息
        * updateBase({payload}, {select, call, put}) {

            const ctglBaseSetting = yield select(({ctglBaseSetting}) => ctglBaseSetting);

            const {
                baseInfo
            } = ctglBaseSetting;

            const {
                formdata
            } = payload;


            var param = {
                "amtAverage": parseInt(formdata.amtAverage * 100),
                "bookPhone": formdata.bookPhone,
                "contactName": formdata.contactName,
                "contactPhone": formdata.contactPhone,
                "restaurantName": formdata.restaurantName,
                "restaurantSlogan":formdata.restaurantSlogan,
                "servicePhone": formdata.servicePhone,
                "noticeTitle":formdata.noticeTitle,
                "noticeContent":formdata.noticeContent,
                "star":formdata.star,
                "score":formdata.score==''?0:formdata.score
            }

            if (baseInfo.businessTypeList) {
                var businessType = -1;
                baseInfo.businessTypeList.map((j) => {

                    if (formdata.businessType == j.key) {

                        businessType = j.value;
                    }

                })

                if (businessType != -1) {
                    param.businessType = businessType;
                } else {
                    param.businessType = parseInt(formdata.businessType);
                }

            }

            if (baseInfo.cuisineList) {
                var cuisine = -1;
                baseInfo.cuisineList.map((j) => {

                    if (formdata.cuisine == j.key) {

                        cuisine = j.value;
                    }

                })

                if (cuisine != -1) {
                    param.cuisine = cuisine;
                } else {
                    param.cuisine = parseInt(formdata.cuisine);
                }

            }


            if (baseInfo.settlementTimeList) {
                var settlementTime = -1;
                baseInfo.settlementTimeList.map((j) => {

                    if (formdata.settlementTime == j.key) {

                        settlementTime = j.value;
                    }

                })

                if (settlementTime != -1) {
                    param.settlementTime = settlementTime;
                } else {
                    param.settlementTime = parseInt(formdata.settlementTime);
                }

            }

            param.businessHours = JSON.stringify(baseInfo.businessHours);

            let timePeiods = baseInfo.businessHours

            let newBusinessHours = sortarr(timePeiods)

            for(var i=0;i<newBusinessHours.length;i++){

                if (newBusinessHours[i].startHour > newBusinessHours[i].endHour ) {

                    message.warning('开始时间不能大于结束时间');
                    return;
                }
            }

            param.imageUrls = ctglBaseSetting.imageUrls;

            param.managerWechatUrl = ctglBaseSetting.QRcodeUrl;

            param.restaurantCoverImageUrl  = [ctglBaseSetting.coverImageUrl] ;

            param.restaurantStartTime = ctglBaseSetting.restaurantStartTime?ctglBaseSetting.restaurantStartTime:0;

            param.couponStartDay = ctglBaseSetting.couponStartDay;

            if (!ctglBaseSetting.coverImageUrl){
                message.warning("请上传餐厅封面！");
                return;
            }

            const baseUpdateUrl = config.ctglBaseUpdate;


            const {data} = yield call(httpPost, baseUpdateUrl, param);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {

                    message.success("保存成功！");
                    yield put({
                        type: 'getBase',
                        payload: {},
                    });
                } else {

                    yield put({type: 'hideLoading'});
                    message.warning(data.msg);
                }
            }
        },

        //获取位置信息
        * getLocationInfo({payload}, {select, call, put}) {

            yield put({type: 'showLoading'});

            const apiUrl = config.ctglAddressGet;


            const {data} = yield call(httpPost, apiUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {


                    //特色环境处理
                    if (data.data && data.data.environmentTagList) {

                        data.data.environmentTagList.map((o, i) => {

                            var checked = 0;

                            if (data.data.environmentTags) {
                                var i = 0;

                                for (i = 0; i < data.data.environmentTags.length; i++) {

                                    if (data.data.environmentTags[i] == o.value) {

                                        checked = 1;

                                        break;
                                    }
                                }
                            }

                            o.checked = checked;
                        });
                    }


                    //获取省列表
                    var cityInfo = {};
                    const provinceData = yield call(httpPost, config.basedataProvincesGet, {});

                    if (provinceData.data.code == config.MSGCODE_SUCCESS) {

                        cityInfo.provinceList = provinceData.data.data;
                    }

                    //获取市列表
                    const cityData = yield call(httpPost, config.basedataCityGet+"/"+data.data.province, {"parentId": data.data.province});

                    if (cityData.data.code == config.MSGCODE_SUCCESS) {

                        cityInfo.cityList = cityData.data.data;
                    }

                    //获取区县列表


                    const countryData = yield call(httpPost, config.basedataCountriesGet+"/"+data.data.city, {"parentId": data.data.city});

                    if (countryData.data.code == config.MSGCODE_SUCCESS) {

                        cityInfo.countryList = countryData.data.data;
                    }

                    yield put({
                        type: 'getLocationInfoSuccess',
                        payload: {
                            locationInfo: data.data,
                            cityInfo: cityInfo,
                        },
                    });

                    let provinceText = '';
                    let cityText = '';
                    let countryText = '';

                    let locationInfo = yield select(({ctglBaseSetting}) => ctglBaseSetting.locationInfo)

                    if (cityInfo.provinceList) {

                        cityInfo.provinceList.map((j) => {


                            if (locationInfo.province == j.code) {

                                provinceText = j.name;

                            }

                        })

                    }

                    if (cityInfo.cityList) {
                        cityInfo.cityList.map((j) => {


                            if (locationInfo.city == j.code) {

                                cityText = j.name;

                            }

                        })



                    }

                    if (cityInfo.countryList) {
                        cityInfo.countryList.map((j) => {


                            if (locationInfo.country == j.code) {

                                countryText = j.name;

                            }

                        })



                    }

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            provinceText: provinceText,
                            cityText:cityText,
                            countryText:countryText,
                        },
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },

        //更新城市列表
        * getCityList({payload}, {select, call, put}) {


            const ctglBaseSetting = yield select(({ctglBaseSetting}) => ctglBaseSetting);


            const {locationInfo, cityInfo} = ctglBaseSetting;


            //获取市列表
            const cityData = yield call(httpPost, config.basedataCityGet+"/"+payload.code, {"parentId": payload.code});

            if (cityData.data.code == config.MSGCODE_SUCCESS) {

                yield put({
                    type: 'getCityInfoSuccess',
                    payload: {
                        locationInfo: {...locationInfo, province: payload.code, city: -1, country: -1},
                        cityInfo: {...cityInfo, cityList: cityData.data.data},
                    },
                });

            }

        },
        * getLatLng({payload}, {select, call, put}) {
            const ctglBaseSetting = yield select(({ctglBaseSetting}) => ctglBaseSetting);

            var address = (yield select(({ctglBaseSetting}) => ctglBaseSetting.provinceText)) +(yield select(({ctglBaseSetting}) => ctglBaseSetting.cityText))+(yield select(({ctglBaseSetting}) => ctglBaseSetting.countryText))  +ctglBaseSetting.locationInfo.addressDetail;
          
            const bdMapGetLatLng = config.bdMapGetLatLng+address;

            const { data } = yield call(httpPost,bdMapGetLatLng,payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    //获取市列表
                    ctglBaseSetting.locationInfo.lat = data.data.lat;
                    ctglBaseSetting.locationInfo.lng = data.data.lng;
                   
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            ctglBaseSetting:ctglBaseSetting ,
                        },
                    });

                }else{
                    console.log(data.msg);
                }
            }

        },

        * getCountryList({payload}, {select, call, put}) {


            const ctglBaseSetting = yield select(({ctglBaseSetting}) => ctglBaseSetting);


            const {locationInfo, cityInfo} = ctglBaseSetting;


            //获取区县列表


            const countryData = yield call(httpPost, config.basedataCountriesGet+"/"+payload.code, {"parentId": payload.code});

            if (countryData.data.code == config.MSGCODE_SUCCESS) {

                yield put({
                    type: 'getCityInfoSuccess',
                    payload: {
                        locationInfo: {...locationInfo, city: payload.code, country: -1},
                        cityInfo: {...cityInfo, countryList: countryData.data.data},
                    },
                });

            }

        },
        //保存位置信息
        * saveLocationInfo({payload}, {select, call, put}) {




            const ctglBaseSetting = yield select(({ctglBaseSetting}) => ctglBaseSetting);

            const {
                locationInfo,loading
            } = ctglBaseSetting;

            if(loading){
                return;
            }
            if(!locationInfo.province || ! locationInfo.city ||!locationInfo.country || locationInfo.province==-1 || locationInfo.city ==-1 || locationInfo.country == -1){

                message.error("请填写所在城市！");

                return;
            }

            if(locationInfo.addressDetail==''){

                message.error("请填写具体位置！");

                return;
            }


            var param = {
                "addressProvince": locationInfo.province,
                "addressCity": locationInfo.city,
                "addressCountry": locationInfo.country,
                "addressDetail": locationInfo.addressDetail,
                "slogan": locationInfo.slogan,
                "description": locationInfo.description,
                "customTags": locationInfo.customTags,
                "lat":locationInfo.lat,
                "lng":locationInfo.lng,
                "builtArea":locationInfo.builtArea,
            }

            var environmentTags =[];
            if (locationInfo.environmentTagList) {

                locationInfo.environmentTagList.map((j) => {

                    if (j.checked) {

                        environmentTags.push(j.value);
                    }

                })


            }






            param.environmentTags = environmentTags;

            yield put({type: 'showLoading'});

            const {data} = yield call(httpPost, config.ctglAddressUpdate, param);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {

                    message.success("保存成功！");
                    yield put({
                        type: 'getLocationInfo',
                        payload: {},
                    });
                } else {

                    yield put({type: 'hideLoading'});
                    message.warning(data.msg);
                }
            }
        },


    },
    reducers: {

        updatePayload(state, action) {
            return {...state, ...action.payload,};
        },

        //基本信息获取成功
        getBaseSuccess(state, action) {
            return {...state, ...action.payload, baseInfoFormRest: 1, loading: false};
        },

        //基本信息获取成功
        getLocationInfoSuccess(state, action) {
            return {...state, ...action.payload, loading: false};
        },

        //城市信息获取成功
        getCityInfoSuccess(state, action) {
            return {...state, ...action.payload};
        },


        /*更新基础信息选择*/
        updateBaseInfoFormRest(state, action) {

            return {...state, ...action.payload,};
        },

        /*更新业态选择值*/
        updateCuisineSelect(state, action) {

            const {baseInfo} = state;

            return {...state, baseInfo: {...baseInfo, ...action.payload}};

        },

        /*更新营业时间*/
        updateBusiness(state, action) {

            const {baseInfo} = state;
            const {value, index, key} = action.payload;


            if (baseInfo && baseInfo.businessHours && baseInfo.businessHours.length > index) {

                if (key == 'startHour') {

                   // if (baseInfo.businessHours[index].endHour == -1 || parseInt(value) < baseInfo.businessHours[index].endHour) {

                    //if (baseInfo.businessHours[index].endHour == -1 ) {

                        baseInfo.businessHours[index].startHour = parseInt(value);

                  //  }


                } else if (key == 'endHour') {

                    //if (baseInfo.businessHours[index].startHour == -1 || parseInt(value) > baseInfo.businessHours[index].startHour) {

                    //if (baseInfo.businessHours[index].startHour == -1 ) {

                        baseInfo.businessHours[index].endHour = parseInt(value);

                   // }

                } else {

                    baseInfo.businessHours[index].name = value;

                }

            }

            return {...state, baseInfo: baseInfo};

        },

        /*新增营业时间*/
        addBusiness(state, action) {

            const {baseInfo} = state;

            if (baseInfo && baseInfo.businessHours && baseInfo.businessHours.length < 6) {

                baseInfo.businessHours.push({

                    "name": "",
                    "startHour": "00:00",
                    "endHour": "00:00",

                });
            }

            return {...state, baseInfo: baseInfo};

        },
        /*删除营业时间*/
        deleteBusiness(state, action) {

            const {baseInfo} = state;
            const {index} = action.payload;

            if (baseInfo && baseInfo.businessHours && baseInfo.businessHours.length > 2 && baseInfo.businessHours.length > index) {

                baseInfo.businessHours.splice(index, 1);
            }

            return {...state, baseInfo: baseInfo};

        },
        /*显示加载提示*/
        showLoading(state) {
            return {...state, loading: true};
        },

        /*隐藏加载提示*/
        hideLoading(state) {
            return {...state, loading: false};
        },

        /*更新特色环境*/
        updateEnvironmentTag(state, action) {

            const {index, checked} = action.payload;

            const {locationInfo} = state;

            const {environmentTagList} = locationInfo;


            if (environmentTagList && environmentTagList.length > index) {

                environmentTagList[index].checked = checked;

            }

            locationInfo.environmentTagList = environmentTagList;

            return {...state, locationInfo: locationInfo};

        },

        /*更新地理位置信息页输入框*/
        updateLocationInput(state, action) {

            const {value, key} = action.payload;

            const {locationInfo} = state;

            if (key == 'addressDetail') {

                locationInfo.addressDetail = value;

            } else if (key == 'slogan') {

                locationInfo.slogan = value;

            } else if (key == 'description') {

                locationInfo.description = value;

            } else if (key == 'builtArea') {

                locationInfo.builtArea = value;

            }


            return {...state, locationInfo: locationInfo};

        },

        /*更新自定义标签*/
        updateCustomTags(state, action) {

            const {tags} = action.payload;

            const {locationInfo} = state;


            locationInfo.customTags = tags;

            return {...state, locationInfo: locationInfo};

        },

        /*更新区县*/
        updateCountry(state, action) {

            const {code} = action.payload;

            const {locationInfo} = state;


            locationInfo.country = code;

            return {...state, locationInfo: locationInfo};

        },

         updatePayload(state,action){
            return { ...state, ...action.payload,};
        },

    }
}