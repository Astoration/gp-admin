import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getBusiness, getBusinesses, deleteBusiness, postBusinesses, patchBusiness, deleteBusinessPhoto, postBusinessPhotos, uploadPdf } from '../api';
import './tableList.scss';
import { BusinessContext } from './app';

import Dropzone from 'react-dropzone';

const SCHEMA = {
  apiGetItem: getBusiness,
  apiGetList: getBusinesses,
  apiPostItem: postBusinesses,
  apiPatchItem: patchBusiness,
  apiDeleteItem: deleteBusiness,
  selectable: true,
  listLink: '/businesses',
  createLink: (id) => `/businesses/${id}`,
  creatable: true,
  mainField: 'name',
  selectActions: [
    {
      name: '삭제',
      api: (ids) => {
        return Promise.all(ids.map((id) => deleteBusiness(id))).then((v) => ({ status: 200, body: true }));
      },
    },
  ],
  preFilter: { isAdmin: true },
  mainField: 'title',
  tableFields: ['id','title','duration','cost','createdAt'],
  fields: {
    id: { type: 'pseudoId', hidden: true, name:'번호'},
    title: {
      type: 'string',
      name: '사업명'
    },
    duration: {
      type: 'string',
      name: '사업기간'
    },
    location: {
      type: 'string',
      name: '사업위치'
    },
    cost: {
      type: 'string',
      name: '사업비'
    },
    department: {
      type: 'string',
      name: '사업부서'
    },
    photos: {
      type: 'photos',
      name: '사진',
      uploadWithPhoto: true,
      thumbs: 'photoThumbs',
      apiDelete: deleteBusinessPhoto,
      apiPost: postBusinessPhotos,
    },
    createdAt: { type: 'dateMeta', name: '생성일' },
    updatedAt: { type: 'dateMeta', name: '수정일' },
  },
};

export default class BusinessList extends Component {
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
      <div className='Business-list-view'>
        <DataView Business={this.context.Business} schema={this.state.schema} id={match.params.id} />
      </div>
    );
  }
}
