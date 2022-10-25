import React, { Component, Children } from 'react';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';

import menus from '../menus';

import './mainMenu.scss';
import logoImage from '../image/logo.png';

class MenuList extends Component {
  render() {
    const { className, menus, header, children, user } = this.props;
    return (
      <ul className={classNames(className, 'menu-list')}>
        { header }
        { Children.map(menus.props.children, (route, key) => {
          if (route.props.name == null) return false;
          if(route.props.permission != null&&!route.props.permission(user)) return false;
          return (
            <li className='menu-item' key={key}>
              {
                route.props.path ? (<NavLink to={route.props.path}>
                  {route.props.name}
                </NavLink>)
                : (<a>{route.props.name}</a>)
              }

              { route.props.children && (
                <MenuList user={user} menus={route} />
              )}
            </li>
          );
        })}
        { children }
      </ul>
    );
  }
}

export default class MainMenu extends Component {
  render() {
    const { onLogout, user } = this.props;
    // Scan the menus file and construct menu
    return (
      <MenuList className='main-menu' user={user} menus={menus} header={
        <li className='menu-item logo'>
          <Link to='/visualNotices'>
          {/* <img src={logoImage} alt='logo' /> */}
          </Link>
        </li>
      }>
      </MenuList>
    );
  }
}
