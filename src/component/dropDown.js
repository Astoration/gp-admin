import React, { Component } from 'react';
import classNames from 'classnames';

import './dropDown.scss';

export default class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
    };
    this.handleClickEvent = this.handleClick.bind(this);
    this.handleGlobalKeyEvent = this.handleGlobalKey.bind(this);
  }
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
    this.refs.cover.removeEventListener('click', this.handleClickEvent);
  }
  handleKeyDown(e) {
    switch (e.keyCode) {
      case 13:
      case 32:
        this.handleClick(e);
        break;
      case 38: // up
        if (!this.state.hidden) this.handleClick(e);
        break;
      case 40: // down
        if (this.state.hidden) this.handleClick(e);
        break;
    }
  }
  handleGlobalKey(e) {
    switch (e.keyCode) {
      case 8:
      case 27:
        if (!this.state.hidden) this.handleClick(e);
        break;
    }
  }
  handleClick(e) {
    const { hidden } = this.state;
    const { noKey } = this.props;
    if (hidden) {
      this.refs.cover.addEventListener('click', this.handleClickEvent);
      if (!noKey) {
        document.addEventListener('keydown', this.handleGlobalKeyEvent);
      }
    } else {
      this.refs.cover.removeEventListener('click', this.handleClickEvent);
      if (!noKey) {
        document.removeEventListener('keydown', this.handleGlobalKeyEvent);
      }
    }
    if (this.mounted) {
      this.setState({
        hidden: !hidden,
      });
    }
    e.preventDefault();
  }
  render() {
    const { hidden } = this.state;
    const { className } = this.props;
    const buttonContent = (
      <a href={this.props.href || '#'} tabIndex={-1}>
        <span className='title'>{this.props.title}</span>
      </a>
    );
    return (
      <div className={classNames('drop-down-component', { hidden }, className)}>
        <div className='cover' ref='cover' />
        <div className='button'
          onClick={this.handleClick.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
          tabIndex={0}
        >
          {buttonContent}
        </div>
        <div className='content' onClick={this.props.preventClose
          ? undefined : this.handleClick.bind(this)}
        >
          { this.props.children }
        </div>
      </div>
    );
  }
}