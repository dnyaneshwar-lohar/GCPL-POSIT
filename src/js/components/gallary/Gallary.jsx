import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Container } from "react-bootstrap";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import ImageGallery from "react-image-gallery";
import "../../../../node_modules/react-image-gallery/styles/scss/image-gallery.scss";
import "../../../../node_modules/react-image-gallery/styles/css/image-gallery.css";
import { base64 } from "base64-js";
import Loader from "react-loader-spinner";
import styles from "./Gallery.css";
import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper } from "simple-react-lightbox";
import { Row, Button, Popconfirm, Select } from "antd";
const { Option } = Select;

class Gallary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesNewId: "",
      image_year: [],
      image_year_id: [],
      isOpen: true,
      tournamentYear: "",
      dropdown: false,
      imagesNew: [],
      images_data: [],
      loader: true,
      contentDisplay: false,
      newTournament: [],
      allDatabaseYear: [],
      displayImage: false,
      upYear: "",
    };
    this.toggleGallery = this.toggleGallery.bind(this);
  }

  componentDidMount() {
    this.getdata();
  }
  getImage = () => {
    var tempImage = [];
    for (var i = 0; i < this.state.images_data.length; i++) {
      if (
        this.state.images_data[i].tournament_year == this.state.tournamentYear
      ) {
        const key1 = "year";
        const value1 = this.state.images_data[i].tournament_year;
        const key2 = "original";
        const value2 = Buffer.from(this.state.images_data[i].image, "utf8");
        const key3 = "thumbnail";
        const disneyCharacter = {
          [key1]: value1,
          [key2]: value2.toString(),
          [key3]: value2.toString(),
        };
        tempImage.push(disneyCharacter);
      }
    }

    this.setState({
      newTournament: tempImage,
    });
  };
  getYear = (allYear, eachYear) => {
    var current_year = 0;
    allYear.map((x, index) => {
      if (!eachYear.includes(x)) {
        eachYear.push(x);
      }
    });
    current_year = Math.max(...eachYear);
    if (eachYear.length > 0) {
      this.setState(
        {
          dropdown: true,
          tournamentYear: current_year,
          upYear: current_year,
          allDatabaseYear: eachYear.sort().reverse(),
        },
        () => {
          this.getImage();
        }
      );
    }
  };

  getdata = () => {
    let eachYear = [],
      allYear = [];
    fetch("http://localhost:4000/getImages")
      .then((response) => response.json())
      .then((findresponse) => {
        this.setState({
          images_data: findresponse.data,
        });
        if (this.state.images_data == undefined) {
          this.setState({
            loader: false,
            displayImage: true,
          });
        } else if (this.state.images_data.length == 0) {
          this.setState({
            loader: false,
            displayImage: true,
          });
        } else {
          for (var i = 0; i < this.state.images_data.length; i++) {
            allYear.push(this.state.images_data[i].tournament_year);
          }
          this.getYear(allYear, eachYear);
          this.setState({ displayImage: false });
        }
      })
      .then((findresponse) => {
        var year = this.state.tournamentYear;

        this.lightBoxImage(year);
      });
  };
  lightBoxImage = (year) => {
    var image_tournament = [];
    var image_id_tournament = [];
    for (var j = 0; j < this.state.allDatabaseYear.length; j++) {
      var temp_image = [];
      var temp_id = [];
      const key1 = this.state.allDatabaseYear[j];
      for (var i = 0; i < this.state.images_data.length; i++) {
        if (
          this.state.allDatabaseYear[j] ===
          this.state.images_data[i].tournament_year
        ) {
          const value1 = Buffer.from(this.state.images_data[i].image, "utf8");
          temp_image.push(value1);
          temp_id.push(this.state.images_data[i].image_id);
        }
      }
      const disneyCharacter = { [key1]: temp_image };
      image_tournament.push(disneyCharacter);
      const disneyCharacter2 = { [key1]: temp_id };
      image_id_tournament.push(disneyCharacter2);
    }
    if (image_tournament.length > 0) {
      this.setState({
        image_year: image_tournament,
        image_year_id: image_id_tournament,
        imagesNew: image_tournament[0][year],
        imagesNewId: image_id_tournament[0][year],
        loader: false,
        contentDisplay: true,
      });
    }
  };

  toggleGallery = (year) => {
    for (var i = 0; i < this.state.allDatabaseYear.length; i++) {
      if (this.state.allDatabaseYear[i] == year) {
        this.setState({
          imagesNew: this.state.image_year[i][year],
          imagesNewId: this.state.image_year_id[i][year],
        });
      }
    }
  };

  selectYear = (event) => {
    this.setState(
      {
        tournamentYear: event,
        value: event,
      },
      () => {
        this.getImage();
        this.toggleGallery(this.state.tournamentYear);
      }
    );
  };
  render() {
    const newImages2 = this.state.imagesNew;
    const { isOpen } = this.state;
    const styleTab = {
      marginTop: "2%",
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    };
    const options = {
      transitionTimingFunction: "ease-in-out",
      slideTransitionSpeed: 1000,
      buttonsIconPadding: "2px",
      buttonsIconColor: "rgba(25, 136, 124, 0.5)",
      enablePanzoom: false,
      hideControlsAfter: 0,
    };
    return (
      <div>
        <section>
          <div>
            <div className="container">
              <div style={styleTab}>
                {this.state.displayImage && (
                  <h1 style={{ textAlign: "center" }}>No Image Found</h1>
                )}
                <div className="loaderStyle">
                  {this.state.loader && (
                    <Loader
                      type="TailSpin"
                      color="#00BFFF"
                      height={100}
                      width={100}
                    />
                  )}
                </div>
                <div>
                  {this.state.contentDisplay && !this.state.displayImage && (
                    <div className="imageGalleryborder">
                      <ImageGallery
                        items={this.state.newTournament}
                        showNav={true}
                        showFullscreenButton={false}
                        showPlayButton={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div>
          {this.state.dropdown && !this.state.displayImage && (
            <div className="container mt-5">
              <div className="d-flex justify-content-center mb-3">
                <div>
                  <Select
                    defaultValue={"Select year"}
                    style={{ width: 200, fontSize: "3vh" }}
                    onChange={this.selectYear}
                    value={this.state.value}
                  >
                    <Option> Select Year </Option>
                    {this.state.allDatabaseYear.map((years, index) => (
                      <Option key={index} value={years}>
                        {years}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="title h1 text-center">
                <h1 style={{ fontSize: "5vh" }}>
                  Tournament Year {this.state.tournamentYear}
                </h1>
              </div>
              <div className="about-border"></div>
            </div>
          )}
        </div>
        <section>
          <div>
            {isOpen && (
              <div className="container-fluid py-3  mb-3">
                <SimpleReactLightbox>
                  <SRLWrapper options={options}>
                    <Row justify="center">
                      {newImages2.map((image, index) => (
                        <div
                          key={index}
                          className="containerdata mt-2 mb-3 ml-2"
                        >
                          <img className="SRLstyle" src={image} />
                        </div>
                      ))}
                    </Row>
                  </SRLWrapper>
                </SimpleReactLightbox>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }
}

export default Gallary;
