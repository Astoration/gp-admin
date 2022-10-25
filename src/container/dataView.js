import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router-dom';
import Paginate from 'react-paginate';
import Workbook from 'react-excel-workbook';
import moment from 'moment';
import DataViewDetail from '../component/dataViewDetail';
import DataViewList from '../component/dataViewList';
import DataViewSearch from '../component/dataViewSearch';
import './dataView.scss';
import DataViewAdd from '../component/dataViewAdd';
import Dropdown from 'react-select';
import { withRouter } from 'react-router-dom';

class DataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      excelList: [],
      list: [],
      selected: [],
      page: 0,
      pageCount: 0,
      count: 0,
      limit: this.props.schema.size || 20,
      sort: this.props.schema.sortTypes != null ? Object.keys(this.props.schema.sortTypes)[0] : null,
      filter: this.props.schema.filterPreset || {},
      detail: {},
      detailOnly: false,
    };
  }
  async fetch(updates = {}, props = this.props) {
    let newState = Object.assign({}, this.state, updates);
    const { page, limit, sort, filter } = newState;
    const { preFilter } = props.schema;
    let { status, body } = await this.props.schema.apiGetList(
      Object.assign({ page, limit, sort }, filter, preFilter || {}));
    if (status !== 200) throw body;
    let { result, count } = body;
    this.setState(Object.assign(updates, { selected:[],excelList: [], list: result, pageCount: Math.ceil(count / limit), count }));
  }
  async fetchDetail(id) {
    if (this.props.schema.apiGetItem == null) return;
    let { status, body } = await this.props.schema.apiGetItem(id);
    if (status !== 200) throw body;
    this.setState({
      detail: Object.assign({}, this.state.detail,
        { [id]: body }
      ),
    });
  }
  async patchDetail(id, data) {
    let { status, body } = await this.props.schema.apiPatchItem(id, data);
    let clear = this.props.schema.clear;
    if(clear === null) clear = true;
    if (status !== 200) throw body;
    alert('저장되었습니다.');
    this.setState({
      list: this.state.list.map(v => v.id == body.id ? body : v),
      detail: (clear) ? {} : this.state.detail,
      detailOnly: false,
    });
    this.props.history.push({
      pathname: this.props.schema.listLink,
      state: { force: true },
    });
  }
  async postDetail(data) {
    let { fields } = this.props.schema;
    let files = null;
    if (data.files) {
      files = data.files;
      delete data.files;
    }
    let { status, body } = await this.props.schema.apiPostItem(data, files && files.map(i => i.file));
    if (status !== 200){
      for(let field of Object.keys(fields)){
        body.data = body.data.replace(field,`"${fields[field].name}"`);
      }
      body.data = body.data.replace("필드가 required 형식이 아닙니다",`필드의 값을 입력해주세요`);
      alert(body.data);
      throw body;
    }
    alert('저장되었습니다.');
    this.props.history.push({
      pathname: this.props.schema.listLink,
      state: { force: true },
    });
    window.scrollTo(0, 0);
    this.setState({
      list: this.state.list.map(v => v.id == body.id ? body : v),
      detail: [],
    });
  }
  componentDidMount() {
    if(!this.props.schema.noInit){
      this.fetch();
    }
  }
  componentWillMount() {
    let id = parseInt(this.props.id);
    if (isNaN(id)) id = false;
    if (this.props.id == 'new') id = 'new';
    const { schema: { preFilter } } = this.props;
    this.setState({
      detailOnly: id,
      detail: Object.assign({}, this.state.detail, { [id]: preFilter || {} }),
    });
    if (id !== false && id !== 'new') this.fetchDetail(id);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.id == nextProps.id &&
      this.props.schema == nextProps.schema
    ) {
      if (this.state.filter !== nextProps.schema.filter) {
        this.setState({
          filter: Object.assign({}, this.state.filter, nextProps.schema.filter, this.props.preFilter),
        });
      }
      return;
    }
    if (this.props.filterFields !== nextProps.filterFields) {
      this.setState({ filter: {} });
    }
    let id = parseInt(nextProps.id);
    if (isNaN(id)) id = false;
    if (nextProps.id == 'new') id = 'new';
    // Find item from list
    const { schema: { preFilter } } = nextProps;
    let item = this.state.list.find(v => v.id == id) || preFilter || {};
    this.setState({
      filter: Object.assign({}, this.state.filter, preFilter),
      detailOnly: id,
      detail: Object.assign({}, { [id]: item }),
    });
    if (id !== false && id !== 'new') this.fetchDetail(id, nextProps);
    if (id == false) this.fetch({}, nextProps);
  }
  handleSelect(id) {
    const { selected } = this.state;
    const { selectSingle } = this.props;
    if (selectSingle == true) {
      if (selected.length !== 0 && selected.indexOf(id) !== -1) {
        this.setState({
          selected: [],
        });
      }
    }
    if (selected.indexOf(id) == -1) {
      this.setState({
        selected: selected.concat(id),
      });
    } else {
      this.setState({
        selected: selected.filter(v => v !== id),
      });
    }
  }
  handleSelectAll(toggle) {
    const { selected, list } = this.state;
    if (toggle) {
      let newSelected = selected.slice();
      list.forEach(v => {
        newSelected.indexOf(v.id) == -1 && newSelected.push(v.id);
      });
      this.setState({
        selected: newSelected,
      });
    } else {
      this.setState({
        selected: [],
      });
    }
  }
  handlePageChange(page) {
    this.fetch({ page: page.selected });
  }
  handleLimitChange(e) {
    console.log(e);
    this.fetch({ limit: parseInt(e.value) });
  }
  handleSearch(filter, sort = 'createdAt') {
    this.fetch({ filter, page: 0, sort: sort });
  }
  handlePermanentChange(id, data) {
    this.setState({
      list: this.state.list.map(v => v.id == id ? data : v),
      detail: Object.assign({}, this.state.detail, { [id]: data }),
    });
  }
  handleSubmit(id, data) {
    if (id == 'new' || this.props.schema.alwaysNew) {
      this.postDetail(data);
    } else {
      this.patchDetail(id, data);
    }
  }
  handleOpen(id, e) {
    if (this.props.schema.noOpen) return;
    e.preventDefault();
    const { schema: { preFilter, getID } } = this.props;
    if (this.state.detail[id] == null) {
      let item = this.state.list.find(v => (getID ? getID(v) : v.id) == id) || preFilter || {};
      this.fetchDetail(id);
      this.setState({
        detail: Object.assign({}, this.state.detail, { [id]: item }),
      });
    } else {
      let detailNew = Object.assign({}, this.state.detail);
      delete detailNew[id];
      this.setState({
        detail: detailNew,
      });
    }
  }
  async handleAction(action, e) {
    e.preventDefault();
    // Send API request
    if (action.api != null) {
      if (!confirm('정말 이 ' + this.state.selected.length + '개 항목에 대해 "' +
        action.name + '"을(를) 실행하시겠습니까?')) return;
      let { list, selected } = this.state;
      list = list.filter(item => selected.includes(item.id));
      let { status, body } = await action.api(selected, list);
      if (status !== 200) throw body;
      if (Array.isArray(body)) {
        let newList = this.state.list.slice();
        body.forEach(v => {
          let pos = newList.findIndex(entry => entry.id == v.id);
          if (pos !== -1) newList[pos] = v;
        });
        alert('완료되었습니다.');
        this.setState({ list: newList, selected:[] });
      } else {
        alert('완료되었습니다.');
        await this.fetch();
      }
    }
  }
  async handleDelete(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
      let { status, body } = await this.props.schema.apiDeleteItem(id);
      if (status !== 200) throw body;
      const { detailOnly } = this.state;
      browserHistory.push({
        pathname: this.props.schema.listLink,
        state: { force: true },
      });
      this.setState({
        list: this.state.list.filter(v => v.id !== id),
        detail: Object.assign({}, this.state.detail, { [id]: undefined }),
        detailOnly: id == detailOnly ? false : detailOnly,
      });
    }
  }
  async handleSearchReset() {
    if (this.props.onSearchReset != null) {
      await this.props.onSearchReset();
    }
    this.setState({
      filter: this.props.schema.filterPreset || {},
    });
  }
  async handleDeleteList(e) {
    e.preventDefault();
    if (confirm('정말로 리스트 전체를 삭제하시겠습니까?')) {
      let { status, body } = await this.props.schema.apiDeleteList();
      if (status !== 200) throw body;
      this.setState({
        list: [],
        detail: {},
        detailOnly: false,
      });
    }
  }

  async handleBuildExcel() {
    let excelList = [];
    let page = 0;
    const { schema: { noPaging, preFilter, noExcelFetch, mainFilterFields, tableFields, fields, searchFields, fullExcel, excelFilename } } = this.props;
    const { sort, filter, list } = this.state;
    let isSearch = mainFilterFields != null && mainFilterFields.some(field => Object.keys(filter).includes(field)) && searchFields != null;
    let fieldNames = Object.keys(fields).filter(item => !fields[item].hidden).filter(item => fields[item].excelInclude !== false);
    let virtualFields = ['guild', 'user'];
    let attributes = fieldNames.filter(v => !virtualFields.includes(fields[v].type) && fields[v].getter == null).join(',');
    let count = 0;
    do {
      if(noExcelFetch === true){
        excelList = list;
        continue;
      }
      let { status, body } = await this.props.schema.apiGetList(
        Object.assign({ page, limit: 100, sort, attributes }, filter, preFilter || {}));
      if (status !== 200) throw body;
      let { result } = body;
      count = result.length;
      excelList = excelList.concat(result);
      page += 1;
    } while (!noPaging && count !== 0 && noExcelFetch !== true);
    excelList = excelList.map((item, i, list) => {
      let result = {};
      for (let fieldName of fieldNames) {
        let field = fields[fieldName];
        let value = field.getter ? field.getter(item, item[fieldName], list, i) : item[fieldName];
        result[fieldName] = (field.type == 'enum') ? (
          Array.isArray(field.values) ? (field.values[value] != null ? (field.values[value - (field.offset || 0)]) : value)
            : (field.values[value] != null ? field.values[value] : value)
        ) : (field.type == 'boolean' ? value : (String(value != null ? value : '')));
        if (field.type == 'user') result[fieldName] = (value && value.nickname) || '';
        else if ((field.type == 'number' || field.type == 'integer') && (result[fieldName] == null || result[fieldName] == 0)) { result[fieldName] = '0'; } else if (field.type == 'guild') result[fieldName] = result[fieldName].name;
        else if (field.type == 'date' || field.type == 'dateMeta') result[fieldName] = (result[fieldName] != null && result[fieldName] != '') ? moment(result[fieldName]).format('YYYY-MM-DD HH:mm') : '없음';
        else if (typeof (result[fieldName]) === 'object') result[fieldName] = result[fieldName] != null ? JSON.stringify(result[fieldName]) : '';
        else if (typeof (result[fieldName]) === 'boolean') result[fieldName] = result[fieldName] ? '네' : '아니요';
        if (field.type == 'integer' && result[fieldName]) { result[fieldName] = result[fieldName].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
      }
      return result;
    });
    let excel = new Workbook({
      children: (<Workbook.Sheet name={excelFilename.replace('.xlsx', '') || 'result'} data={excelList}>
        {
          (fullExcel ? fieldNames : (isSearch ? searchFields : tableFields)).filter(v => !fields[v].hidden).filter(v => fields[v].type != 'button').map(tableField => (<Workbook.Column label={fields[tableField].name} value={tableField} />))
        }
      </Workbook.Sheet>),
      filename: excelFilename || 'result.xlsx',
    });
    excel.download();
    this.setState({ excelList });
  }

  handleChange(i, key, data) {
    this.setState(state => {
      const list = state.list.map((item, j) => {
        if (j === i) {
          return Object.assign({}, item, { [`${key}`]: data });
        } else {
          return item;
        }
      });

      return { list };
    });
  }

  renderDetail(id) {
    const { detail, detailOnly, filter } = this.state;
    const {
      schema: {
        simple,
        createForms, fields, listLink, apiDeleteItem, apiDeleteLounge, footer,
        alwaysNew, header, saveLabel, noOpen, openNewTab, noDiff, openSchema, detailRender,
        editPermission
      }, user,
    } = this.props;
    return (
      <div>
        {
          (detailRender && (editPermission && !editPermission(detail[id])))
            ? detailRender(detail[id])
            : (openSchema == null
              ? (<DataViewDetail user={user} fields={createForms != null ? createForms : fields} item={detail[id]}
                listLink={detailOnly !== false ? listLink : null}
                new={alwaysNew || id == 'new'}
                item={detail[id]}
                onSubmit={this.handleSubmit.bind(this, id)}
                onChangePermanent={this.handlePermanentChange.bind(this, id)}
                deletable={id !== 'new' && apiDeleteItem != null}
                deletableLounge={apiDeleteLounge != null}
                onDelete={this.handleDelete.bind(this, id)}
                footer={footer} header={header}
                id={id} saveLabel={saveLabel} noOpen={noOpen}
                noDiff={noDiff}
              />)
              : (<DataView schema={Object.assign({}, openSchema, {
                apiGetList: openSchema.apiGetList.bind(null, id),
                preFilter: Object.assign({}, openSchema.preFilter, filter),
              })} />))
        }
      </div>);
  }
  render() {
    const { list, excelList, selected, pageCount, page, limit, sort, filter, count, detail,
      detailOnly } = this.state;
    const { schema: { simple, tableFields, filterFields, addFields, fields, mainField, sortTypes, selectable,
      selectActions, creatable, createLink, openNewTab, listLink, size, listHeader, getID, searchFields,
      apiDeleteList, mainFilterFields, scrollable, fullExcel, noPaging, excelFilename, tableSubHeader, addButton, filterName,
    }, user } = this.props;
    let isSearch = mainFilterFields != null && mainFilterFields.some(field => Object.keys(filter).includes(field)) && searchFields != null;
    let limitOptions= [
      { value: 10, label: '10개' },
      { value: 20, label: '20개' },
      { value: 30, label: '30개' },
      { value: 50, label: '50개' },
    ];
    if (detailOnly !== false) {
      return this.renderDetail(detailOnly);
    }
    return (
      <div className='data-view-container' style={scrollable && { overflowX: 'scroll' }}>
        {filterFields && (
          <DataViewSearch user={user} filterFields={filterFields} fields={fields} detail={detail}
            filterName={filterName}
            mainFilterFields={mainFilterFields} sortTypes={sortTypes} fetch={this.fetch.bind(this)}
            filter={filter} sort={sort} onReset={this.handleSearchReset.bind(this)} onSearch={this.handleSearch.bind(this)} />
        )}
        {
          excelFilename && (excelList.length == 0 ? (<div>
            <button className='button' onClick={this.handleBuildExcel.bind(this)}>엑셀 파일 생성</button>
          </div>) : (
              <Workbook filename={excelFilename || 'result.xlsx'} element={(<button>엑셀 다운로드</button>)}>
                <Workbook.Sheet name={excelFilename.replace('.xlsx', '') || 'result'} data={excelList}>
                  {
                    (fullExcel ? Object.keys(fields) : tableFields).filter(v => !fields[v].hidden).filter(v => fields[v].type !== 'button').map(tableField => (<Workbook.Column label={fields[tableField].name} value={tableField} />))
                  }
                </Workbook.Sheet>
              </Workbook>
            ))
        }
        <div>{listHeader && listHeader(list, filter)}</div>
        {!simple && (<div className="listHeader" style={{ textAlign: 'right' }}>
        <span className="searchCount">총 {count} 건의 검색 결과</span>
        <div className='limit'>
            <form>
              <span>표시 개수 </span>
              <Dropdown placeholder={'선택...'} clearable={false}
                name="limit"
                value={limitOptions.find(i => i.value == limit)}
                onChange={this.handleLimitChange.bind(this)}
                options={
                  limitOptions
                }
              />
            </form>
          </div>
          {selectActions != null && selectActions.map((action, key) =>
                typeof action !== 'function' ? (
                  <button className='button' key={key}
                    onClick={this.handleAction.bind(this, action)}
                  >
                    {action.name}
                  </button>
                ) : (
                    action(selected, key)
                  )
              )}
          {creatable && (
            <Link to={createLink('new')} className='create'>
              {typeof creatable === 'string' ? creatable : '생성'}
            </Link>
          )}
          </div>)}
        <div style={scrollable && { width: (tableFields.length * 8) + 'em' }}>
          <DataViewList user={user} tableFields={isSearch ? searchFields : tableFields} fields={fields}
            list={list} selectable={selectable} selected={selected}
            onSelect={this.handleSelect.bind(this)}
            getID={getID}
            openNewTab={openNewTab}
            tableSubHeader={tableSubHeader}
            onSelectAll={this.handleSelectAll.bind(this)}
            detailStyle={this.detailStyle}
            onOpen={this.handleOpen.bind(this)}
            detail={detail} renderDetail={this.renderDetail.bind(this)}
            createLink={createLink} listLink={listLink} mainField={mainField}
            additionalState={{ page, limit, count, handleChange: (index, key, data) => this.handleChange(index, key, data) }}

          />
        </div>
        {selectActions!=null && selectActions.length > 0 && (
          <div className='selected'>
            <div className='content'>
              
            </div>
          </div>
        )}
        {
          addFields && (
            <DataViewAdd tableFields={addFields} fields={fields} mainField={mainField} addButton={addButton} />
          )
        }
        {size == null && !noPaging && (<div className='footer'>
          <Paginate previousLabel='&laquo;' nextLabel='&raquo;'
            containerClassName='pagination'
            pageCount={pageCount} forcePage={page}
            pageRangeDisplayed={5} marginPagesDisplayed={2}
            onPageChange={this.handlePageChange.bind(this)}
          />
          {apiDeleteList && (
            <button onClick={this.handleDeleteList.bind(this)}
              className='deleteList'
            >모두 삭제</button>
          )}
        </div>)}
      </div>
    );
  }
}

export default withRouter(DataView);