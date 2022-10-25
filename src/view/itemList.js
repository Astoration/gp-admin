import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getItem, getItems, deleteItem, postItem, patchItem, deleteItemPhoto, postItemPhotos, uploadPdf } from '../api';
import './tableList.scss';
import { ItemContext } from './app';

import Dropzone from 'react-dropzone';
const SCHEMA = {
  apiGetItem: getItem,
  apiGetList: getItems,
  apiPostItem: postItem,
  apiPatchItem: patchItem,
  apiDeleteItem: deleteItem,
  selectable: true,
  listLink: '/items',
  createLink: (id) => `/items/${id}`,
  creatable: true,
  mainField: 'name',
  mainField: 'title',
  filterFields: ['category'],
  tableFields: ['id','category','title','duration','cost','department','createdAt'],
  fields: {
    id: { type: 'pseudoId',name:'번호'},
    title: {
      type: 'string',
      name: '사업명'
    },
    category: {
      type: 'enum',
      name: '분야',
      values: ['희망복지', '문화체육관광', '인재육성', '지역개발', '지역경제', '살맛나는농촌']
    },
    duration: {
        type: 'string',
        name: '완료연도',
    },
    department: {
        type: 'string',
        name: '추진부서',
    },
    status: {
        type: 'enum',
        name: '현황',
        values: ['완료','이행 후 계속','정상추진','일부추진','보류','폐기'],
    },
    cost: {
        type: 'number',
        name: '소요예산(백만원)',
    },
    createdAt: { type: 'dateMeta', name: '생성일' },
    updatedAt: { type: 'dateMeta', name: '수정일' },
  },
};

export default class ItemList extends Component {
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
      <div className='Item-list-view'>
        <Dropzone className='uploadExcel'
          onDrop={files => {
            uploadPdf({ pdf: files },files)
            .then(({ status, body }) => {
              if (status === 200) alert('성공적으로 업로드 하였습니다.');
              else alert('PDF 업로드에 실패했습니다: ' + (body.data || body));
              this.setState({ schema: Object.assign({}, SCHEMA) });
            });
          }}
        >PDF 업로드</Dropzone>
        <DataView Item={this.context.Item} schema={this.state.schema} id={match.params.id} />
      </div>
    );
  }
}
