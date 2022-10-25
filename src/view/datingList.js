import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getAdminComments } from '../api';
import './tableList.scss';

const SCHEMA = {
  apiGetList: getAdminComments,
  noOpen: true,
  listLink: '/comments',
  createLink: (id) => `/comments/${id}`,
  mainFilterFields: ['user', 'phone'],
  filterPreset: { dateFrom: new Date(new Date().setHours(0,0,0,0)).toISOString(), dateTo: new Date(new Date().setHours(0,0,0,0) + (24 * 60 * 60 * 1000)).toISOString() },
  preFilter: { hasDating: true },
  filterFields: ['dateFrom','dateTo'],
  tableFields: ['pseudoId', 'user', 'body', 'date', 'createdAt','manager'],
  fields: {
    dateFrom: { type: 'date', name:'일자 시작' },
    dateTo: { type: 'date', name:'일자 끝' },
    pseudoId: { type: 'pseudoId', name: '번호', hidden: true, width: '3em' },
    date: { type: 'dateMeta', name: '알람일자', width: '6em' },
    userType: { type: 'enum', name: '회원 분류', values: ['정회원','가입대기','준회원'], getter: (item) => item.user.userType, width: '5em'  },
    user: { type: 'user', name: '회원명', width: '4em'  },
    phone: { type: 'phone', name: '회원연락처', width: '4em' , getter: (item) => item.user.phone },
    manager: { type: 'user', name: '담당매니저', width: '4em'  },
    body: {
      type: 'text',
      name: '내용',
      width: '20em',
    },
    createdAt: { type: 'dateMeta', name: '일시', width: '6em'  },
  },
};


export default class DatingList extends Component {
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