import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CLink
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Button } from 'reactstrap'
import * as firebase from '../utilities/firebase';
import { Redirect } from 'react-router-dom';

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  };

  const [redirect,setRedirect] = useState(null);

  const handleLogout = () => {
    firebase.auth.signOut();
    setRedirect(<Redirect to="/login"/>)
  }

  return (
    <CHeader withSubheader>
      {redirect}
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none">
        <h1>Admin Panel</h1>
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/dashboard">Name Hardware Store Admin Panel</CHeaderNavLink>
        </CHeaderNavItem>
        
        
        
      </CHeaderNav>

      {/* <CSubheader className="px-3 justify-content-between">
          <div className="d-md-down-none mfe-2 c-subheader-nav">
            
            
            <CLink 
              className="c-subheader-nav-link" 
              aria-current="page" 
              to="/dashboard"
            >
              <CIcon name="cil-graph" alt="Dashboard" />&nbsp;Product List
            </CLink>
            <CLink 
              className="c-subheader-nav-link" 
              aria-current="page" 
              to="/dashboard/add"
            >
              <CIcon name="cil-graph" alt="Dashboard" />&nbsp;New Product
            </CLink>
            
          </div>
      </CSubheader> */}
      
    </CHeader>
  )
}

export default TheHeader
