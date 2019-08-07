import { Switch, BrowserRouter as Router } from 'react-router-dom'
import React from 'react'

import Home from './pages/Home'
import Layout from './components/Layout'
import RouteWithLayout from './components/RouteWithLayout'

function App() {
  return (
    <Router>
      <Switch>
        <RouteWithLayout extract path="/" layout={Layout} component={Home} />
      </Switch>
    </Router>
  )
}

export default App
