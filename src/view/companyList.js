import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getCompanies, getProducts, getEquipment, getCompany, putCompany,
  postCompany, deleteCompany, getCommodity, postCommodity, deleteCommodity, deleteEquipment } from '../api';
import './tableList.scss';
import TabList, { TabEntry } from '../component/tabList';
import DataViewSingle from '../container/dataViewSingle';
import { UserContext } from './app';
const SCHEMA = {
  apiPostItem: postCompany,
  apiDeleteItem: deleteCompany,
  apiGetList: getCompanies,
  selectable: true,
  listLink: '/unions',
  createLink: (id) => `/unions/${id}`,
  scrollable: true,
  inlineCreate: true,
  creatable: true,
  openSingle: true,
  mainField: 'csn',
  selectActions: [
    {
      name: '삭제',
      api: (ids) => {
        return Promise.all(ids.map((id) => deleteCompany(id))).then((v) => ({ status: 200, body: true }));
      },
    },
  ],
  excelFilename: '조합원목록.xlsx',
  tableFields: ['csn', 'brand', 'charger', 'amtEmployee', 'representive', 'mobile', 'telePhone', 'fax', 'email',
    'address1', 'address2', 'posdCode', 'isGuild'],
  fields: {
    csn: {
      type: 'string',
      name: '사업자등록번호',
      width: '8em',
    },
    brand: {
      type: 'string',
      name: '상호명',
      width: '6em',
    },
    charger: {
      type: 'string',
      name: '대표이사',
      width: '6em',
    },
    amtEmployee: {
      type: 'number',
      name: '상근직원수',
      width: '6em',
    },
    representive: {
      type: 'string',
      name: '담당자',
      width: '6em',
    },
    mobile: { type: 'string', name: '담당자모바일번호' },
    telePhone: { type: 'string', name: '담당자번호' },
    fax: { type: 'string', name: '팩스번호' },
    email: { type: 'string', name: '담당자이메일' },
    address1: { type: 'string', name: '주소1' },
    address2: { type: 'string', name: '주소2' },
    posdCode: { type: 'string', name: '우편번호' },
    isGuild: { type: 'boolean', name: '조합회원 여부', width: '4em' },
  },
  detailRender: (_, footer) => <div>{footer}</div>,
  footer: (id, item, fetch) => (
    <div>
      <TabList>
        <TabEntry name='개요'>
          <DataViewSingle
            parentDataView={fetch}
            schema={Object.assign(SCHEMA_RESUME, {
              apiPatchItem: putCompany.bind(null),
              apiGetItem: getCompany.bind(null, id),
            })} />
        </TabEntry>
        <TabEntry name='일반정보'>
          <DataViewSingle
            parentDataView={fetch}
            schema={Object.assign(SCHEMA_INFO, {
              apiPatchItem: putCompany.bind(null),
              apiGetItem: getCompany.bind(null, id),
            })} />
        </TabEntry>
      </TabList>
      <h2>상품 정보</h2>
      <DataView schema={Object.assign(COMMODITY_SCHEMA, {
        apiPostItem: postCommodity.bind(null, item.csn),
        apiGetList: getCommodity.bind(null, item.csn),
      })} />
      <h2>장비 정보</h2>
      <DataView schema={Object.assign(EQUIPMENT_SCHEMA, {
        apiGetList: getEquipment.bind(null, item.csn),
      })} />
    </div>
  ),
};

const SCHEMA_INFO = {
  fields: {
    greeting: {
      type: 'html',
      name: '인사말',
      full: true,
    },
    history: {
      type: 'html',
      name: '연혁',
      full: true,
    },
    position: {
      type: 'iframe',
      name: '위치',
      full: true,
    },
  },
};

const SCHEMA_RESUME = {
  fields: {
    brand: {
      type: 'string',
      name: '상호',
      width: '6em',
    },
    charger: {
      type: 'string',
      name: '대표이사',
      width: '6em',
    },
    csn: {
      type: 'string',
      name: '사업자등록번호',
      width: '8em',
    },
    representive: {
      type: 'string',
      name: '담당자',
      width: '6em',
    },
    address1: { type: 'string', name: '주소1' },
    telePhone: { type: 'string', name: '담당자번호' },
    address2: { type: 'string', name: '주소2' },
    fax: { type: 'string', name: '팩스번호' },
    mobile: { type: 'string', name: '담당자모바일번호' },
    email: { type: 'string', name: '담당자이메일' },
    amtEmployee: {
      type: 'number',
      name: '상근직원수',
      width: '6em',
    },
    webHardUrl: { type: 'string', name: '웹하드' },
    webHardId: { type: 'string', name: '웹하드 아이디' },
    webHardPw: { type: 'string', name: '웹하드 비밀번호' },
    createdAtDate: { type: 'dateMeta', name: '가입일' },
    registeryType: { type: 'enum', values: ['직접', '모두인쇄'], name: '가입방법' },
    postCode: { type: 'string', name: '우편번호' },
    isGuild: { type: 'boolean', name: '조합회원 여부', width: '4em' },
  },
};

const EQUIPMENT_SCHEMA = {
  selectable: true,
  listLink: '/equipments',
  createLink: (id) => `/equipments/${id}`,
  tableFields: ['manufacturer', 'title'],
  verticalScroll: true,
  selectActions: [
    {
      name: '삭제',
      api: (ids) => {
        return Promise.all(ids.map((id) => deleteEquipment(id))).then((v) => ({ status: 200, body: true }));
      },
    },
  ],
  noOpen: true,
  scrollable: true,
  fields: {
    manufacturer: {
      type: 'string',
      name: '상품',
      width: '15em',
      full: true,
      getter: (item) => item.codes.value,
    },
    title: {
      width: '15em',
      full: true,
      type: 'string',
      name: '제품명',
    },
  },
};

const COMMODITY_SCHEMA = {
  selectable: true,
  listLink: '/commodities',
  createLink: (id) => `/commodities/${id}`,
  tableFields: ['productType'],
  scrollable: true,
  noOpen: true,
  verticalScroll: true,
  inlineCreate: true,
  creatable: true,
  selectActions: [
    {
      name: '삭제',
      api: (ids) => {
        return Promise.all(ids.map((id) => deleteCommodity(id))).then((v) => ({ status: 200, body: true }));
      },
    },
  ],
  fields: {
    productType: {
      type: 'enum',
      width: '15em',
      full: true,
      values: {
        poster: '포스터',
        flyer: '전단지',
        leaflet: '리플릿',
      },
      name: '상품',
    },
  },
};

const PRODUCT_SCHEMA = {
  selectable: true,
  listLink: '/products',
  createLink: (id) => `/products/${id}`,
  mainField: 'productName',
  tableFields: ['productName', 'paper', 'paperSize', 'colorType', 'quantity', 'price'],
  verticalScroll: true,
  fields: {
    productName: {
      type: 'string',
      name: '상품',
      getter: (item) => item.commodity.remark,
    },
    paper: {
      type: 'string',
      name: '용지',
      getter: (item) => item.paperType.paperType,
    },
    paperSize: {
      type: 'string',
      name: '사이즈',
    },
    colorType: {
      type: 'string',
      name: '인쇄방법',
      getter: (item) => item.colorType.colorType,
    },
    quantity: {
      type: 'number',
      name: '수량',
    },
    price: { type: 'number', name: '가격' },
  },
};

export default class CompanyList extends Component {
  constructor(props) {
    super(props);
    console.log(this.context);
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
      <div className='union-list-view'>
        <UserContext.Consumer>
          { (user) =>
        (<DataView user={this.context.user} schema={Object.assign(this.state.schema, { apiGetList: async () => {
          let { status, body } = await getCompanies();
          if (status != 200) throw body;
          if (user.user.role != 'admin') {
            body.results = body.results.filter(item => item.id == user.user.role);
          }
          return { status, body };
        } })} id={match.params.id} />)
         }
        </UserContext.Consumer>
      </div>
    );
  }
}

CompanyList.contextTypes = {
};
