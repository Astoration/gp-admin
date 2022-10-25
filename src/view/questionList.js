import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getQuestions, getQuestion, deleteQuestion, patchQuestion } from '../api';
import './tableList.scss';

const SCHEMA = {
  apiGetList: getQuestions,
  apiGetItem: getQuestion,
  apiPatchItem: patchQuestion,
  listLink: '/questions',
  createLink: (id) => `/questions/${id}`,
  mainField: 'title',
  mainFilterFields: ['title','body'],
  filterFields: ['category','status','from','to'],
  tableFields: ['category','title','name','createdAt','status','answeredAt'],
  fields: {
    category: {
      type: 'enum',
      name: '문의분류',
      readOnly: true,
      values: ['상품 문의','AS 문의','제휴 문의']
    },
    createdAt: {
        type: 'dateMeta',
        name:'문의일자'
    },
    name: {
        type: 'string',
        name:'이름',
        readOnly: true,
        full:true,
    },
    from: { type: 'date', name: '기간 검색 시작', hidden: true },
    to: { type: 'date', name: '기간 검색 끝', hidden: true },
    phone: { type: 'string', name: '전화번호', readOnly: true },
    email: { type: 'string', name:'이메일', readOnly: true },
    title: {
        type: 'string',
        name: '문의제목',
        readOnly: true,
    },
    body: {
      type: 'text',
      name: '내용',
      width: '20em',
      readOnly: true,
    },
    status: {
      type: 'enum',
      name: '진행상태',
      values: ['문의 접수','답변 완료'],
      getter: item => item.answerBody == null ? 0:1
    },
    sendEmail: {
        type: 'boolean',
        name: '답변 이메일 발송',

    },
    answerBody: {
      type: 'html',
      name: '답변 내용',
    },
    answeredAt: {
      type: 'dateMeta',
      name:'답변일'
    }
  },
  footer: (id) => (
    <div>
     
    </div>
  ),
};

export default class QuestionList extends Component {
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

QuestionList.contextTypes = {
};