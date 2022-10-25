import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getCenters, deleteCenter, getCenter, postCenter, patchCenter } from '../api';
import './tableList.scss';

const SCHEMA = {
  apiGetItem: getCenter,
  apiGetList: getCenters,
  apiPostItem: postCenter,
  apiPatchItem: patchCenter,
  selectable: true,
  listLink: '/centers',
  selectable: true,
  selectActions: [{ name: '삭제', api: (ids) => Promise.all(ids.map((id) => deleteCenter(id))).then((v) => v[0]) }],
  createLink: (id) => `/centers/${id}`,
  mainField: 'name',
  creatable: '추가하기',
  mainFilterFields: ['name','call'],
  filterFields: ['area', 'isEnabled'],
  tableFields: ['area','name','address','call'],
  fields: {
    area: { type: 'enum', name: '지역', values: ['서울특별시','인천광역시','경기도','충청/전라도','경상도','강원','제주'] },
    isEnabled: { type: 'boolean', name: '게시여부' },
    name: { type: 'string', name: '센터명'},
    address: { type: 'text', name: '주소'},
    call: { type: 'string', name:'전화번호'},
  }
};

export default class CenterList extends Component {
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
