import { Component } from "react";
import {isEmail} from "validator";
import axios from "axios";


class SignIn extends Component {
    constructor(props) {
        super();
        this.state = {
            email: "",
            password: "",
            isEmail: true,
            error: ""
        }
    }

    setInput = (key, value) => {
        this.setState({[key]:value});
    }

    onSignIn = () => {
        if (isEmail(this.state.email)) {
            this.setState({isEmail: true})
            axios.post("https://exam-panel.herokuapp.com/student/signin", this.state)
                .then(res => {
                    this.props.setToken(res.data.token);
                })
                .catch((err) => {
                    const error = err.response.data.error;
                    this.setState({error});
                })
        } else {
            this.setState({isEmail: false})
        }
    }

    render() {
        const {setInput, onSignIn} = this
        return (
            <main className="pa4 black-80">
                <div className="measure center">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f4 fw6 ph0 mh0">Sign In</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input className="pa2 input-reset ba bg-transparent w-100" type="email" name="email-address"  id="email-address" onInput={(event) => setInput("email", event.target.value)} />
                    </div>
                    {this.state.isEmail || <p>Invalid Email</p>}
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input className="b pa2 input-reset ba bg-transparent w-100" type="password" name="password"  id="password" onInput={(event) => setInput("password", event.target.value)} />
                    </div>
                    {this.state.error && <p>{this.state.error}</p>}
                    </fieldset>
                    <div className="">
                    <button className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" onClick={onSignIn} >Sign In</button>
                    </div>
                    <div className="lh-copy mt3">
                    </div>
                </div>
            </main>
        )
    }
}

export default SignIn