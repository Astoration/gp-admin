import React, { Component } from 'react';

import TabList, { TabEntry } from '../component/tabList';
import DataView from '../container/dataView';
import { getWeddingLogs, getWeddingLog, postWeddingLogs, patchWeddingLog,
    getEmployeeTables, getEmployeeTable, postEmployeeTables, patchEmployeeTable,
    deleteEmployeeTable, deleteWeddingLog } from '../api';
import './tableList.scss';

const SCHEMA = {
  apiGetList: getEmployeeTables,
  apiGetItem: getEmployeeTable,
  apiPostItem: postEmployeeTables,
  apiPatchItem: patchEmployeeTable,
  listLink: '/sales',
  createLink: (id) => `/sales/${id}`,
  creatable: true,
  mainFilterFields: ['name'],
  selectable: true,
  noPaging: true,
  filterFields: ['from','to'],
  selectActions: [
    { name: '삭제', api: (ids) => Promise.all(ids.map((id) => deleteEmployeeTable(id))).then((v) => v[0]) },
  ],
  mainField: 'name',
  tableFields: ['name','salery','insuranceType','registerIncentiveRatio','matchingIncentiveRatio'
        ,'registerCount','matchingCount', 'incentive','penaltyPercent','penaltyAmount'],
  excelFilename: '회계.xlsx',
  noExcelFetch: true,
  fields: {
    from: { type: 'date', name:'일자 시작', hidden: true, },
    to: { type: 'date', name:'일자 끝', hidden: true, },
    name: {type:'string', name: '매니저명' },
    salery: {type:'integer', name: '연봉'},
    insuranceType: {type:'enum', name: '4대보험 여부', values: ['Y','N','3.3%'] },
    registerIncentiveRatio: {type:'number', postFix: '%', name: '가입 인센티브 비율' },
    matchingIncentiveRatio: {type:'number', postFix: '%', name: '매칭 인센티브 비율' },
    registerCount: {type:'string', name: '가입 인센티브 (건수)',
      getter: (item) => {
        return `${(item.registerAmount * (item.registerIncentiveRatio  / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (${item.registerCount})`;
      } },
    matchingCount: {type:'string', name: '매칭 인센티브 (건수)',
      getter: (item) => {
        return `${(item.matchingAmount * (item.matchingIncentiveRatio / 100)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} (${item.matchingCount})`;
      } },
    incentive:  {type: 'integer', name: '인센티브', 
      getter: (item) => (((item.registerAmount * (item.registerIncentiveRatio / 100) + (item.matchingAmount * (item.matchingIncentiveRatio / 100))) * ((100 - (item.penaltyPercent || 0))/100) - (item.penaltyAmount || 0))) 
    },
    penaltyPercent: {type: 'number', name: '패널티(%)', editable: true},
    penaltyAmount: {type: 'number', name: '패널티(￦)', editable: true},
    createdAt: {type: 'dateMeta',name: '등록일자'}
  }
};

const LOG_SCHEMA = {
    apiGetList: getWeddingLogs,
    apiGetItem: getWeddingLog,
    apiPostItem: postWeddingLogs,
    apiPatchItem: patchWeddingLog,
    listLink: '/saleLogs',
    selectable: true,
    createLink: (id) => `/saleLogs/${id}`,
    creatable: true,
    tableFields: ['date','managerId','type','payment','memo'],
    mainFilterFields: ['managerId'],
    filterFields: ['from','to'],
    selectActions: [
        { name: '삭제', api: (ids) => Promise.all(ids.map((id) => deleteWeddingLog(id))).then((v) => v[0]) },
      ],
    fields: {
      from: { type: 'date', name:'일자 시작', hidden: true, },
      to: { type: 'date', name:'일자 끝', hidden: true, },
      managerId: { type: 'enum', width: '4em', width: '8.5em', name: '매니저명', values: {}},
      payment: {type:'integer', width: '7em', name: '금액'},
      type: {type:'enum', width: '4em', name: '유형', values: {
          register: '가입',
          matching: '성혼',
          withdraw: '탈회'
      } },
      memo: {type:'text', name: '메모' },
      date: {type: 'date',name: '날짜', width: '7em'},
      createdAt: {type: 'dateMeta',name: '등록일자'}
    }
  };

export default class SalesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      managers: {},
      schema: LOG_SCHEMA,
    }
  }

  async componentDidMount() {
    const managers = await getEmployeeTables();
    let manager = {};
    for(let v of managers.body.result){
      manager[v.id] = v.name;
    }
    this.setState({
      schema: Object.assign(LOG_SCHEMA, {
        fields: Object.assign(LOG_SCHEMA.fields, { 
          managerId: { type: 'enum', width: '8.5em', name: '매니저명', values: manager},
        }),
      }),
      managers: manager,
    });
  }

  componentWillReceiveProps(nextProps) {
  }
  render() {
    let { match } = this.props;
    return (
        <div>
      <TabList defaultSelected={this.props.index || 0}>
          <TabEntry name="직원 관리">
            <div className='user-list-view'>
                <DataView user={this.context.user} schema={SCHEMA} id={match.params.id} />
            </div>        
          </TabEntry>
          <TabEntry name="기록 관리">
            <div className='user-list-view'>
                <DataView user={this.context.user} schema={this.state.schema} id={match.params.id} />
            </div>        
          </TabEntry>
      </TabList>
      </div>
      
    );
  }
}