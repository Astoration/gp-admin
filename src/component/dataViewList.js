import React, { Component, Children } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getUser } from '../api';
import 'moment/locale/ko';
import Dropdown from 'react-select';

import './dataViewList.scss';

const NULL_OP = '__null__';

const ITEM_STRINGIFIER = {
  dateOnly: value => new Date(value).toLocaleDateString(),
  date: value => (
    <span className='date' title={moment(new Date(value)).format('lll')}>
      {value == null ? '없음' : moment(new Date(value)).format('L')} 
    </span>
  ),
  age: value => (
    <span className='date' title={moment(new Date(value)).format('lll')}>
      {value == null ? '없음' : new Date(value).getFullYear()} 
      &nbsp;({new Date().getFullYear()-new Date(value).getFullYear()+1})
    </span>
  ),
  datetime: value => (
    <span className='date' title={moment(new Date(value)).format('YYYY/MM/DD hh:mm')}>
      {value == null ? '없음' : moment(new Date(value)).format('YYYY/MM/DD hh:mm')}
    </span>
  ),
  dateMeta: value => (
    <span className='date' title={moment(new Date(value)).format('lll')}>
      {value == null ? '없음' : moment(new Date(value)).format('L')}
    </span>
  ),
  string: (value, field, item, i, { handleChange, handleClick }, list, key) => {
    return field.editable
      ? <input style={{ width: '100%' }} type='text' value={value || ''} onChange={(e) => handleChange(i, key, e.target.value)} />
      : (field.handleClick != null ? <a style={{ cursor: 'pointer' }} onClick={() => field.handleClick(i, key, value)}>{value}</a> : value);
  },
  name: (value, field, item, i, { handleChange, handleClick }, list, key) => {
    return (<span className={item.gender != null ? (item.gender ? 'woman' : 'man') : null}>{value}</span>);
  },
  text: (value, field, item, i, { handleChange, handleClick }, list, key) => {
    return field.editable
      ? <input style={{ width: '100%' }} type='text' value={value ? value.substring(0,15) : ''} onChange={(e) => handleChange(i, key, e.target.value)} />
      : (field.handleClick != null ? <a style={{ cursor: 'pointer' }} onClick={() => field.handleClick(i, key, value)}>{value}</a> : <pre style={{textAlign:'left', margin: '7px 0', wordBreak: 'break-all',whiteSpace: 'pre-wrap'}}>{value}</pre>);
  },
  email: value => value,
  indexId: (_, _2, item, index, { count, page, limit }) => {
    return 1 + (page * limit + index);
  },
  pseudoId: (_, _2, item, index, { count, page, limit }) => {
    return count - (page * limit + index);
  },
  id: value => value,
  integer: value => value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  number: (value, field, item, i, { handleChange, handleClick }, list, key) => {
    return field.editable
      ? <input style={{ width: '100%' }} type='number' value={value || ''} onChange={(e) => handleChange(i, key, e.target.value)} />
      : (value + (field.postFix || ''));
  },
  benefit: value => (<span className={Number(value && value.toString().replace(/([^0-9.\-])/g, '')) > 0 ? 'plus' : 'minus'}>{value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>),
  phone: value => value,
  photo: (value, field, item) => {
    return (
      <div className='list-thumb' style={{
        width: field.width,
        height: field.width,
      }}>
        <img style={{maxHeight: 150}} src={value} />
      </div>
    );
  },
  photos: (value, field, item) => {
    return (
      <div className='list-thumb' style={{
        width: field.width,
        height: field.width,
      }}>
        <img style={{maxHeight: 150}} src={value[0]} />
      </div>
    );
  },
  boolean: (value, field) => (
    <span className={field.getClasses ? field.getClasses(value) : null}>{field.values == null ? (value ? '예' : '아니요') : field.values[Number(value)]}</span>
  ),
  user: (value, field) => value && (
    (
      field.newTab ? 
      <Link to={`/users/${value.id}`} target="_blank" rel="noopener noreferrer">{value.name}</Link>
      :
      <Link to={`/users/${value.id}`}>{value.name}</Link>
    )
  ),
  manager: (value, field) => value && (
    (
      field.newTab ? 
      <Link to={`/accounts/${value.id}`} target="_blank" rel="noopener noreferrer">{value.name}</Link>
      :
      <Link to={`/accounts/${value.id}`}>{value.name}</Link>
    )
  ),
  dynamic: (value, field, item) => {
    if (item["type"].indexOf("profile") != -1) {
      return (<Link to={`/users/${value}`}>{value}</Link>);
    } else {
      return value;
    }
  },
  button: (value, field, item) => {
    return (<div>{
      (field.visible == null ? true : (field.visible && (typeof field.visible === 'function' ? field.visible(item) : field.visible)))
      && (field.link ? (
        <Link to={`${field.link}/${item.id}`}>
          <button
            onClick={() => {
              if (field.onClick != null) field.onClick(item);
            }
            }>{field.label}
          </button>
        </Link>) :
        (<button
          onClick={() => {
            if (field.onClick != null) field.onClick(item);
          }
          }>{field.label}
        </button>))
    }
    </div>);
  },
  popup: (value, field, item) => {
    return (field.popup(item));
  },
  enum: (value, field, item, i, { handleChange }, list, key, user) => {
    console.log(user);
    return (field.editable && ((typeof field.editable === 'function') ? field.editable(user) : field.editable)) ? (
      <Dropdown placeholder={'선택...'} clearable={false}
        options={
          [{ value: NULL_OP, label: '선택...' }].concat(Object.keys(field.values).map(key => ({ value: key, label: field.values[key] })))
        }
        value={{ value: value, label: field.values[value] }}
        onChange={target => { handleChange(i, key, target.value); }}
      />)
      : Array.isArray(field.values) ? (<span className={field.getClasses ? field.getClasses(value) : null}>{value == null ? '미입력' : (field.values[value - (field.offset || 0)] || value)}</span>) : (<span className={field.getClasses ? field.getClasses(value) : null}>{value == null ? '미입력' : (field.values[value] || value)}</span>);
  },
};

export const stringify = (field, value, item, i, additionalState, list, key, user) =>
  ITEM_STRINGIFIER[field.type](
    field.getter ? field.getter(item, value, list, i) : value, field, item, i, additionalState, list, key, user);


export default class DataViewList extends Component {
  render() {
    const { tableFields, fields, list, selectable, selected, onSelect, tableSubHeader,
      onSelectAll, createLink, mainField, onOpen, renderDetail, detailStyle, getID,
      detail, additionalState, selectSingle, openNewTab, user } = this.props;
    let allSelected = list.every(v => selected.indexOf(v.id) !== -1);
    let cols = tableFields.length + (selectable ? 1 : 0);
    let renderedList = [];
    for (let i = 0; i < list.length; ++i) {
      let data = list[i];
      renderedList.push(
        <tr key={i} className={detail[getID ? getID(data) : data.id] != null ? 'detail' : ''}>
          {selectable && (
            <td className='select'>
              <input type='checkbox'
                checked={selected.indexOf(getID ? getID(data) : data.id) !== -1}
                onChange={onSelect.bind(null, getID ? getID(data) : data.id)}
              />
            </td>
          )}
          {tableFields.map(field => (
            <td className='item' key={field} style={{
              width: fields[field].width,
              textAlign: fields[field].align,
            }}>
              {field === mainField ? (
                (openNewTab ?
                (<Link className="mainField" to={createLink(getID ? getID(data) : data.id, data)} key={field}
                onClick={onOpen.bind(null, getID ? getID(data) : data.id)}
                target="_blank" rel="noopener noreferrer"
             >
               {stringify(fields[field], data[field], data, i, additionalState, list, field, user)}
             </Link>)
                :
                (<Link className="mainField" to={createLink(getID ? getID(data) : data.id, data)} key={field}
                   onClick={onOpen.bind(null, getID ? getID(data) : data.id)}
                >
                  {stringify(fields[field], data[field], data, i, additionalState, list, field, user)}
                </Link>))
              ) : (
                  stringify(fields[field], data[field], data, i, additionalState, list, field, user)
                )}
            </td>
          ))}
        </tr>
      );
      if (detail[getID ? getID(data) : data.id] != null) {
        renderedList.push(
          <tr className='detail-view' style={detailStyle} key={'detail-view-' + (getID ? getID(data) : data.id)}>
            <td colSpan={cols}>
              {renderDetail(getID ? getID(data) : data.id)}
            </td>
          </tr>
        );
      }
    }
    return (
      <table className='data-view-list'>
        <thead>
          {tableSubHeader}
          <tr className="tableHeader">
            {selectable && (
              <td className='select'>
                {!selectSingle && (<input type='checkbox'
                  checked={allSelected}
                  onChange={onSelectAll.bind(null, !allSelected)} />)}
              </td>
            )}
            {tableFields.map(v => (
              <td key={v} className={mainField === v ? 'main' : ''} style={{
                width: fields[v].width,
              }}>
                {fields[v].name}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderedList}
        </tbody>
      </table>
    );
  }
}