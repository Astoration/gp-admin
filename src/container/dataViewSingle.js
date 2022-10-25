import React, { Component } from 'react';

import DataViewDetail from '../component/dataViewDetail';
import DataViewSearch from '../component/dataViewSearch';

export default class DataViewSingle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailItem: {},
      filter: this.props.schema.filterPreset || {},
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.id === nextProps.id && this.props.schema === nextProps.schema) {
      return;
    }
    const {
      schema: { filterPreset, preFilter },
    } = nextProps;
    const nextFilter = Object.assign({}, this.state.filter, preFilter, filterPreset);
    this.setState({
      filter: nextFilter,
    });
    this.fetchDetail(nextFilter);
  }
  async fetchDetail(query) {
    if(this.props.schema.apiGetItem == null) return;
    let { status, body } = await this.props.schema.apiGetItem(Object.assign({}, query, this.props.schema.preFilter));
    if (status !== 200) throw body;
    this.setState({ detailItem: body, filter: query });
  }
  async patchDetail(data) {
    let files = null;
    if (data.files) {
      files = data.files;
      delete data.files;
    }
    let { status, body } = await this.props.schema.apiPatchItem(data, files && files.map((i) => i.file));
    if (status !== 200) throw body;
    alert('저장되었습니다.');
    if(this.props.parentDataView != null) this.props.parentDataView();
    this.setState({
      detailItem: body,
    });
  }
  componentDidMount() {
    this.fetchDetail(this.state.filter);
  }
  handlePermanentChange(data) {
    this.setState({
      detailItem: data,
    });
  }
  handleSubmit(data) {
    this.patchDetail(data);
  }
  handleSearch(filter) {
    this.fetchDetail(filter);
  }
  render() {
    const { detailItem, filter } = this.state;
    const { schema, user } = this.props;
    console.log(detailItem);
    return (
      <div>
        {schema.filterFields && (
          <DataViewSearch
            user={user}
            filterFields={schema.filterFields}
            fields={schema.fields}
            mainFilterFields={schema.mainFilterFields}
            fetch={this.fetchDetail.bind(this)}
            filter={filter}
            onSearch={this.handleSearch.bind(this)}
          />
        )}
        <DataViewDetail
          fields={schema.fields}
          item={detailItem}
          onSubmit={this.handleSubmit.bind(this)}
          onChangePermanent={this.handlePermanentChange.bind(this)}
          new={schema.alwaysNew}
          {...schema}
        />
      </div>
    );
  }
}
