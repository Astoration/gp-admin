import React, { Component } from 'react';
import classNames from 'classnames';

import './overlay.scss';

export default class Overlay extends Component {
  render() {
    return (
      <div className={classNames('overlay', this.props.className)}>
        <div className='container'>
          <div className='message'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}