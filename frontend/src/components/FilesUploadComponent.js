import React, { Component } from 'react';
export default class FilesUploadComponent extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <form encType='multipart/formdata'>
            <div className="form-group">
              <input type="file" multiple />
              <button
                className="btn btn-primary"
                type="submit"
                style={{ height: '45px' }}
              >
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
