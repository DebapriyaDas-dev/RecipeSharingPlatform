import React, { Component } from 'react';
import UserService from '../service/UserService';

class UserComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{}
        }
    }

    componentDidMount() {
        UserService.getUser().then((response) => {
            this.setState({ id: response.data.id })
            this.setState({ name: response.data.name })
            this.setState({ email: response.data.email })

            console.log(this.state.id)
            console.log(this.state.name)
            console.log(this.state.email)
            console.log(this.state.password)

        })
    }


    render() {
        return (
            <div>
                <div className='container card offset-md-3'>
                    <h3 className='text-center card-header'>View User Details</h3>
                    <div className='row'>
                        <p><strong>User ID : </strong>{this.state.id}</p>
                    </div>
                    <div className='row'>
                        <p><strong>User Name : </strong>{this.state.name}</p>
                    </div>
                    <div className='row'>
                        <p><strong>Email ID : </strong>{this.state.email}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserComponent;