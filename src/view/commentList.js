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
  filterFields: ['from','to'],
  tableFields: ['pseudoId','userType', 'user', 'phone', 'body', 'createdAt','manager'],
  fields: {
    from: { type: 'date', name:'일자 시작' },
    to: { type: 'date', name:'일자 끝' },
    pseudoId: { type: 'pseudoId', name: '번호', hidden: true, width: '3em' },
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

export default class CommentList extends Component {
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