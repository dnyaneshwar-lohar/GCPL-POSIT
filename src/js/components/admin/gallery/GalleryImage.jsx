import React, { Component } from "react";
import ReactDOM from "react-dom";
import Resizer from "react-image-file-resizer";
import { message } from "antd";
import { withRouter } from "react-router-dom";
import Datetime from "react-datetime";
import Moment from "moment";
import { Modal, Select, Upload, Button, Form } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "./Gallery.css"
const { Option } = Select;
const { Dragger } = Upload;

class GalleryImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addImage: false,
      selectYear: "",
      selectedFile: null,
      imagePreviewUrl: null,
      enableButton: true,
      enableYear: true,
      newData: "",
      allinsertedimages: [],
      allinsertedimagestatus: false,
      fileError: false,
      dropdownList: [],
      fileList: [],
    };
    this.selectYear = this.selectYear.bind(this);
  }

  show = () => {
    var currentdate = new Date().getFullYear();
    this.setState({
      addImage: true,
      selectYear: currentdate - 1,
      allinsertedimagestatus: false,
    });
  };

  onHide = () => {
    this.setState({
      addImage: false,
      enableButton: true,
      enableYear: true,
      fileError: false,
      fileList: [],
      value: "Select Year",
    });
  };

  submit = () => {
    for (var i = 0; i < this.state.newData.length; i++) {
      fetch("http://localhost:4000/addImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nostalgic_gallery: {
            image: this.state.newData[i][1],
            imageName: this.state.newData[i][0],
            tournamentYear: this.state.selectYear,
          },
        }),
      });
    }
    this.setState(
      {
        addImage: false,
        enableButton: true,
        enableYear: true,
        fileList: [],
        value: "Select Year",
      },
      () => {
        this.props.currentdata();
      }
    );
    message.success("Successfully uploaded", 3);
  };
  selectYear = (value) => {
    this.setState({
      selectYear: value,
      value: value,
      enableYear: false,
    });
  };

  updateFileList = () => {
    const formData = [];
    if (this.state.fileList.length > 8) {
      this.setState({
        fileError: true,
        enableButton: true,
      });
    } else if (this.state.fileList.length == 0) {
      this.setState({
        enableButton: true,
      });
    } else {
      for (const file of this.state.fileList) {
        const disneyCharacter = [];
        disneyCharacter.push(file.name);
        Resizer.imageFileResizer(
          file,
          900,
          900,
          "JPEG",
          100,
          0,
          (uri) => {
            disneyCharacter.push(uri);
          },
          "base64"
        );
        formData.push(disneyCharacter);
      }
      this.setState({
        newData: formData,
        fileError: false,
        enableButton: false,
      });
    }
  };

  validateDate = (date) => {
    var moment = Moment(date);
    var currentdate = new Date().getFullYear();

    return (
      moment.isBefore(currentdate.toString()) &&
      moment.isAfter(new Date().setFullYear("2010"))
    );
  };

  componentDidMount() {
    var dropdown = [];
    var min = 1,
      max = 6;
    var currentYear = new Date().getFullYear();
    for (var i = min; i < max; i++) {
      dropdown.push(currentYear - i);
    }
    this.setState({ dropdownList: dropdown });
  }

  render() {
    const { fileList } = this.state;
    const props = {
      accept: ".png, .JPG, .JPEG",
      multiple: true,
      onRemove: (file) => {
        this.setState(
          (state) => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
              fileList: newFileList,
            };
          },
          () => {
            this.updateFileList();
          }
        );
      },
      beforeUpload: (file) => {
        this.setState(
          (state) => ({
            fileList: [...state.fileList, file],
          }),
          () => {
            this.updateFileList();
          }
        );
        return false;
      },
      fileList,
    };
    return (
      <div className="container py-3 mt-2 mb-3 text-center">
        <Button type="primary" onClick={this.show}>
          Upload Image
        </Button>
        <div>
          <Modal
            title="Upload Image"
            style={{ fontSize: "4vh" }}
            visible={this.state.addImage}
            onCancel={this.onHide}
            footer={null}
          >
            <Form>
              <div className="col-4 mb-2">
                <Select
                  className={"selectStyle"}
                  defaultValue={"Select year"}
                  onChange={this.selectYear}
                  value={this.state.value}
                >
                  {this.state.dropdownList.map((data) => (
                    <Option key={data} value={data}>
                      {data}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="col-8 mb-2" >
                <Dragger {...props} className="draggerStyle" >
                  <p className="ant-upload-drag-icon mt-2">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload.
                  </p>
                </Dragger>
                {this.state.fileError && (
                  <p style={{ color: "red" }}>Select upto 8 files</p>
                )}
              </div>

              <div >
                <Button
                  className="uploadStyle"
                  type="primary"
                  onClick={this.submit}
                  disabled={this.state.enableButton || this.state.enableYear}
                >
                  Upload
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withRouter(GalleryImage);
