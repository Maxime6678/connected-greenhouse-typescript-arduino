import React from 'react'
import { Link } from 'react-router-dom'
class Index extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Link to="protected">Protected</Link>
            </div>
        )
    }

}

export default Index