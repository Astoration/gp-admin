import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getOrders, getPayment, putPayment  } from '../api';
import TabList, { TabEntry } from '../component/tabList';
import './tableList.scss';

const SCHEMA = {
  apiGetList: getOrders,
  selectable: false,
  listLink: '/orders',
  createLink: (id) => `/orders/${id}`,
  mainField: 'product',
  excelFilename: '주문목록.xlsx',
  scrollable: true,
  tableFields: ['buyerName','company','goodsName', 'payMethod','orderCode','buyerAddr','buyerPostCode','flag','createdAtDate'],
  fields: {
    buyerName: {
      type: 'string',
      name: '주문자',
      width: '8em',
    },
    company: {
        type: 'company',
        name: '조합사',
        width: '6em',
        getter: item => item.order.company
    },
    goodsName: {
      type: 'string',
      name: '상품',
      getter: item => `${item.order.product} ${item.order.paper} ${item.order.size} ${item.order.color} ${item.order.quantity}`
    },
    payMethod: { type: 'enum', name: '결제수단', values: {
      CARD: '카드결제',
    } },
    orderCode: { type: 'string', name: '주문번호', getter: item => item.order.orderCode },
    buyerAddr: { type: 'string', name: '배송주소' },
    buyerPostCode: { type: 'string', name: '우편번호' },
    flag: { type: 'string', name: '상태', getter: item => item.order.flag },
    createdAtDate: { type: 'dateMeta', name: '일시' },
  },
  detailRender: (_, footer) => <div>{footer}</div>,
  footer: (id,item) => (
    <div>
      <TabList>
        <TabEntry name="취소 요청">
          <DataViewSingle schema={Object.assign(SCHEMA_RESUME, {
            apiPatchItem: putPayment.bind(null),
            apiGetItem: getPayment.bind(null, id),
          })} />
        </TabEntry>
      </TabList>
    </div>
  ),
};

export default class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: SCHEMA,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      schema: SCHEMA,
    });
  }
  render() {
    let { match } = this.props;
    return (
      <div className='order-list-view'>
        <DataView user={this.context.user} schema={this.state.schema} id={match.params.id} />
      </div>
    );
  }
}

OrderList.contextTypes = {
};