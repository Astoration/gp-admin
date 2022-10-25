import React, { Component } from 'react';

import './login.scss';
import Overlay from '../component/overlay';

import loginLogo from '../image/logo.png';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  handleSubmit(e) {
    let { email, password } = e.target;
    this.props.onLogin(email.value, password.value)
    .then(result => {
      if (result === false) {
        this.setState({ error: result });
        email.value = '';
        password.value = '';
      }
    });
    e.preventDefault();
  }
  render() {
    return (
      <Overlay>
        <div className='login-container'>
          <div className='header'>
          {/* <img src={loginLogo} alt='logo' /> */}
          </div>
          <div className='form'>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <input name='email' type='text' placeholder='ID' />
              <input name='password' type='password' placeholder='Password' />
              <div className='footer'>
                <input type='submit' value='로그인' />
              </div>
            </form>
          </div>
        </div>
      </Overlay>
    );
  }
}