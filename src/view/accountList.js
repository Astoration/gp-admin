import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getUsers, deleteUser, postAccount, patchUsers, deleteUserPhoto, postUserPhotos, } from '../api';
import './tableList.scss';
import { UserContext } from './app';
const SCHEMA = {
  apiGetList: getUsers,
  apiPostItem: postAccount,
  apiPatchItem: patchUsers,
  apiDeleteItem: deleteUser,
  selectable: true,
  listLink: '/accounts',
  createLink: (id) => `/accounts/${id}`,
  creatable: true,
  mainField: 'name',
  selectActions: [
    {
      name: '삭제',
      api: (ids) => {
        return Promise.all(ids.map((id) => deleteUser(id))).then((v) => ({ status: 200, body: true }));
      },
    },
  ],
  preFilter: { isAdmin: true },
  mainFilterFields: ['identifier','name','phone'],
  filterFields: ['isEnabled'],
  tableFields: ['id','identifier','name','loggedAt','phone','permission','isEnabled'],
  fields: {
    id: { type: 'id',name:'번호'},
    name: {
      type: 'string',
      name: '이름',
    },
    identifier: {name: '아이디', type: 'string' },
    password: {name: '비밀번호', type: 'string' },
    phone: { type: 'phone', name: '휴대폰번호'},
    photos: {
      type: 'photos',
      name: '사진',
      uploadWithPhoto: true,
      thumbs: 'photoThumbs',
      apiDelete: deleteUserPhoto,
      apiPost: postUserPhotos,
    },
    permission: { type: 'enum', multiple: true, name: '권한그룹', values:['현황지표','연간추이','현안사업','공약사업','사용자관리']},
    isEnabled: { type: 'boolean', name: '사용여부', values: ['미사용','사용']},
    createdAt: { type: 'dateMeta', name: '가입일' },
    loggedAt: { type: 'datetime', name: '최근 로그인' },
  },
};

export default class AccountList extends Component {
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
        <UserContext.Consumer>
          { (user) =>
        (<DataView user={this.context.user} schema={this.state.schema} id={match.params.id} />)
        }
        </UserContext.Consumer>
      </div>
    );
  }
}

AccountList.contextType = UserContext;