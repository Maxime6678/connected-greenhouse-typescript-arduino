import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Index from './Routes/Index'
import Login from './Routes/Login'
import Panel from './Routes/Panel'

function App() {
    return (
        <Router>
            <Route path="/" exact component={Index} />
            <Route path="/login" component={Login} />
            <Route path="/panel" component={Panel} />
        </Router>
    );
}

export default App
