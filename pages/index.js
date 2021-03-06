import React, { Component } from "react";
import { Card, Button, Table } from "semantic-ui-react";
import tracker from "../ethereum/tracker";
import Layout from "../components/Layout";
import AssetRow from "../components/AssetRow";

class AssetTracker extends Component {
  static async getInitialProps(props) {
    const buyers = await tracker.methods.getbuyers().call();
    const producers = await tracker.methods.getproducers().call();
    const assetCount = await tracker.methods.assetsCount().call();

    let assets = await Promise.all(
      Array(parseInt(assetCount))
        .fill()
        .map((element, index) => {
          return tracker.methods.assets(index).call();
        })
    );
    return {
      buyers,
      producers,
      assets,
      assetCount,
    };
  }

  renderbuyers() {
    const items = this.props.buyers.map((address) => {
      return {
        header: address,
        description: "",
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }
  renderproducers() {
    const items = this.props.producers.map((address) => {
      return {
        header: address,
        description: "",
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  renderRows() {
    return this.props.assets.map((asset, index) => {
      return <AssetRow key={index} id={index} asset={asset} />;
    });
  }
  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3> List of all producers! </h3>
        <div>{this.renderproducers()}</div>
        <div>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"
          />

          <h3> List of all Purchesers! </h3>
          {this.renderbuyers()}
        </div>
        <h3> Asset details! </h3>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Manufacturer</HeaderCell>
              <HeaderCell>Price</HeaderCell>
              <HeaderCell>Address of Owner</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
      </Layout>
    );
  }
}

export default AssetTracker;
