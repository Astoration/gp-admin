import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getQuizs, getQuiz, patchQuiz, postQuiz, deleteQuiz, patchQuizBulk, putQuizBulk } from '../api';
import './tableList.scss';

import Dropzone from 'react-dropzone';

const SCHEMA = {
  apiGetList: getQuizs,
  apiGetItem: getQuiz,
  apiPatchItem: patchQuiz,
  apiPostItem: postQuiz,
  apiDeleteItem: deleteQuiz,
  listLink: '/quizs',
  creatable: true,
  selectable: true,
  selectActions: [
    { name: '삭제', api: (ids) => Promise.all(ids.map((id) => deleteQuiz(id))).then((v) => v[0]) },
  ],
  createLink: (id) => `/quizs/${id}`,
  excelFilename:'문제.xlsx',
  mainField: 'index',
  filterFields: ['level','step'],
  tableFields: ['level','step','index','el1','el2','el3','el4','el5','el6','el7','el8','el9','el10','el11','el12'],
  fields: {
    level: { type: 'string', name: '레벨', width: '6em'  },
    step: { type: 'number', name: '스텝', width: '6em'  },
    index: { type: 'number', name: '순번', width: '6em'  },
    el1: { type: 'string', name: '주어' },
    el2: { type: 'string', name: '수식어1' },
    el3: { type: 'string', name: '수식어2' },
    el4: { type: 'string', name: '수식어3' },
    el5: { type: 'string', name: '서술어' },
    el6: { type: 'string', name: '수식어4' },
    el7: { type: 'string', name: '수식어5' },
    el8: { type: 'string', name: '수식어6' },
    el9: { type: 'string', name: '목적어(보어)' },
    el10: { type: 'string', name: '수식어7' },
    el11: { type: 'string', name: '수식어8' },
    el12: { type: 'string', name: '수식어9' },
    createdAt: { type: 'dateMeta', name: '생성일', width: '6em'  },
  },
};


export default class QuizList extends Component {
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
        <Dropzone className='uploadExcel'
          onDrop={files => {
            putQuizBulk({ xlsx: files },files)
            .then(({ status, body }) => {
              if (status === 200) alert('성공적으로 업로드 하였습니다.');
              else alert('엑셀 업로드에 실패했습니다: ' + (body.data || body));
              this.setState({ schema: Object.assign({}, SCHEMA) });
            });
          }}
        >
          엑셀 파일 업로드(변경)
        </Dropzone>
        <Dropzone className='uploadExcel'
          onDrop={files => {
            patchQuizBulk({ xlsx: files },files)
            .then(({ status, body }) => {
              if (status === 200) alert('성공적으로 업로드 하였습니다.');
              else alert('엑셀 업로드에 실패했습니다: ' + (body.data || body));

              this.setState({ schema: Object.assign({}, SCHEMA) });
            });
          }}
        >
          엑셀 파일 업로드(추가)
        </Dropzone>
        <DataView user={this.context.user} schema={this.state.schema} id={match.params.id} />
      </div>
    );
  }
}