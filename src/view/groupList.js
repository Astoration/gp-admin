import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getGroups, deleteGroup, getGroup, postGroup, patchGroup } from '../api';
import './tableList.scss';

const SCHEMA = {
  apiGetItem: getGroup,
  apiGetList: getGroups,
  apiPostItem: postGroup,
  apiPatchItem: patchGroup,
  selectable: true,
  listLink: '/groups',
  selectActions: [{ name: '삭제', api: (ids) => Promise.all(ids.map((id) => deleteGroup(id))).then((v) => v[0]) }],
  createLink: (id) => `/groups/${id}`,
  mainField: 'name',
  creatable: '추가하기',
  tableFields: ['name','description','userCount','isEnabled','user','createdAt'],
  fields: {
    isEnabled: { type: 'boolean', name: '사용여부' },
    name: { type: 'string', name: '그룹명'},
    description: { type: 'string', name: '설명'},
    noticeEnabled: { type: 'boolean', name:'메인전시 관리'},
    popupEnabled: { type: 'boolean', name:'팝업 관리'},
    productEnabled: { type: 'boolean', name:'정수기 관리'},
    filterEnabled: { type: 'boolean', name:'필터 관리'},
    centerEnabled: { type: 'boolean', name:'서비스센터 관리'},
    questionEnabled: { type: 'boolean', name:'고객문의 관리'},
    faqEnabled: { type: 'boolean', name:'FAQ 관리'},
    userEnabled: { type: 'boolean', name:'사용자 관리'},
    groupEnabled: { type: 'boolean', name:'그룹 관리'},
    user: {type:'string', name: '등록자', readOnly: true},
    userCount: {type:'number', name: '등록인원', readOnly: true},
    createdAt: {type: 'dateMeta',name: '등록일자'}
  }
};

export default class GroupList extends Component {
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
