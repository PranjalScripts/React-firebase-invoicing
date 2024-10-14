import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { firebase } from "FirebaseAuth/Firebase";
import InvoiceLayout from "../Layout/Component/InvoiceLayout";
import AdminLayout from "../Layout/Component/AdminLayout";
import AuthLayout from "../Layout/Component/AuthLayout";
import PreClientComponents from "../Views/Client/component/PreClientComponents";
import AddEntry from "../Views/ClientEntry/component/AddEntry";
import EditEntry from "../Views/ClientEntry/component/EditEntry";
import PreSheetComponents from "../Views/Sheet/component/PreSheetComponent";
import AddEntryBySheet from "../Views/Sheet/component/AddEntryBySheet";
import EditEntrySheet from "../Views/Sheet/component/EditEntry";
import ErrorPage from "../Views/Error/component/ErrorPage";

export default function App() {
  const [user, setUser] = useState({ uid: null, email: "" });
  const [darkMode] = useState(() => {
    const mode = window.localStorage.getItem("mode");
    return mode === "true";
  });

  useEffect(() => {
    const checkUser = () => {
      firebase.isInitialized((currentUser) => {
        if (currentUser) {
          setUser({ uid: currentUser.uid, email: currentUser.email });
        } else {
          setUser({ uid: null, email: "" });
        }
      });
    };
    checkUser();
  }, []);

  const routes = () => (
    <>
      <Route
        path="/admin"
        render={(props) => <AdminLayout {...props} {...user} />}
      />
      <Route
        path="/client/:id"
        exact
        render={(props) => <PreClientComponents {...props} uid={user.uid} darkModeFlag={darkMode} />}
      />
      <Route
        path="/sheet/:id"
        exact
        render={(props) => <PreSheetComponents {...props} uid={user.uid} darkModeFlag={darkMode} />}
      />
      <Route exact path="/error" component={ErrorPage} />
      <Route exact path="/client/:uid/:id/entry/new" component={AddEntry} />
      <Route exact path="/sheet/:id/entry/new/:date" component={AddEntryBySheet} />
      <Route exact path="/client/:uid/:id/edit" component={EditEntry} />
      <Route exact path="/sheet/:uid/:id/edit" component={EditEntrySheet} />
      <Route exact path="/invoice" component={InvoiceLayout} />
    </>
  );

  return (
    <BrowserRouter>
      <Switch>
        {user.uid ? (
          <>
            {routes()}
            <Route exact path="/" render={() => <Redirect to="/admin/index" />} />
            <Route exact path="/admin" render={() => <Redirect to="/admin/index" />} />
            <Route exact path="/client" render={() => <Redirect to="/admin/index" />} />
          </>
        ) : (
          <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        )}
      </Switch>
    </BrowserRouter>
  );
}
