import React, { Component } from 'react';

import DataView from '../container/dataView';
import { getOrders, getPayment, putPayment, getConfig, postConfig, putPDFFile  } from '../api';
import TabList, { TabEntry } from '../component/tabList';
import './tableList.scss';
import DataViewSingle from '../container/dataViewSingle';
import Dropzone from 'react-dropzone';

const SCHEMA = {
  apiGetItem: getConfig,
  apiPatchItem: postConfig,
  scrollable: true,
  fields: {
    updateRate: {
      type: 'integer',
      name: '갱신 주기(시간)',
      width: '8em',
      min: 0,
    },
    updateRateMinute: {
      type: 'integer',
      name: '갱신 주기(분)',
      width: '8em',
      min: 0,
      max: 60,
    },
  },
};

export default class ConfigPage extends Component {
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
      <div className='order-list-view'>
        <Dropzone className='uploadExcel'
          onDrop={files => {
            putPDFFile({ pdf: files },files)
            .then(({ status, body }) => {
              if (status === 200) alert('성공적으로 업로드 하였습니다.');
              else alert('업로드에 실패했습니다: ' + (body.data || body));
            });
          }}
        >
          공약사업 PDF 업로드
        </Dropzone>
        <DataViewSingle user={this.context.user} schema={this.state.schema} id={match.params.id} />
      </div>
    );
  }
}