import React, { Component } from 'react';
import './app.scss';
import { Link, withRouter } from 'react-router-dom';
import MainMenu from '../component/mainMenu';
import Login from '../container/login';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';
import Popup from 'reactjs-popup';
import { getCurrentUser, login, logout, patchPassword } from '../api';
export const UserContext = React.createContext({user: null});
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }
  async componentDidMount() {
    let { status, body } = await getCurrentUser();
    if (status === 200) this.setState({ user: body });
  }
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  async onRouteChanged() {
    let { status, body } = await getCurrentUser();
    if (status === 200) this.setState({ user: body });
  }

  async login(email, password) {
    let { status, body } = await login(email, password);
    if (status === 200) {
      let user = body;
      if (!user.isAdmin) return false;
      cookie.save('Authorization','Bearer ' + user.access_token );
      this.setState({ user: user });
      return true;
    }
    return false;
  }
  async changePassword(e) {
    let { oldPassword, passwordNew,passwordConfirm } = e.target;
    if(passwordNew.value != passwordConfirm.value){
      alert('비밀번호가 다릅니다');
      return false;
    }
    let { status, body } = await patchPassword({password: oldPassword.value, newPassword: passwordNew.value});
    if (status === 200) {
      alert('변경되었습니다');
      return true;
    }
    return false;
  }
  async logout() {
    let { status } = await logout();
    if (status === 200) {
      this.setState({ user: null });
      return true;
    }
    return false;
  }
  getChildContext() {
    return { user: this.state.user };
  }
  render() {
    let { children } = this.props;
    if (this.state.user == null) {
      return <Login onLogin={this.login.bind(this)} />;
    }
    return (
      <div className='app'>
        <UserContext.Provider value={this.state}>
          <div style={{position:'absolute',height:'30px', top: 0, left:'14em', width: 'calc(100% - 16em)', padding: '1em', background: 'white', borderBottom:'1px solid #d9d9d9'}}>
            <span style={{verticalAlign: 'middle', margin: 'auto', lineHeight: '1.8em'}}>{this.state.user.name}님 안녕하세요.</span>
            <span style={{verticalAlign: 'middle', margin: 'auto', marginLeft: '7px', paddingLeft:'7px' , borderLeft: '1px solid #888', lineHeight: '1.8em', fontSize:'0.6em'}}>오늘 방문 <Link to={"/meetingCalendars"} style={{color:'red',fontWeight:'bold'}}>{this.state.user.todayMeetingCounts || 0}</Link> 건</span>
            <Popup trigger={<button className="logout" style={{right: '120px', width:'8em'}}>비밀번호 변경</button>} modal={true}>
                { (onClose) =>(
              <div>
                  <form style={{width:'500px',margin:'auto'}} onSubmit={this.changePassword.bind(this)}>
                  <div>
                    <label style={{width:'150px',display:'inline-block'}} for="pw1">기존 비밀번호</label>
                    <input name="oldPassword" type="password" id="pw1"/>
                  </div>  
                  <div>
                    <label style={{width:'150px',display:'inline-block'}} for="pw2">비밀번호</label>
                    <input name="passwordNew" type="password" id="pw2"/>
                  </div>  
                  <div>
                  <label style={{width:'150px',display:'inline-block'}} for="pw3">비밀번호 확인</label>
                    <input name="passwordConfirm" type="password" id="pw3"/>
                  </div>  
                  <button type="submit">변경</button>
                  <button onClick={onClose.bind(null)}>닫기</button>
                  </form>
                </div>)
                }
            </Popup> 
              <button className="logout" onClick={this.logout.bind(this)}>로그아웃</button>
          </div>
          <div className='side-menu'>
            <MainMenu user={this.state.user} />
          </div>
          <div className='content'>
            {children}
          </div>
        </UserContext.Provider>
      </div>
    );
  }
}

export default withRouter(App);

App.childContextTypes = {
  user: PropTypes.object,
};
