import React, { Component } from 'react';

export default class Enlarge extends Component {
    render() {
        return (
            <div>
            {/* Modal */ }
            < div className = "modal-dialog" role = "document" >
                <div className="modal-content">
                    <div className="modal-header" style={{ marginLeft: '90%' }}>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <h3 style={{ textAlign: 'left' }}>John Doe requested this spot</h3>
                        <div className="ownerside" style={{ width: '50%', float: 'left', marginTop: '5%' }}>
                            <h3>Parking Spot Name</h3>
                            <h3>Street Name:</h3>
                            <h3>City,State,Zip</h3>
                        </div>
                        <div className="ownerside" style={{ width: '50%', float: 'left', marginTop: '5%' }}>
                            <h3>Rate:</h3>
                            <h3>Start Time:</h3>
                            <h3>End Time:</h3>
                            <h3>Total Time:</h3>
                        </div>
                        <hr />
                        <div className="driverside" style={{ width: '50%', float: 'left', marginTop: '5%' }}>
                            <h2>Renter</h2>
                            <h3>Name</h3>
                            <h3>Phone Number</h3>
                        </div>
                        <div className="driverside" style={{ width: '50%', float: 'left', marginTop: '5%' }}>
                            <h2>Vehicle</h2>
                            <h3>2000 Nissan Maxima Silver</h3>
                            <h3>Lisence Plate: ER45JN</h3>
                        </div>
                    </div>
                    <div className="modal-footer" style={{ float: 'left' }}>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary">Create</button>
                    </div>
                </div>
            </div >
          </div>  
    );
  }
}