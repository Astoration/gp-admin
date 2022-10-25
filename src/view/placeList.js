import React, { Component } from 'react';

import DataView from '../container/dataView';

import Popup from 'reactjs-popup';
import { getPlace, getPlaces, patchPlace, postPlace, deletePlace,
  deletePlacePhoto, postPlacePhotos } from '../api';
import { UserContext } from './app';
import { resources } from '../value/index.xml';
const SCHEMA = {
  apiGetList: getPlaces,
  apiGetItem: getPlace,
  apiPatchItem: patchPlace,
  apiPostItem: postPlace,
  apiDeleteItem: deletePlace,
  creatable: '등록',
  listLink: '/places',
  selectable: true,
  selectActions: [{ name: '삭제', api: (ids) => Promise.all(ids.map((id) => deletePlace(id))).then((v) => v[0]) }],
  createLink: (id) => `/places/${id}`,
  mainField: 'name',
  mainFilterFields: ['name','address','call'],
  filterFields: ['area1','area2','category','parking'],
  tableFields: ['category','name','call','address', 'memo','parking','isEnabled'],
  fields: {
    pseudoId: { type: 'pseudoId', name: '번호', hidden: true, width: '5em' },
    id: { type: 'id', name: '번호', width: '5em' },
    category: { type: 'enum', name: '장소구분', values: ['카페','레스토랑','브런치','기타'], width: '5em' },
    name: { type: 'string', name: '상호명' },
    call: { type: 'phone', name: '연락처', width: '7em' },
    address: { type: 'text', name: '주소' },
    memo: { type: 'text', name: '특이사항' },
    parking: { type: 'boolean', name: '주차여부', width: '5em' },
    isEnabled: { type: 'boolean', name: '사용여부', width: '5em' },
    area1: { type: 'enum', useLabel: true, name: '시', values: ['서울','인천','경기'], hidden: true },
    area2: { type: 'enum', useLabel: true, name: '구', values: [], getValues: (filter) => ({"서울":resources.seoul, "인천":resources.incheon, "경기":resources.gyeonggi, 0: [{item:[]}]})[filter.area1 || 0][0].item, hidden: true }
  },
};

export default class PlaceList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
      return (
      <div className='place-list-view'>
        <DataView schema={SCHEMA} {...this.props} id={this.props.match.params.id} />
      </div>
    );
  }
}

PlaceList.contextType = UserContext;