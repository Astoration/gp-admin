import React, { Component } from 'react';

import TabList, { TabEntry } from '../component/tabList';
import DataView from '../container/dataView';

import Popup from "reactjs-popup";
import TextareaAutosize from 'react-textarea-autosize';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import DataViewSingle from '../container/dataViewSingle';
import { UserContext } from './app';
import moment from 'moment';
import {
  getNotice, getNotices, patchNotice, postNotice, deleteNotice,
  deleteUserPhoto, postUserPhotos, getUsers, getUser, postUser, deleteUser, patchUser,
  getComments, postComment, postMatching, getMatching, deleteMatching, getPlaces, patchMatching,
} from '../api';

function getSchema(type){
  if(type == 0){
    return ({
      apiGetList: getUsers,
      apiGetItem: getUser,
      apiPatchItem: patchUser,
      apiPostItem: postUser,
      apiDeleteItem: deleteUser,
      selectable: true,
      selectActions: [
        { name: '삭제', api: (ids) => Promise.all(ids.map((id) => deleteUser(id))).then((v) => v[0]) },
      ],
      creatable: '등록',
      noOpen: true,
      listLink: '/teachers',
      createLink: (id) => `/teachers/${id}`,
      mainField: 'name',
      mainFilterFields: ['id', 'name'],
      preFilter: { isEnabled: true, userType: 0 },
      filterFields: ['name'],
      tableFields: ['name','identifier','email','createdAt','updatedAt'],
      fields: {
        headerProfile: { type: 'title', name: '회원 정보' },
        pseudoId: { type: 'pseudoId', name: '번호', hidden: true, width: '5em' },
        id: { type: 'id', name: '번호', hidden: true },
        name: { type: 'string', name: '이름', width: '5em' },
        identifier: { type: 'string', name: '아이디', width: '5em' },
        password: { type: 'string', name: '비밀번호 변경', width: '5em' },
        email: { type: 'string', name: '이메일', width: '5em' },
        createdAt: { type: 'dateMeta', name: '등록일' },
        updatedAt: { type: 'dateMeta', name: '수정일' },
      },
    });
  }else{
    return ({
      apiGetList: getUsers,
      apiGetItem: getUser,
      apiPatchItem: patchUser,
      apiPostItem: postUser,
      apiDeleteItem: deleteUser,
      selectable: true,
      selectActions: [
        { name: '삭제', api: (ids) => Promise.all(ids.map((id) => deleteUser(id))).then((v) => v[0]) },
      ],
      creatable: '등록',
      noOpen: true,
      listLink: '/users',
      createLink: (id) => `/users/${id}`,
      mainField: 'name',
      mainFilterFields: ['id', 'name'],
      preFilter: { isEnabled: true, userType: 1 },
      filterFields: ['name'],
      tableFields: ['name','grade','identifier','email','teacher','createdAt','updatedAt'],
      fields: {
        headerProfile: { type: 'title', name: '회원 정보' },
        pseudoId: { type: 'pseudoId', name: '번호', hidden: true, width: '5em' },
        id: { type: 'id', name: '번호', hidden: true },
        name: { type: 'string', name: '이름', width: '5em' },
        grade: { type: 'string', name: '학년', width: '5em' },
        identifier: { type: 'string', name: '아이디', width: '5em' },
        password: { type: 'string', name: '비밀번호 변경', width: '5em' },
        email: { type: 'string', name: '이메일', width: '5em' },
        teacher: { type: 'string', name: '담당선생님', width: '5em' },
        createdAt: { type: 'dateMeta', name: '등록일' },
        updatedAt: { type: 'dateMeta', name: '수정일' },
      },
    });
  }
}

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: Object.assign(getSchema(this), {
        schema: getSchema(this.props.userType)
      }),
    };
  }

  componentWillReceiveProps(nextProps) {
    
  }

  async componentDidMount() {
    this.setState({
      schema: getSchema(this.props.userType)
    });
  }

  render() {
    return (
      <div className='user-list-view'>
        <DataView schema={this.state.schema} user={this.context.user} {...this.props} id={this.props.match.params.id} />
      </div>
    );
  }
}

UserList.contextType = UserContext;