import {httpPost,httpPostWithParam} from '../../services/HttpService';
import {config} from '../../services/HttpService';
import {routerRedux} from 'dva/router';
import message from 'antd/lib/message';


export default {
    namespace: 'deskQrCode',
    state: {
        baseInfoFormRest: 0,
        baseInfo: {},
        loading: false,
        locationInfo: {},
        cityInfo: {},
        pageNo : 1,
        total :0,
        current :1,
        list:[],
        isShow:false,
        qrCodeList:[],

        limit:10,
        size:10,
        qrCode:'',
        num:'',
        offset:0,
        visible: false,     //modal是否显示
        title:'',           //modal上提示的文字
        cpCateIndex:0,      //展开分类的index
        cpCateId:'',        //展开分类的id
        dataSource :[],     //菜品分类列表
        subDataSource:[],        //分类菜品列表
        defaultValue:[],
        subDefaultValue:[],
        wx_total:0,
        wx_subtotal:0,
        imgid:0,
        wxState:0,
        imgUrl:'',
        defaultUrl:'http://order-27aichi.oss-cn-beijing.aliyuncs.com/hestia/upload/2018-09-06/385544d3-93ff-4462-8b2f-0d2e1e323efa.png',
        defaultEvaluatePageUrl:'http://order-27aichi.oss-cn-beijing.aliyuncs.com/hestia/upload/2018-09-28/c8f05141-2529-4015-abac-723904d3682a.png',
		typeOrigin:1,
        orderMergeTime:0,
        type:0,//0 堂食点餐推送 1 外带点餐推送 2自外卖推送
        tabkey:1,
        businessList:[]
    },

    subscriptions: {
        setup({dispatch, history}) {
            history.listen(location => {
                if (location.pathname === '/ztewm') {
                    dispatch({
                        type: 'getBase',
                        payload: {},
                    });
		    
		              

                    dispatch({
                        type: 'getWXSettings',
                        payload: {},
                    });
                    dispatch({
                        type: 'getWXState',
                        payload: {},
                    });

                    dispatch({
                        type: 'getEvWXSettings',
                        payload: {},
                    });
                    dispatch({
                        type: 'getEvWXState',
                        payload: {},
                    });
                    dispatch({
                        type: 'getOrderMergeTime',
                        payload: {},
                    });


					dispatch({
                        type: 'updatePayload',
                        payload: {
							typeOrigin:2,
                            tabkey:'1'
						},
                    });
					

                }else if(location.pathname === '/cpk'){
					dispatch({
                        type: 'updatePayload',
                        payload: {
							typeOrigin:1
						},
                    });
					/*dispatch({
                        type: 'getList',
                        payload: {},
                    });*/
				}
            });
        },
    },

    effects: {


        *getWXState ({payload},{select, call, put}){
            const baseGetUrl = config.weinxinQueryAuth;

            const {data} = yield call(httpPost, baseGetUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            wxState: data.data.state,
                            wxToken:data.data.token,
                        }
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },


        *getQrImg({payload}, {select, call, put}) {

            const baseGetUrl = config.GetQrImgUrl;

            let deskQrCode = yield select(({deskQrCode}) => deskQrCode);
            let url = baseGetUrl + deskQrCode.tableId;

            const {data} = yield call(httpPost, url, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'updateQrCodelist',
                        payload: {
                            isShow:true ,
                            qrCode: data.data.qrCode,
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },

        *getTaImg({payload}, {select, call, put}) {

            const {data} = yield call(httpPost, config.GetTaImgUrl, payload);

            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'updatePayload',
                        payload: {

                            qrCode: data.data.qrCode,
                        },
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },


        *getBase({payload}, {select, call, put}) {

            const baseGetUrl = config.getQrCodeList;

            let deskQrCode = yield select(({deskQrCode}) => deskQrCode);

            payload.offset = yield select(({ deskQrCode }) => deskQrCode.offset);;
            payload.size = yield select(({ deskQrCode }) => deskQrCode.size);

            const {data} = yield call(httpPost, baseGetUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {

                    if (data.data) {
                        yield put({
                            type: 'updateQrCodelist',
                            payload: {
                                qrCodeList: data.data,
                                total:data.totalCount,
                            },
                        });
                    }
                } else {
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
                } else {
                    message.warning(data.msg);
                }
            }
        },

        //获取列表
        *getList({ payload }, { select, call, put }) {
              yield put({ type: 'showLoading' });
			  const deskQrCode=yield select(({deskQrCode})=>deskQrCode)
			  let type=deskQrCode.typeOrigin

                const orderListUrl = type==1?config.ScanfoodCateList1:config.ScanfoodCateList + '?businessHoursId=' + deskQrCode.selectId;
                const { data } = yield call(httpPost,orderListUrl, payload);
                if (data) {
                  var defaultValue=[]
                  if(data.code == config.MSGCODE_SUCCESS){
                  	if(data.data&&data.data.length>0){
                  		data.data.map((value,index)=>{
	                        value.key=+index+1
	                        defaultValue[index]=value.orderNo
	                    })
                        yield put({
                            type: 'getListSuccess',
                            payload: {
                                wx_total:data.data.length
                            },
                        });
                  	}
                    
                    yield put({
                        type: 'getListSuccess',
                        payload: {
                            dataSource: data.data,
                            defaultValue:defaultValue
                        },
                    });
                  }else{
                    yield put({ type: 'hideLoading' });
                    message.error(data.msg)
                  } 
                }  
        },

        //排序
        *move({ payload }, { select, call, put }) {
              yield put({ type: 'showLoading' });
			  const deskQrCode=yield select(({deskQrCode})=>deskQrCode)
			  let type=deskQrCode.typeOrigin
              const orderListUrl = (type==1?config.ScanfoodCateSort1:config.ScanfoodCateSort)+"?type="+payload.type+'&categoryId='+payload.categoryId+'&businessHoursId='+deskQrCode.selectId;;
              const { data } = yield call(httpPost,orderListUrl,payload);
              if (data) {
                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({ type: 'hideLoading' });
                }else{
                    yield put({ type: 'hideLoading' });
                    message.error(data.msg)
                } 
          }
        },
        //先排序再获取列表
        *moveAndSort({ payload }, { select, call, put }) {
              yield put({ type: 'showLoading' });
			  const deskQrCode=yield select(({deskQrCode})=>deskQrCode)
			  let type=deskQrCode.typeOrigin
              const orderListUrl = (type==1?config.ScanfoodCateSort1:config.ScanfoodCateSort)+"?type="+payload.type+'&categoryId='+payload.categoryId+'&businessHoursId='+deskQrCode.selectId;
              const { data } = yield call(httpPost,orderListUrl,payload);
              if (data) {
                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                      type: 'getList',
                      payload: {},
                    });
                }else{
                    yield put({ type: 'hideLoading' });
                    message.error(data.msg)
                } 
          }
        },
        //展开分类
        *showCates({ payload }, { select, call, put }) {
              yield put({ type: 'showLoading' });
			  const deskQrCode=yield select(({deskQrCode})=>deskQrCode)
			  let type=deskQrCode.typeOrigin
              const orderListUrl = (type==1?config.ScanfoodSubcateList1:config.ScanfoodSubcateList)+'?categoryId='+payload.categoryId+'&businessHoursId='+deskQrCode.selectId;;
              const { data } = yield call(httpPost,orderListUrl,payload);
              if (data) {
                var subDefaultValue=[]
                if(data.code == config.MSGCODE_SUCCESS){
                    if(data.data&&data.data.length>0){
                        data.data.map((value,index)=>{
                            value.key=+index+1
                            subDefaultValue[index]=value.orderNo
                        })
                        yield put({
                          type: 'updatePayload',
                          payload: {
                            wx_subtotal:data.data.length
                          },
                        });
                    }
                    yield put({
                      type: 'updatePayload',
                      payload: {
                        subDataSource:data.data,
                        subDefaultValue:subDefaultValue
                      },
                    });
                    yield put({ type: 'hideLoading' });
                }else{
                    yield put({ type: 'hideLoading' });
                    message.error(data.msg)
                } 
          }
        },
        //modal 先排序再获取列表
        *subMoveAndSort({ payload }, { select, call, put }) {
              yield put({ type: 'showLoading' });
			  const deskQrCode=yield select(({deskQrCode})=>deskQrCode)
			  let type=deskQrCode.typeOrigin
              const orderListUrl = (type==1?config.ScanfoodSubCateSort1:config.ScanfoodSubCateSort)+"?type="+payload.type+'&categoryId='+payload.categoryId+'&foodId='+payload.foodId+'&businessHoursId='+deskQrCode.selectId;;
              const { data } = yield call(httpPost,orderListUrl,payload);
              if (data) {
                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                      type: 'showCates',
                      payload: {categoryId:payload.categoryId},
                    });
                }else{
                    yield put({ type: 'hideLoading' });
                    message.error(data.msg)
                } 
          }
        },

        *getWXSettings ({payload},{select, call, put}){
            const baseGetUrl = config.settingsGet + '/' + (yield select(({deskQrCode}) => deskQrCode.type));

            const {data} = yield call(httpPost, baseGetUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            coverImageUrl: data.data.coverImageUrl,
                            descTemplate: data.data.descTemplate,
                            titleTemplate: data.data.titleTemplate,
                        }
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },

        *updateWXSettings ({payload},{select, call, put}){
            const baseGetUrl = config.settingsUpdate;

            payload.type = yield select(({deskQrCode}) => deskQrCode.type);
            payload.coverImageUrl = yield select(({deskQrCode}) => deskQrCode.coverImageUrl);
            payload.descTemplate = yield select(({deskQrCode}) => deskQrCode.descTemplate);
            payload.titleTemplate = yield select(({deskQrCode}) => deskQrCode.titleTemplate);


            const {data} = yield call(httpPost, baseGetUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success('保存成功');
                    yield put({
                        type: 'getWXSettings',
                        payload: {

                        }
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },
        *getEvWXSettings ({payload},{select, call, put}){

            const baseGetUrl = config.evSettingsGet;

            const {data} = yield call(httpPost, baseGetUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            evCoverImageUrl: data.data.coverImageUrl,
                            wxCommentDesc: data.data.wxCommentDesc,
                            wxCommentTitle: data.data.wxCommentTitle,
                        }
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },

        *updateEvWXSettings ({payload},{select, call, put}){

            const baseGetUrl = config.evSettingsUpdate;

            payload.coverImageUrl = yield select(({deskQrCode}) => deskQrCode.evCoverImageUrl);
            payload.wxCommentDesc = yield select(({deskQrCode}) => deskQrCode.wxCommentDesc);
            payload.wxCommentTitle = yield select(({deskQrCode}) => deskQrCode.wxCommentTitle);


            const {data} = yield call(httpPost, baseGetUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success('保存成功');
                    yield put({
                        type: 'getEvWXSettings',
                        payload: {

                        }
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },

        *getOrderMergeTime ({payload},{select, call, put}){

            const baseGetUrl = config.getOosBase;

            const {data} = yield call(httpPost, baseGetUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {

                    yield put({
                        type: 'updatePayload',
                        payload: {
                            countDownTime:data.data.countDownTime,
                            isUseCountDown:data.data.isUseCountDown,
                            orderMergeTime:data.data.orderMergeTime,
                            adString:data.data.indexAdImgVO?data.data.indexAdImgVO.adString:"",
                            bgImg:data.data.indexAdImgVO?data.data.indexAdImgVO.bgImg:"",
                            img1:data.data.indexAdImgVO&&data.data.indexAdImgVO.imgList&&data.data.indexAdImgVO.imgList.length > 0?data.data.indexAdImgVO.imgList[0].img:'',
                            url1:data.data.indexAdImgVO&&data.data.indexAdImgVO.imgList&&data.data.indexAdImgVO.imgList.length > 0?data.data.indexAdImgVO.imgList[0].url:'',
                            img2:data.data.indexAdImgVO&&data.data.indexAdImgVO.imgList&&data.data.indexAdImgVO.imgList.length > 1?data.data.indexAdImgVO.imgList[1].img:'',
                            url2:data.data.indexAdImgVO&&data.data.indexAdImgVO.imgList&&data.data.indexAdImgVO.imgList.length > 1?data.data.indexAdImgVO.imgList[1].url:'',
                            img3:data.data.indexAdImgVO&&data.data.indexAdImgVO.imgList&&data.data.indexAdImgVO.imgList.length > 2?data.data.indexAdImgVO.imgList[2].img:'',
                            url3:data.data.indexAdImgVO&&data.data.indexAdImgVO.imgList&&data.data.indexAdImgVO.imgList.length > 2?data.data.indexAdImgVO.imgList[2].url:'',

                        }
                    });
                } else {
                    message.warning(data.msg);
                }
            }
        },

        *updateOrderMergeTime ({payload},{select, call, put}){

            const baseGetUrl = config.updateOosBase;

            payload.countDownTime = yield select(({deskQrCode}) => deskQrCode.countDownTime);

            payload.isUseCountDown = yield select(({deskQrCode}) => deskQrCode.isUseCountDown);

            payload.orderMergeTime = yield select(({deskQrCode}) => deskQrCode.orderMergeTime);

            let img1 = yield select(({deskQrCode}) => deskQrCode.img1);
            let img2 = yield select(({deskQrCode}) => deskQrCode.img2);
            let img3 = yield select(({deskQrCode}) => deskQrCode.img3);

            let url1 = yield select(({deskQrCode}) => deskQrCode.url1);
            let url2 = yield select(({deskQrCode}) => deskQrCode.url2);
            let url3 = yield select(({deskQrCode}) => deskQrCode.url3);

            let indexAdImgVO = {};

            let imgList = [];
            if (img1)
            imgList.push({img:img1,url:url1});
            if (img2)
            imgList.push({img:img2,url:url2});
            if (img3)
            imgList.push({img:img3,url:url3});


            indexAdImgVO.adString = yield select(({deskQrCode}) => deskQrCode.adString);

            indexAdImgVO.bgImg = yield select(({deskQrCode}) => deskQrCode.bgImg);

            indexAdImgVO.imgList = imgList;

            payload.indexAdImgVO = indexAdImgVO;

            const {data} = yield call(httpPost, baseGetUrl, payload);
            if (data) {

                if (data.code == config.MSGCODE_SUCCESS) {
                    message.success('保存成功');
                    yield put({
                        type: 'getOrderMergeTime',
                        payload: {

                        }
                    });

                } else {
                    message.warning(data.msg);
                }
            }
        },

        *querySelectBusinessHours({ payload }, { select, call, put }) {

            const orderListUrl = config.selectBusinessHours;

            const { data } = yield call(httpPost,orderListUrl, payload);
            if (data) {

                if(data.code == config.MSGCODE_SUCCESS){
                    yield put({
                        type: 'updatePayload',
                        payload: {
                            businessList: data.data,
                            selectId:data.data.length>0 ? data.data[0].id:-1
                        },
                    });

                    yield put({
                        type: 'getList',
                        payload: {},
                    });

                }else{
                    console.log(data.msg);
                }
            }
        },


    },
    reducers: {
        updatePayload(state, action) {
            return {...state, ...action.payload,};
        },

        getListSuccess(state, action) {
            return {...state, ...action.payload,loading: false,visible:false};
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

        /*显示加载提示*/
        showLoading(state) {
            return {...state, loading: true};
        },

        /*隐藏加载提示*/
        hideLoading(state) {
            return {...state, loading: false};
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

            }


            return {...state, locationInfo: locationInfo};

        },
        /*显示二维码*/
        updateShow(state,action){
            return { ...state, ...action.payload,};
        },
        /*二维码列表*/
        updateQrCodelist(state,action){
            return { ...state, ...action.payload,};
        },
        /*更新请求参数*/
        updateParm(state,action){
            return { ...state, ...action.payload,};
        },

    }
}