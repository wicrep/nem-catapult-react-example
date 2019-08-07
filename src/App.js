import { Switch, BrowserRouter as Router } from 'react-router-dom'
import React from 'react'

import Account from './pages/Account'
import Home from './pages/Home'
import Layout from './components/Layout'
import RouteWithLayout from './components/RouteWithLayout'

function App() {
  return (
    <Router>
      <Switch>
        <RouteWithLayout path="/account" layout={Layout} component={Account} />
        <RouteWithLayout extract path="/" layout={Layout} component={Home} />
      </Switch>
    </Router>
  )
}

export default App
