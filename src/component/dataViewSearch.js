import React, { Component } from 'react';
import Dropdown from 'react-select';
import Datetime, { ViewMode } from 'react-datetime';
import classNames from 'classnames';
import 'react-select/dist/react-select.css';
import './dataViewSearch.scss';

// Needed because of react-dropdown bug
const NULL_OP = '__null__';

export const ITEM_SEARCH = {
  text: (field, value, onChange) => (
    <input type='text' value={value} placeholder={field.name}
      onChange={onChange} />
  ),
  phone: (field, value, onChange) => (
    <input type='text' id='phone-filter' value={value == null ? '' : value} name={name}
      placeholder={field.name}
      readOnly={field.readOnly} onChange={(e) => {
        var start = e.target.selectionStart;
        var end = e.target.selectionEnd;
        var flag = e.target.value.length == start && start == end;
        let value = e.target.value;
        // Convert the number to include hypens...
        value = value.replace(/-/g, '');
        // Region number...
        value = value.replace(/^(02|0\d{2})(\d)/, '$1-$2');
        // Host number...
        value = value.replace(/-(\d{3,4})(\d{4,})$/, '-$1-$2');
        onChange({ target: { value } });
        if (!flag) {
          setTimeout(() => {
            var input = document.getElementById('phone-filter');
            input.selectionStart = start;
            input.selectionEnd = end;
          }, 10);
        }
      }} />
  ),
  boolean: (field, value, onChange, key) => {
    let options = [
      { value: 0, label: `${field.name}: 아니요` },
      { value: 1, label: `${field.name}: 네` },
    ];
    return (
      <Dropdown placeholder={field.name}
        options={options}
        value={options[value]}
        onChange={value => {
          onChange({ target: { value:
            value && value.value,
          } });
        }} />
    );
  },
  date: (field, value, onChange) => (
    <Datetime onChange={(e) => {
      let value = e;
      if (typeof e !== 'string') value = e.toDate();
      onChange({ target: { value } });
    }} inputProps={{ placeholder: field.name }}
      value={isNaN(new Date(value).getTime()) ? value : new Date(value)}
    />
  ),
  year: (field, value, onChange) => (
    <Datetime onChange={(e) => {
      let value = e;
      if (typeof e !== 'string') value = e.toDate();
      onChange({ target: { value } });
    }}
     viewMode={'years'}
     initialViewMode={'years'}
     inputProps={{ placeholder: field.name }}
      value={isNaN(new Date(value).getTime()) ? value : new Date(value)}
    />
  ),
  month: (field, value, onChange) => (
    <Datetime onChange={(e) => {
      let value = e;
      if (typeof e !== 'string') value = e.toDate();
      onChange({ target: { value:new Date(new Date(value).setDate(1)) } });
    }}
     viewMode={'months'}
     initialViewMode='months'
     updateOnView='months'
     onBeforeNavigate={((nextView, currentView, viewDate)=>{
       return 'months';
     })}
     inputProps={{ placeholder: field.name }}
      value={isNaN(new Date(value).getTime()) ? value : new Date(value)}
    />
  ),
  enum: (field, value, onChange, name, filter) => {
    let values = field.searchValues || field.values;
    if(field.getValues != null){
      values = field.getValues(filter);
    }
    // Why
    if (values.$$$entries) {
      values = values.$$$entries;
      return (
        // We do addition / subtraction to workaround weird error
        <Dropdown placeholder={field.name}
          options={values.map(({ label, value }) => ({
            label, value: field.useLabel ? label : value,
          }))}
          multi={field.multiple}
          /* eslint-disable eqeqeq */
          value={field.multiple ? (
            (value || '').split(',').filter(v => v !== '')
            .map(v => {
              let entry = values.find(({ value }) => value == v);
              if (entry != null) return entry;
              return v == null ? undefined : { value: v, label: v };
            })
          ) : ((() => {
            let entry = values.find(entry => entry.value == value);
            if (entry != null) return entry;
            return value == null ? undefined : { value, label: value };
          })()
          )}
          onChange={value => {
            onChange({ target: { value:
              value && Array.isArray(value)
                // What the heck is this
                ? value.map(v => v.value).join(',').split(',')
                  .filter(v => v !== '')
                  .filter((item, pos, self) => self.indexOf(item) == pos)
                  .join(',')
                : (value && value.value),
            } });
          }} />
          /* eslint-enable eqeqeq */
      );
    }
    return Array.isArray(values) ? (
      // We do addition / subtraction to workaround weird error
      <Dropdown placeholder={field.name}
        options={values.map((label, value) => ({
          label, value: field.useLabel ? label: (value + (field.offset || 0)),
        }))}
        multi={field.multiple}
        value={field.multiple ? (
          (value || '').split(',').map(v => parseInt(v)).filter(v => !isNaN(v))
          .map(v => values[v - (field.offset || 0)] != null ? (
            { value: v, label: values[v - (field.offset || 0)] }
          ) : (v == null ? undefined : { value: v, label: v }))
        ) : (
          values[value - (field.offset || 0)] != null ? (
            { value: value, label: values[value - (field.offset || 0)] }
          ) : (value == null ? undefined : { value: value + (field.offset || 0), label: value })
        )}
        onChange={value => {
          onChange({ target: { value:
            value && Array.isArray(value)
              ? value.map(v => v.value).join(',')
              : (value && value.value),
          } });
        }} />
    ) : (
      <Dropdown placeholder={field.name}
        options={Object.keys(values).map((value) => ({
          label: values[value], value: value,
        }))}
        multi={field.multiple}
        value={field.multiple ? (
          (value || '').split(',').filter(v => v !== '')
          .map(v => values[v] != null ? (
            { value: v, label: values[v] }
          ) : (v == null ? undefined : { v, label: v }))
        ) : (
          values[value] != null ? (
            { value: value, label: values[value] }
          ) : (value == null ? undefined : { value, label: value })
        )}
        onChange={value => {
          onChange({ target: { value:
            value && Array.isArray(value)
              ? value.map(v => v.value).join(',')
              : (value && value.value),
          } });
        }} />
    );
  },
  readonly: (field, _, onChange) => (
    <input type='text' value='' readOnly onChange={onChange} />
  ),
};

class SearchFilter extends Component {
  handleValueChange(e) {
    this.props.onChange(e.target.type === 'checkbox' ? (
        e.target.checked ? 1 : 0
      ) : e.target.value);
  }
  render() {
    const { fields, name, value, filter } = this.props;
    let fieldType = ITEM_SEARCH[(fields[name] || {}).type] ||
      ITEM_SEARCH['text'];
    if (name == null) fieldType = ITEM_SEARCH['readonly'];
    const fieldValue = fieldType(fields[name], value,
      this.handleValueChange.bind(this), name, filter);
    return (
      <li className={classNames('filter',{
        half: fields[name].half,
      })}>
        <div class="searchLabel">{ fields[name].name }</div>
        { fieldValue }
      </li>
    );
  }
}

export default class DataViewSearch extends Component {
  componentWillMount() {
    const { filter, sort } = this.props;
    this.setState({
      filter,
      sort,
      mainKey: this.props.mainFilterFields != null ? this.props.mainFilterFields[0] : null,
      mainValue: null,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      filter: nextProps.filter,
    });
  }
  handleChange(key, value) {
    this.setState({
      filter: Object.assign({}, this.state.filter, {
        [key]: value,
      }),
    });
  }
  handleSortChange(sortType) {
	  this.setState({ sort: sortType.value });
  }
  handleMainKey(mainKey) {
    this.setState({ mainKey });
  }
  handleMainValue(mainValue) {
    this.setState({ mainValue });
  }
  handleSearch(e) {
    e.preventDefault();
    // Change filters to object
    let output = {};
    const { filter, sort, mainKey, mainValue } = this.state;
    for (let key in filter) {
      let value = filter[key];
      if (value != null && value !== '') {
        if (value instanceof Date) {
          output[key] = value.toISOString();
        } else {
          output[key] = value.toString();
        }
      }
    }
    if (mainKey != null && mainValue != null && mainValue !== '') {
      output[mainKey] = mainValue;
    }
    //this.props.fetch({detail: {} });
    this.props.onSearch(output, sort);
  }
  render() {
    const { filterFields, sortTypes, mainFilterFields, fields, user, onReset, filterName, header } = this.props;
    const { filter, sort, mainKey, mainValue } = this.state;
    return (
      <div className='data-view-search'>
        <form onSubmit={this.handleSearch.bind(this)}>
          <div className='searchbox'>
            
            <ul className='filters' key='filters' >
              <div  className="searchLabel">{filterName || '필터'}</div>
              { header && header }
              { mainFilterFields && (
              <div className='filter mainField'>
                <div className="searchLabel">검색</div>
                <div className='key'>
                  <Dropdown placeholder={'선택...'} clearable={false}
                    options={[{ value: NULL_OP, label: '선택...' }].concat(
                      mainFilterFields.map((value) => ({
                        label: fields[value].name, value,
                      }))
                    )}
                    value={fields[mainKey] != null ? (
                      { value: mainKey, label: fields[mainKey].name }
                    ) : { value: mainKey, label: '선택...' }}
                    onChange={value => this.handleMainKey(
                      value.value === NULL_OP ? null : value.value,
                    )} />
                </div>
                <div className='value'>
                  { mainKey == null ? (
                    <input className='value' readOnly={mainKey == null}
                      value={mainValue || ''} type='text'
                      onChange={e => this.handleMainValue(e.target.value)} />
                  ) : (
                    (ITEM_SEARCH[(fields[mainKey] || {}).type] ||
                    ITEM_SEARCH.text)(
                      fields[mainKey], mainValue || '',
                      e => this.handleMainValue(e.target.value), mainKey,
                    )
                  ) }
                </div>
              </div>
            )}
              { filterFields.map((name) => {
                if (name.displayPermissionRequired != null && !user[name.displayPermissionRequired]) {
                  return false;
                } else if (name.field != null) {
                  name = name.field;
                }
                return (
                  <SearchFilter key={name} name={name} filter={filter} value={filter[name]}
                    filterFields={filterFields} fields={fields}
                    onChange={this.handleChange.bind(this, name)}
                />
                );
              })}
              { sortTypes == null ? (null) : (<li key='filter' className='filter'>
                <Dropdown placeholder='정렬 순서' options={Object.keys(sortTypes).map((value) => ({label: sortTypes[value], value: value}))} value={{label: sortTypes[sort], value: sort}} onChange={this.handleSortChange.bind(this)} />
              </li>) }
              <div>
                <li className="filterButton">
                  <button className='search'>
                    검색
                  </button>
                </li>
                <li className="filterButton">
                  <button onClick={()=>onReset()}>
                    초기화
                  </button>
                </li>
              </div>
            </ul>

          </div>
          {/* <span className='footer'>
          </span> */}
        </form>
      </div>
    );
  }
}
