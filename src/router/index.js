import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from '../view/app';

import Index from '../view/index';
import InputDataList from '../view/inputDataList';
import UserList from '../view/userList';
import PlaceList from '../view/placeList';
import CommentList from '../view/commentList';
import DatingList from '../view/datingList';
import CalendarList from '../view/calendarList';
import SystemLogList from '../view/systemLogList';
import SalesList from '../view/salesList';
import QuizList from '../view/quizList';
import BusinessList from '../view/businessList';
import AccountList from '../view/accountList';
import ConfigPage from '../view/configPage';
import ItemList from '../view/itemList';

const Router = () => (
  <App>
    <Switch>
      <Route
        key="businesses"
        path='/businesses'
        render={() => (
          <Switch>
            <Route
              exact
              path='/businesses'
              render={(props) => <BusinessList {...props} />}
            />
            <Route
              path='/businesses/:id'
              render={(props) => <BusinessList {...props} />}
            />
          </Switch>
        )}
      />
      <Route
        key="teachers"
        path='/teachers'
        render={() => (
          <Switch>
            <Route
              exact
              path='/teachers'
              render={(props) => <UserList userType={0} {...props} />}
            />
            <Route
              path='/teachers/:id'
              render={(props) => <UserList userType={0} category="notice" {...props} />}
            />
          </Switch>
        )}
      />
      <Route
        path='/datas1'
        key='datas1'
        render={() => (
          <Switch>
            <Route
              exact
              path='/datas1'
              key='datas1'
              render={(props) => <InputDataList {...props}/>}
            />
            <Route
              path='/datas1/:id'
              key='datas1'
              render={(props) => <InputDataList {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/datas2'
        key='datas2'
        render={() => (
          <Switch>
            <Route
              exact
              path='/datas2'
              key='datas2'
              render={(props) => <InputDataList {...props}/>}
            />
            <Route
              path='/datas2/:id'
              key='datas2'
              render={(props) => <InputDataList {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data2'
        key='data2'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data2'
              key='data2'
              render={(props) => <InputDataList category="조총여" {...props}/>}
            />
            <Route
              path='/data2/:id'
              key='data2'
              render={(props) => <InputDataList category="조총여" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data3'
        key='data3'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data3'
              key='data3'
              render={(props) => <InputDataList category="북남" {...props}/>}
            />
            <Route
              path='/data3/:id'
              key='data3'
              render={(props) => <InputDataList category="북남" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data4'
        key='data4'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data4'
              key='data4'
              render={(props) => <InputDataList category="북여" {...props}/>}
            />
            <Route
              path='/data4/:id'
              key='data4'
              render={(props) => <InputDataList category="북여" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data5'
        key='data5'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data5'
              key='data5'
              render={(props) => <InputDataList category="상남" {...props}/>}
            />
            <Route
              path='/data5/:id'
              key='data5'
              render={(props) => <InputDataList category="상남" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data6'
        key='data6'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data6'
              key='data6'
              render={(props) => <InputDataList category="상여" {...props}/>}
            />
            <Route
              path='/data6/:id'
              key='data6'
              render={(props) => <InputDataList category="상여" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data7'
        key='data7'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data7'
              key='data7'
              render={(props) => <InputDataList category="가평남" {...props}/>}
            />
            <Route
              path='/data7/:id'
              key='data7'
              render={(props) => <InputDataList category="가평남" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data8'
        key='data8'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data8'
              key='data8'
              render={(props) => <InputDataList category="가평여" {...props}/>}
            />
            <Route
              path='/data8/:id'
              key='data8'
              render={(props) => <InputDataList category="가평여" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data9'
        key='data9'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data9'
              key='data9'
              render={(props) => <InputDataList category="청평남" {...props}/>}
            />
            <Route
              path='/data9/:id'
              key='data9'
              render={(props) => <InputDataList category="청평남" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data10'
        key='data10'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data10'
              key='data10'
              render={(props) => <InputDataList category="청평여" {...props}/>}
            />
            <Route
              path='/data10/:id'
              key='data10'
              render={(props) => <InputDataList category="청평여" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data11'
        key='data11'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data11'
              key='data11'
              render={(props) => <InputDataList category="설악남" {...props}/>}
            />
            <Route
              path='/data11/:id'
              key='data11'
              render={(props) => <InputDataList category="설악남" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/data12'
        key='data12'
        render={() => (
          <Switch>
            <Route
              exact
              path='/data12'
              key='data12'
              render={(props) => <InputDataList category="설악여" {...props}/>}
            />
            <Route
              path='/data12/:id'
              key='data12'
              render={(props) => <InputDataList category="설악여" {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/quizs'
        render={() => (
          <Switch>
            <Route
              exact
              path='/quizs'
              render={(props) => <QuizList {...props}/>}
            />
            <Route
              path='/quizs/:id'
              render={(props) => <QuizList {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/datings'
        render={() => (
          <Switch>
            <Route
              exact
              path='/datings'
              render={(props) => <DatingList {...props}/>}
            />
            <Route
              path='/datings/:id'
              render={(props) => <DatingList {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/comments'
        render={() => (
          <Switch>
            <Route
              exact
              path='/comments'
              render={(props) => <CommentList {...props}/>}
            />
            <Route
              path='/comments/:id'
              render={(props) => <CommentList {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/datingCalendars'
        key="dating"
        render={() => (
          <Switch>
            <Route
              exact
              path='/datingCalendars'
              render={(props) => <CalendarList matching={true} {...props}/>}
            />
            <Route
              path='/datingCalendars/:id'
              render={(props) => <CalendarList matching={true} {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/meetingCalendars'
        key="meeting"
        render={() => (
          <Switch>
            <Route
              exact
              path='/meetingCalendars'
              render={(props) => <CalendarList matching={false} {...props}/>}
            />
            <Route
              path='/meetingCalendars/:id'
              render={(props) => <CalendarList matching={false} {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/systemLogs'
        render={() => (
          <Switch>
            <Route
              exact
              path='/systemLogs'
              render={(props) => <SystemLogList {...props}/>}
            />
            <Route
              path='/systemLogs/:id'
              render={(props) => <SystemLogList {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/sales'
        key={'saleLogs'}
        render={() => (
          <Switch>
            <Route
              exact
              path='/sales'
              render={(props) => <SalesList {...props}/>}
            />
            <Route
              path='/sales/:id'
              render={(props) => <SalesList {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/accounts'
        key={'accounts'}
        render={() => (
          <Switch>
            <Route
              exact
              path='/accounts'
              render={(props) => <AccountList index={1} {...props}/>}
            />
            <Route
              path='/accounts/:id'
              render={(props) => <AccountList index={1} {...props}/>}
            />
          </Switch>
        )}
      />
      <Route
        path='/items'
        key={'items'}
        render={() => (
          <Switch>
            <Route
              exact
              path='/items'
              render={(props) => <ItemList {...props}/>}
            />
            <Route
              path='/items/:id'
              render={(props) => <ItemList {...props}/>}
            />
          </Switch>
        )}
      />
      <Route path={'/config'} key={'config'} component={ConfigPage}/>
    </Switch>
  </App>
);

export default Router;
