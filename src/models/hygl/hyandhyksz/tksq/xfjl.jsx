/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-04-08 17:14:50
 * @version $Id$
 */



export default {
  namespace: 'xfjl',
  state: {
    offset: 1,
    size: 10,
    restaurantId: 1,
    xfjlVisible: false,
    commentTypes: [1, 2, 3],
    groupList: [],
    id: '',
    total: 0,
    current: 10,
    list: [],

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
    tabsActiveKey: 'xfjl', //当前激活 tab 面板的 key

  },
  reducers: {
    updatePayload(state, action) {
      return {
        ...state, ...action.payload,
      };
    },

  }
}