import './tabList.scss';
import { Link, NavLink } from 'react-router-dom';
import React, { Component, Children, cloneElement } from 'react';
import classNames from 'classnames';

export class TabEntry extends Component {
  render() {
    const { children, selected } = this.props;
    return (
      <li className={classNames('tab-entry', { selected })}>
        {Children.map(children, (child, id) => (
            cloneElement(child)
          ))}
      </li>
    );
  }
}

export default class TabList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.defaultSelected || 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.defaultSelected,
    });
  }
  handleChange(id) {
    this.setState({ selected: id });
  }
  render() {
    const { selected } = this.state;
    const { children } = this.props;
    
    return (
      <div className='tab-list'>
        <ul className='tab-indexes'>
          {Children.map(children, (child, id) => (
            child.props.link != null
              ? <NavLink className={classNames('tab-index-entry', { selected: id === selected })} to={child.props.link} style={{ textDecoration: 'none' }}>
                {child.props.name}
              </NavLink>
              : <li onClick={this.handleChange.bind(this, id)} className={classNames('tab-index-entry', { selected: id === selected })}>
                {child.props.name}
              </li>
          ))}
        </ul>
        <ul className='tab-entries'>
          {Children.map(children, (child, id) => (
            cloneElement(child, { selected: id === selected })
          ))}
        </ul>
      </div>
    );
  }
}
