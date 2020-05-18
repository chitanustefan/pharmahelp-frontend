import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./common/Homepage";
import Login from "./login/Login";
import Drugs from "./drugs/Drugs";
import AddDrugOnStock from "./drugs/AddDrugOnStock";
import AddPharmacyPage from "./pharmacy/AddPharmacyPage";
import PharmacyPage from "./pharmacy/PharmacyPage";
import { DrugMissing } from "./drugs/DrugMissing";
import RegisterDrugForm from "./drugs/RegisterDrugForm";
import RequestMedForm from "./drugs/RequestDrugForm";
import ErrorPage from "./common/ErrorPage";
import PharmacyStock from "./pharmacy/PharmacyStock";
import PharmacyShop from "./pharmacy/PharmacyShop";
import ShoppingCartPage from "./shop/ShoppingCartPage";
import Review from "./reviews/Review";
import ReviewsToValidate from "./reviews/ReviewsToValidate";
import data from "./config/data.json";
import Search from "./drugs/Search";
import EditPharmacyPage from "./pharmacy/EditPharmacyForm";
import EditDrugForm from "./drugs/EditDrugForm";
import OrderPage from "./order/OrderPage";
import Prescriptions from "./drugs/Prescriptions";
import ActiveSubstance from "./drugs/ActiveSubstance";


function App() {
  
  const loggedUser = localStorage.getItem("accessToken") ? true : false;
  const role = localStorage.getItem("role");
  const roles = data[0]["roles"];

  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route exact path="/" render={() => <Homepage />} />
            <Route exact path="/pharma-help" render={() => <Homepage />} />
            <Route exact path="/pharma-help/login" render={() => <Login />} />
            <Route
              exact
              path="/pharma-help/search-results"
              component={Search}
            />
            <Route
                exact
                path="/pharma-help/shopping-cart"
                render={() => <ShoppingCartPage />}
            />
            <Route
                exact
                path="/cart"
                component={ShoppingCartPage}
            />
            {(loggedUser === true) & (role === roles.admin) ? (
              <Route
                exact
                path="/pharma-help/view-drugs"
                render={() => <Drugs />}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/view-drugs"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.admin) ? (
              <Route
                exact
                path="/pharma-help/active-substance"
                render={() => <ActiveSubstance />}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/view-drugs"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.admin) ? (
              <Route
                exact
                path="/pharma-help/editpharm/"
                component={EditPharmacyPage}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/editpharm"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.admin) ? (
              <Route
                exact
                path="/pharma-help/editdrug/"
                component={EditDrugForm}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/editdrug"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.admin) ? (
              <Route
                exact
                path="/pharma-help/addpharmacy"
                render={() => <AddPharmacyPage />}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/addpharmacy"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) &
            ((role === roles.admin) | (role === roles.pharmacist)) ? (
              <Route
                exact
                path="/pharma-help/add-drug-on-stock"
                render={() => <AddDrugOnStock />}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/add-drug-on-stock"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.pharmacist) ? (
              <Route
                exact
                path="/pharma-help/pharmacy-stock"
                render={() => <PharmacyStock />}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/pharmacy-stock"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.pharmacist) ? (
              <Route
                exact
                path="/pharma-help/validate-reviews"
                render={() => <ReviewsToValidate />}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/validate-reviews"
                render={() => <ErrorPage />}
              />
            )}
            {loggedUser === true ? (
              <Route
                exact
                path="/pharma-help/pharmas"
                render={() => <PharmacyPage />}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/pharmas"
                render={() => <ErrorPage />}
              />
            )}
            {loggedUser === true ? (
              <Route
                exact
                path="/pharma-help/pharmas/:id"
                component={PharmacyShop}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/pharmas"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.patient) ? (
              <Route
                exact
                path="/pharma-help/leave-a-review/:id"
                component={Review}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/leave-a-review/:id"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.patient) ? (
              <Route
                exact
                path="/pharma-help/orderhistory/"
                component={OrderPage}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/orderhistory/"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.patient) ? (
              <Route
                exact
                path="/pharma-help/prescriptions/"
                component={Prescriptions}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/prescriptions/"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.admin) ? (
              <Route
                exact
                path="/pharma-help/drug-missing"
                render={() => <DrugMissing />}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/drug-missing"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) &
            ((role === roles.admin) | (role === roles.pharmacist)) ? (
              <Route
                exact
                path="/pharma-help/register-drug"
                render={() => <RegisterDrugForm />}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/register-drug"
                render={() => <ErrorPage />}
              />
            )}
            {(loggedUser === true) & (role === roles.patient) ? (
              <Route
                exact
                path="/pharma-help/request-med"
                render={() => <RequestMedForm />}
              />
            ) : (
              <Route
                exact
                path="/pharma-help/request-med"
                render={() => <ErrorPage />}
              />
            )}
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
