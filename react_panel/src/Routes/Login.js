import React from 'react'
import { Redirect } from 'react-router-dom'

class Panel extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLogin: true
        }
    }

    render() {
        if (!this.state.isLogin) return <Redirect to="/login" />

        return (
            <div></div>
        )
    }

}

export default Panel