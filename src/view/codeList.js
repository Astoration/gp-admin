import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getCenters, deleteCenter, getCenter, postCenter } from '../api';
import './tableList.scss';

const SCHEMA = {
  apiGetItem: getCenter,
  apiGetList: getCenters,
  apiPostItem: postCenter,
  selectable: true,
  listLink: '/centers',
  createLink: (id) => `/centers/${id}`,
  mainField: 'name',
  creatable: '추가하기',
  mainFilterFields: ['id','codeName'],
  tableFields: ['id','codeName','description','parentCode','temp1','temp2','temp3','temp4'],
  fields: {
    id: { type: 'number', name: '코드' },
    isEnabled: { type: 'boolean', name: '게시여부' },
    codeName: { type: 'string', name: '코드명' },
    description: { type: 'string', name: '코드설명' },
    parentCode: { type: 'string', name: '상위코드' },
    temp1: { type: 'string', name: '임시필드1' },
    temp2: { type: 'string', name: '임시필드2' },
    temp3: { type: 'string', name: '임시필드3' },
    temp4: { type: 'string', name: '임시필드4' },
  }
};

export default class CodeList extends Component {
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
