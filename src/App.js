import { Switch, BrowserRouter as Router } from 'react-router-dom'
import React from 'react'

import Account from './pages/Account'
import Home from './pages/Home'
import Layout from './components/Layout'
import NewAccount from './pages/NewAccount'
import NewTransaction from './pages/NewTransaction'
import NewWallet from './pages/NewWallet'
import RouteWithLayout from './components/RouteWithLayout'
import Transactions from './pages/Transactions'

function App() {
  return (
    <Router>
      <Switch>
        <RouteWithLayout path="/transactions/new" layout={Layout} component={NewTransaction} />
        <RouteWithLayout path="/transactions" layout={Layout} component={Transactions} />
        <RouteWithLayout path="/wallet/new" layout={Layout} component={NewWallet} />
        <RouteWithLayout path="/account/new" layout={Layout} component={NewAccount} />
        <RouteWithLayout path="/account" layout={Layout} component={Account} />
        <RouteWithLayout extract path="/" layout={Layout} component={Home} />
      </Switch>
    </Router>
  )
}

export default App
