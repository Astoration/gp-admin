import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getSystemLogs } from '../api';
import './tableList.scss';

const SCHEMA = {
  apiGetList: getSystemLogs,
  listLink: '/systemLogs',
  createLink: (id) => `/systemLogs/${id}`,
  tableFields: ['manager','identifier','type','createdAt'],
  excelFilename: '로그인이력.xlsx',
  fields: {
    type: {type:'string', name: '유형' },
    manager: {type:'manager', name: '직원', readOnly: true},
    identifier: {type:'string', name: '아이디' },
    createdAt: {type: 'datetime',name: '등록일자'}
  }
};

export default class SystemLogList extends Component {
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
      <div className='user-list-view'>
        <DataView user={this.context.user} schema={this.state.schema} id={match.params.id} />
      </div>
    );
  }
}