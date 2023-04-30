import {Switch, Route, Redirect} from 'react-router-dom'

import Login from './components/Login/index'
import Home from './components/Home/index'
import ProtectedRoute from './components/ProtectedRoute/index'
import Popular from './components/Popular/index'
import Account from './components/Account/index'
import NotFound from './components/NotFound/index'
import MovieItemDetails from './components/MovieItemDetails/index'
import Search from './components/Search/index'
import './App.css'

const App = () => {
  // const [value,setValue] = useState()

  const test = 'Sample'

  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/popular" component={Popular} />
      <ProtectedRoute exact path="/account" component={Account} />
      <ProtectedRoute exact path="/movies/:id" component={MovieItemDetails} />
      <ProtectedRoute exact path="/search" component={Search} test={test} />
      <Route exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  )
}

export default App
