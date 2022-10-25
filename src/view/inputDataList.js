import React, { Component, PropTypes } from 'react';

import DataView from '../container/dataView';
import { getInputData, getInputDatas, patchInputData, postInputData, deleteInputData,
  deleteInputDataPhoto, patchInputDataBulk, putInputDataBulk, postInputDataPhotos } from '../api';

import Dropzone from 'react-dropzone';

let TYPES1 = {
  '조종면남성인구': '조종면남성인구',
  '조종면여성인구': '조종면여성인구',
  '가평읍남성인구': '가평읍남성인구',
  '가평읍여성인구': '가평읍여성인구',
  '북면남성인구': '북면남성인구',
  '북면여성인구': '북면여성인구',
  '설악면남성인구': '설악면남성인구',
  '설악면여성인구': '설악면여성인구',
  '상면남성인구': '상면남성인구',
  '상면여성인구': '상면여성인구',
  '청평면남성인구': '청평면남성인구',
  '청평면여성인구': '청평면여성인구',
  '재정전체' : '재정전체',
  '일반회계' : '일반회계',
  '특별회계' : '특별회계',
  '재정자립도' : '재정자립도',
  '총인구' : '총인구',
  '고령화율' : '고령화율',
  '예산집행률' : '예산집행률',
  '고용률' : '고용률',
  '실업률' : '실업률',
  '상수도보급률' : '상수도보급률',
  '사건사고' : '사건사고',
  '코로나1차' : '코로나1차',
  '코로나2차' : '코로나2차',
  '코로나3차' : '코로나3차',
  '코로나확진자' : '코로나확진자',
  '코로나치료중' : '코로나치료중',
  '가평방문관광객': '가평방문관광객',
  '기업체수': '기업체수',
  '공무원수': '공무원수',
};

let TYPES2 = {
  '예산대비채무비율' : '예산대비채무비율',
  '도시가스보급률' : '도시가스보급률',
  '가평방문관광객' : '가평방문관광객',
  '전철이용객수' : '전철이용객수',
  '문화체육이용객' : '문화체육이용객',
  '상수도보급률' : '상수도보급률',
}


const TOS_SCHEMA = {
  apiDeleteItem: deleteInputData,
  apiPostItem: postInputData,
  apiGetList: getInputDatas,
  apiGetItem: getInputData,
  apiPatchItem: patchInputData,
  creatable: true,
  mainField: 'key',
  filterFields: ['category'],
  excelFilename:'통계.xlsx',
  tableFields: ['pseudoId', 'category', 'key','data', 'createdAt'],
  fields: {
    pseudoId: { type: 'pseudoId', name: '번호', hidden: true, width: '5em' },
    id: { type: 'id', name: '번호', width: '5em' },
    category: {
      type: 'enum',
      name: '카테고리',
      values: TYPES1
    },
    createdAt: { type: 'dateMeta', name: '생성일', width: '8em' },
    key: { type: 'string', name: '항목', full: true },
    data: { type: 'number', name: '값' },
  },
};
const TOS_SCHEMA2 = {
  apiDeleteItem: deleteInputData,
  apiPostItem: postInputData,
  apiGetList: getInputDatas,
  apiGetItem: getInputData,
  apiPatchItem: patchInputData,
  creatable: true,
  mainField: 'key',
  filterFields: ['category'],
  excelFilename:'통계.xlsx',
  tableFields: ['pseudoId', 'category', 'key','data', 'createdAt'],
  fields: {
    pseudoId: { type: 'pseudoId', name: '번호', hidden: true, width: '5em' },
    id: { type: 'id', name: '번호', width: '5em' },
    category: {
      type: 'enum',
      name: '카테고리',
      values: TYPES2
    },
    createdAt: { type: 'dateMeta', name: '생성일', width: '8em' },
    key: { type: 'string', name: '항목', full: true },
    data: { type: 'number', name: '값' },
  },
};


export default class InputDataList extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      schema: Object.assign({}, props.location.pathname.includes("1") ? TOS_SCHEMA : TOS_SCHEMA2 , {
        preFilter: { preset: props.location.pathname.includes("1") ? Object.keys(TYPES1).join(",") : Object.keys(TYPES2).join(",") },
        listLink: props.match.url.substring(0,props.match.url.lastIndexOf("/")),
        createLink: (id) => props.match.url+'/'+id,
      }),
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      schema: Object.assign({}, nextProps.location.pathname.includes("1") ? TOS_SCHEMA : TOS_SCHEMA2, {
        preFilter: { preset: nextProps.location.pathname.includes("1") ? Object.keys(TYPES1).join(",") : Object.keys(TYPES2).join(",") },
        listLink: nextProps.match.url.substring(0,nextProps.match.url.lastIndexOf("/")),
        createLink: (id) => nextProps.match.url+'/'+id,
      }),
    });
  }
  render() {
    return (
      <div className='InputData-list-view'>
        <Dropzone className='uploadExcel'
          onDrop={files => {
            putInputDataBulk({ xlsx: files },files)
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
            patchInputDataBulk({ xlsx: files },files)
            .then(({ status, body }) => {
              if (status === 200) alert('성공적으로 업로드 하였습니다.');
              else alert('엑셀 업로드에 실패했습니다: ' + (body.data || body));

              this.setState({ schema: Object.assign({}, SCHEMA) });
            });
          }}
        >
          엑셀 파일 업로드(추가)
        </Dropzone>
        <DataView schema={this.state.schema} id={this.props.match.params.id} />
      </div>
    );
  }
}