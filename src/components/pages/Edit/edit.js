import React, { Component } from 'react';

export default class Edit extends Component {
    render() {
        return (
 
            <div className="modal-dialog" role="document" >
                <div className="modal-content">
                    <div className="modal-header" style={{ marginLeft: '90%' }}>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <h3 style={{ textAlign: 'left' }}>Edit Parking Spot</h3>
                        <form>
                            <input style={{ width: '100%', marginTop: '5%' }} className="form-control" defaultValue=" Airport Parking" />
                            <input style={{ width: '100%', marginTop: '5%' }} className="form-control" defaultValue=" 123 Street" />
                            <input style={{ width: '100%', marginTop: '5%' }} className="form-control" />
                            <input style={{ width: '30%', marginTop: '5%', float: 'left' }} className="form-control" defaultValue=" Phoenix" />  <input style={{ width: '30%', marginTop: '5%', float: 'left' }} className="form-control" defaultValue=" AZ" />  <input style={{ width: '30%', marginTop: '5%', float: 'left' }} className="form-control" defaultValue={87363} />
                            <br />
                            <h5 style={{ marginTop: '10%' }}>Rate(per hour):</h5>

                            <select className="form-control" id="question01" name="question1" style={{ float: 'left', width: '30%', marginTop: '4.5%', marginRight: '5%' }}>
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
                        </form>
                        </div>
                    <div className="modal-footer" style={{ float: 'left' }}>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-primary">Create</button>
                    </div>
                </div>
            </div>
    );
  }
}