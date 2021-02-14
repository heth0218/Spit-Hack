import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Components/Navbar'
import Signin from './Components/Pre-Login/Signin'
import Signup from './Components/Pre-Login/Signup'
import Dashboard from './Components/Analytics/Dashboard'
import AddOutlet from './Components/Analytics/AddOutlet'
import GetOutlet from './Components/Analytics/GetOutlets'
import MyAnalytics from './Components/Analytics/ViewAnalytics'
import Comparison from './Components/Analytics/Comparison'
import ViewAnalytics from './Components/Analytics/ViewAnalytics';

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path='/' component={Signin} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/dashboard'>
              <Navbar content={Dashboard} />
            </Route>
            <Route exact path='/add-outlet'>
              <Navbar content={AddOutlet} />
            </Route>
            <Route exact path='/get-outlet'>
              <Navbar content={GetOutlet} />
            </Route>
            <Route exact path='/my-analytics'>
              <Navbar content={ViewAnalytics} />
            </Route>
            <Route exact path='/comparison'>
              <Navbar content={Comparison} />
            </Route>
          </Switch>
        </Router>
      </div>
    </>
  );
}

export default App;
