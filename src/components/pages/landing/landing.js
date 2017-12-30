import React, { Component } from 'react';
import P from './../../../Images/p.png';
import './landing.css';

export default class Landing extends React.Component {
    render() {
        return (
            <div className="back-grd">
                <nav className="navbar navbar-default headman">
                    <img src={P} className="logo" />
                    <h2 className="title"> <strong>Parkify</strong> </h2>
                    <form className="form-inline formatter invisible" method="POST" action="/dashboard">
                        <label htmlFor> Email </label>
                        <input className="form-control mr-sm-2 emails" placeholder="email" aria-label="Search" type="text" />
                        <div>
                        <label>Password</label>
                        </div>

                        <input className="form-control mr-sm-2 passwords" placeholder="password" aria-label="Search" type="password" />
                        <button type="submit" className="btn btn-info login">Login</button>
                    </form>
                    <button className="btn btn-primary driver"> Driver </button>
                    <button className="btn btn-success owner"> Owner</button>
                </nav>

                <div className="container">
                    <div className="row jumbotron brand">
                        <div className="col-xs-6">
                            <h2 className="sub">Finally find a parking spot the you need  in just seconds</h2>
                            <img src="assets/images/phone.ico" className="sublogo" />
                            <h4 className="subsub">Look for available parking spots in seconds</h4>
                            <img src="assets/images/thumbs.png" className="sublogo" />
                            <h4 className="subsub">Reserve and pay the owner his fee</h4>
                            <img src="assets/images/space.png" className="sublogo" />
                            <h4 className="subsub">You just got a parking space!</h4>
                        </div>
                        <div className="col-xs-5">
                            <h3><b>Sign Up</b></h3>
                            <h5><strong>Millions of empty parking spots are waiting for you!</strong></h5>

                            <div className="inputContainer">
                                <form>
                                    <input className="form-control infos" id="first" placeholder="First name" type="text" />
                                    <input className="form-control infos info" id="last" placeholder="Last name" type="text" />
                                    <input className="form-control info" placeholder="Email" type="email" />
                                    <input className="form-control info" placeholder="Password" type="password" />
                                    <br />
                                    <input name="gender" defaultValue="male" className="info" type="radio" /> Owner &nbsp;&nbsp;
                                    <input name="gender" defaultValue="female" type="radio" /> Driver
                                    <br />
                                    <button type="submit" className="btn btn-primary btn-md signup"> SignUp </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}