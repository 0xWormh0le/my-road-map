import React from 'react';
import { Link } from 'react-router-dom'
import { DesktopHeader } from '../common';
import { BottomNav } from '../common';




export default function PageNotFound() {
  return (
    <>
    <DesktopHeader/>
    <div className="common-page-not-found mrm-py-2">
      <h1 className="text-center">Sorry, this page isn't available.</h1>
      <p className="text-center">The link you followed may be broken, or the page may have been removed.</p>
      <Link to="/dashboard" className="d-block text-center">Go back to app home</Link>
    </div>
    <BottomNav/>
    </>
  );
}
