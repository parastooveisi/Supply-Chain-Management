import React, { Fragment, Component } from "react";
import Layout from "../../components/Layout";
import { Card, Button, Table } from "semantic-ui-react";
import tracker from "../../ethereum/tracker";
import GoogleMapReact from "google-map-react";

class History extends Component {
  static defaultProps = {
    center: {
      lat: 52.13,
      lng: -106.66,
    },

    zoom: 6,
  };

  static async getInitialProps(props) {
    const lengthOwners = await tracker.methods
      .lengthOwners(props.query.id)
      .call();
    let addresscounts = await tracker.methods.zipCounts().call();

    let owners = await Promise.all(
      Array(parseInt(lengthOwners))
        .fill()
        .map((element, index) => {
          return tracker.methods.owners(props.query.id, index).call();
        })
    );

    let addressArray = await Promise.all(
      Array(parseInt(addresscounts))
        .fill()
        .map((element, index) => {
          return tracker.methods.zipcodes(props.query.id, index).call();
        })
    );

    const myLatLng = addressArray.map((coords) => {
      const [lat, lng] = coords.split(",").map(Number);
      return {
        lat,
        lng,
      };
    });
    console.log(myLatLng);
    const address = { addressArray };

    return {
      lengthOwners,
      owners,
      myLatLng,
    };
  }
  renderMarkers(map, maps) {
    let i;
    for (i = 0; i < this.props.myLatLng.length; i++) {
      let marker = new maps.Marker({
        position: this.props.myLatLng[i],
        map,
      });
      let infowindow = new google.maps.InfoWindow({
        content: "Owner" + (i + 1) + ": " + this.props.owners[i],
      });
      marker.addListener("click", function () {
        infowindow.open(map, marker);
      });
    }
  }

  renderPolylines(map, maps) {
    /** Example of rendering geodesic polyline */
    let geodesicPolyline = new maps.Polyline({
      path: this.props.myLatLng,
      geodesic: true,
      strokeColor: "#00a1e1",
      strokeOpacity: 1.0,
      strokeWeight: 4,
      icons: [
        {
          icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
          offset: "100%",
          repeat: "20px",
        },
      ],
    });
    geodesicPolyline.setMap(map);
  }

  renderowners() {
    const items = this.props.owners.map((address) => {
      return {
        header: address,
        description: "",
        meta: "Agriculture",
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }
  render() {
    return (
      <Layout>
        <h3> List of all previous owners! </h3>
        <div>{this.renderowners()}</div>
        <div style={{ height: "70vh", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyDD7IK1UnUiDLbxu0I3R7LkDK1J2GJfPNc",
            }}
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => (
              this.renderMarkers(map, maps), this.renderPolylines(map, maps)
            )}
          ></GoogleMapReact>
        </div>
      </Layout>
    );
  }
}
export default History;
