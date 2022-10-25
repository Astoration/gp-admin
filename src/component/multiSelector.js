import React, { Component } from 'react';
import classNames from 'classnames';
import MultiSelect from "@kenshooui/react-multi-select";

import 'react-select/dist/react-select.css';
import './multiSelector.scss';

export default class MultiSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainKey: this.props.mainKey,
      mainValue: null,
      list: [
      ],
      selectedItems: [],
    };
  }
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
    this.refs.cover.removeEventListener('click', this.handleClickEvent);
  }
  handleMainValue(mainValue) {
    this.setState({ filter: { nickname: mainValue } });
  }
  handleSearch(e) {
    e.preventDefault();
    // Change filters to object
    let output = {};
    const { filter, sort, mainKey, mainValue } = this.state;
    for (let key in filter) {
      let value = filter[key];
      if (value != null && value !== '') {
        if(value instanceof Date){
          output[key] = value.toISOString();
        }else{
          output[key] = value.toString();
        }
      }
    }
    if (mainKey != null && mainValue != null && mainValue !== '') {
      output[mainKey] = mainValue;
    }
    this.fetch({detail:{},})
  }

  async fetch(updates = {}, props = this.props) {
    let newState = Object.assign({}, this.state, updates);
    const { page, limit, sort, filter } = newState;
    let { status, body } = await this.props.apiSearch(
      Object.assign({ page, limit, sort }, filter || {}));
    this.setState(updates);
    if (status !== 200) throw body;
    let { result, count } = body;
    this.setState({ list: result, pageCount: Math.ceil(count / limit), count });
  }

  handleChange(selectedItems) {
    this.props.onChange(selectedItems);
  }
  
  render() {
    const { items, selectedItems } = this.state;
    const { hidden } = this.state;
    const { className, apiSearch } = this.props;
    const buttonContent = (
      <a href={this.props.href || '#'} tabIndex={-1}>
        <span className='title'>{this.props.title}</span>
      </a>
    );
    return (
      <div>
        <form onSubmit={this.handleSearch.bind(this)}>
        { apiSearch && (<div className='multi-select-search'>
          <input className='value' onChange={e => this.handleMainValue(e.target.value)}/>
          <button className='search' />
        </div>) }
        </form>
        <div className='multi-selector'>
          <MultiSelect
            items={this.state.list}
            onChange={this.handleChange.bind(this)}
            showSearch={false}
          />
        </div>
      </div>
    );
  }
}