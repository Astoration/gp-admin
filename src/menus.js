import React, { Component } from 'react';

export class Route extends Component {
}

// Just using JSX for nothing
export default (
  <Route>
    <Route path='/businesses' name='현안사업 관리'/>
    <Route path='/items' name='공약사업 관리'/>
    <Route name="데이터관리">
      <Route path='/datas1' name='현황지표 관리'/>
      <Route path='/datas2' name='연도별추이 관리'/>
    </Route>
    <Route path='/accounts' name='관리 계정 목록'/>
    <Route path='/config' name='관리 설정'/>
  </Route>
);
