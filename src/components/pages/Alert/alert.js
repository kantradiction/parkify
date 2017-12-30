import React, { Component } from 'react';

export default class Alert extends Component {
    render() {
        return (
            <div>
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                    Launch demo modal
        </button>
                {/* Modal */}
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header" style={{ marginLeft: '90%' }}>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <h3 style={{ textAlign: 'left' }}><strong>Booking Request:</strong> 555 Yum Ave, AZ,98474</h3>
                            <div className="ownerside" style={{ width: '50%', float: 'left', marginTop: '5%' }}>
                                <h3><strong>Renter</strong></h3>
                                <h3>John Doe:</h3>
                                <h3>123-333-4443</h3>
                            </div>
                            <div className="driverside" style={{ width: '50%', float: 'left', marginTop: '5%' }}>
                                <h2><strong>Vehicle</strong></h2>
                                <h3>2000 Nissan Maxima Silver</h3>
                                <h3>Lisence Plate: ER45JN</h3>
                            </div>
                            <hr />
                            <div className="driverside" style={{ width: '50%', float: 'left', marginTop: '5%' }}>
                                <h2><strong>Rate:</strong></h2>
                                <h3>$5/hour</h3>
                                <h3>$10 total</h3>
                            </div>
                            <div className="driverside" style={{ width: '50%', float: 'left', marginTop: '5%' }}>
                                <h2><strong>Duration</strong></h2>
                                <h3>Start Time:</h3>
                                <h3>End Time:</h3>
                                <h3>2 hours</h3>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ float: 'left' }}>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary">Create</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}