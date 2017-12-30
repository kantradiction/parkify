import React, { Component } from 'react';
import P from './../../../Images/p.png';
import Profile from './../../../Images/profile.png';

export default class Sample extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-default header">
                    <img src={P} className="logo" />
                    <h2 className="title"> <strong>Parkify</strong> </h2>
                    <img src={Profile} className="profile" />
                    <button style={{ float: 'right' }} className="btn btn-success">Logout</button>
                </nav>
                <div className="container-fluid jumbotron parkingGarage">
                    <div className="row">
                        <button className="btn btn-success menu">Menu
            </button></div>
                    <br />
                    <div className="row" />
                </div>
            </div>
        );
    }
}