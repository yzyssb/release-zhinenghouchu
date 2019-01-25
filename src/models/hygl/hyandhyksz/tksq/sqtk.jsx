/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-04-08 17:14:50
 * @version $Id$
 */



export default {
  namespace: 'sqtk',
  state: {
    offset: 1,
    size: 10,
    restaurantId: 1,
    sqtkVisible: false,
    commentTypes: [1, 2, 3],
    groupList: [],
    id: '',
    total: 0,
    current: 10,
      "data": {
          "list": [{
              "id": "48",
              "uid": "54393",
              "type": "1",
              "material": "http:\/\/27aichi.oss-cn-qingdao.aliyuncs.com\/Uploads\/Admin\/Default\/2018-01-15\/1516001979fc0w.jpeg",
              "status": "0",
              "createtime": "1516001990",
              "v_time": "0",
              "mark": "",
              "nickname": "你的任性我惯着",
              "cardcode": "5439399218900",
              "mobile": "123456789",
              "store_name": "火宴山新疆菜来了",
              "username": null,
              "ck_time": "0",
              "gusername": "admin",
              "hcardcode": "9146983326",
              "buytime": "1512615159",
              "card_money": "0.01",
              "stored_money": "0.01",
              "order_id": "0",
              "remark": "",
              "reward": "0.88",
              "totalrew": "2.99",
              "scores": "985368.16",
              "total_scores": "988367.98",
              "coupon_count": "28",
              "order_num": "54393992195996315",
              "is_receipt": 0
          }]},

    headImg: '',
    password: '',
    phone: '',
    idCardNo: '',
    sex: '',
    groupId: '',
    userName: 'hahahh',
    waiterName: '',
    gmtEnter: '',
    gmtLeave: '',

    remark: '',
    address: '',
    tabsActiveKey: 'sqtk', //当前激活 tab 面板的 key

  },
  reducers: {
    updatePayload(state, action) {
      return {
        ...state, ...action.payload,
      };
    },

  }
}