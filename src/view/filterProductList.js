import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getFilter, getFilters, patchFilter, postFilter, deleteFilter,
  deleteFilterPhoto, postFilterPhotos } from '../api';

const SCHEMA = {
  apiGetList: getFilters,
  apiGetItem: getFilter,
  apiPatchItem: patchFilter,
  apiPostItem: postFilter,
  apiDeleteItem: deleteFilter,
  selectable: true,
  selectActions: [{ name: '삭제', api: (ids) => Promise.all(ids.map((id) => deleteFilter(id))).then((v) => v[0]) }],
  creatable: '등록',
  listLink: '/filterProducts',
  createLink: (id) => `/filterProducts/${id}`,
  mainField: 'name',
  mainFilterFields: ['id','name'],
  filterFields: ['isEnabled','type','category'],
  tableFields: ['pseudoId','type','name','photos', 'category','isEnabled'],
  fields: {
    pseudoId: { type: 'pseudoId', name: '번호', hidden: true, width: '5em' },
    id: { type: 'id', name: '번호', width: '5em' },
    isEnabled: { type: 'boolean', name: '게시 여부', values: ['미게시','게시'] },
    category: { type: 'enum', name: '형태', values: ['11 inch / l type','8 inch / U type','11 inch / Quick-change','11 inch / U type', '13 inch / Quick-change'] },
    type: { type: 'enum', name:'타입', values: ['Sediment','Activate Carbon', 'UF Membrane', 'RO Memberane', 'Mineral', 'Lead Reduction'] },
    createdAt: { type: 'dateMeta', name: '생성일', width: '8em' },
    series: { type: 'string', name: '시리즈'},
    series_en: { type: 'string', name: '시리즈 영문'},
    name: { type: 'string', name: '제품명'},
    name_en: { type: 'string', name: '제품명 영문'},
    price: { type: 'string', name: '제품 가격'},
    price_en: { type: 'string', name: '제품 가격 영문'},
    feature: { type: 'string', name: '제품특징'},
    feature_en: { type: 'string', name: '제품특징 영문'},
    filterVolume: { type: 'string', name: '유효 정수량' },
    filterVolume_en: { type: 'string', name: '유효 정수량 영문' },
    filterTemperature: { type: 'string', name: '허용 온도' },
    filterTemperature_en: { type: 'string', name: '허용 온도 영문' },
    filterPower: {type: 'string', name: '허용 압력'},
    filterPower_en: {type: 'string', name: '허용 압력 영문'},
    filterMateiral: { type: 'string', name: '필터 소재' },
    filterMateiral_en: { type: 'string', name: '필터 소재 영문' },
    maker: { type: 'string', name: '제조원' },
    maker_en: { type: 'string', name: '제조원 영문' },
    body: { type: 'text', name: '내용' },
    body_en: { type: 'text', name: '내용 영문' },
    nickname: { type: 'string', name:'작성자', readOnly: true },
    photos: {
      type: 'photos',
      name: '사진',
      uploadWithPhoto: true,
      thumbs: 'photoThumbs',
      apiDelete: deleteFilterPhoto,
      apiPost: postFilterPhotos,
    },
  },
};

export default class FilterUserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: SCHEMA
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      schema: SCHEMA
    });
  }
  render() {
    return (
      <div className='notice-list-view'>
        <DataView schema={this.state.schema} {...this.props} id={this.props.match.params.id} />
      </div>
    );
  }
}