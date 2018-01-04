import React, { Component } from 'react';


export default class Create extends Component {
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
                            <h3 style={{ textAlign: 'center' }}>Create Parking Space</h3>
                            <form>
                                <input className="form-control" style={{ width: '90%', marginTop: '5%', float: 'left' }} placeholder=" Street Name" />
                                <input className="form-control" style={{ width: '90%', marginTop: '5%', float: 'left' }} placeholder=" Street #2" />
                                <input className="form-control" style={{ width: '30%', marginTop: '5%', float: 'left' }} placeholder=" City" />
                                <input className="form-control" style={{ width: '30%', float: 'left', marginTop: '5%' }} placeholder=" State" />
                                <input className="form-control" style={{ width: '30%', float: 'left', marginTop: '5%' }} placeholder=" Zip" />
                                <label style={{ width: '30%', float: 'left' }}>Rate: (per hour)&gt;<select className="form-control" id="question01" name="question1" style={{ float: 'left', width: '50%' }} value="$10">
                                    <option>$1</option>
                                    <option>$2</option>
                                    <option>$3</option>
                                    <option>$4</option>
                                    <option>$5</option>
                                    <option>$6</option>
                                    <option>$7</option>
                                    <option>$8</option>
                                    <option>$9</option>
                                    <option>$10</option>
                                </select>
                                </label>
                            </form>
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