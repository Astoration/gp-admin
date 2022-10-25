import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getInquiries, deleteInquiry } from '../api';
import './tableList.scss';

const SCHEMA = {
  apiGetList: getInquiries,
  selectable: true,
  listLink: '/inquiries',
  createLink: (id) => `/inquiries/${id}`,
  mainField: 'message',
  excelFilename: '문의목록.xlsx',
  tableFields: ['writer','company','message','createdAtDate'],
  selectActions: [
    {
      name: '삭제',
      api: (ids) => {
        return Promise.all(ids.map((id) => deleteInquiry(id))).then((v) => ({ status: 200, body: true }));
      },
    },
  ],
  fields: {
    writer: {
      type: 'string',
      name: '이름',
      width: '8em',
    },
    company: {
        type: 'company',
        name: '인쇄사',
        width: '6em',
    },
    message: {
      type: 'text',
      name: '내용',
      width: '20em',
    },
    createdAtDate: { type: 'dateMeta', name: '일시' },
  },
  footer: (id) => (
    <div>
     
    </div>
  ),
};

export default class InquiryList extends Component {
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

InquiryList.contextTypes = {
};