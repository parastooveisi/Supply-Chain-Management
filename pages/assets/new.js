import React, { Component } from "react";

import { Form, Button, Message, Input } from "semantic-ui-react";
import tracker from "../../ethereum/tracker";
import Layout from "../../components/Layout";
import { Link } from "../../routes";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class AssetNew extends Component {
  state = {
    name: "",
    description: "",
    manufacturer: "",
    price: "",
    zipcode: "",
    amountToStake:"",
    loading: false,
    errorMessage: ""
  };

  onSubmit = async event => {
    event.preventDefault();
    const { name, description, manufacturer, price, zipcode, amountToStake} = this.state;
    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await tracker.methods
        .createAsset(name, description, manufacturer, price, zipcode)
        .send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.amountToStake, "ether"),
          gas: "1000000"
        });

        // var d = new Date().toLocaleTimeString(); // for now
        // console.log(d);

      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3> Register New Product </h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Name</label>
            <Input
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Manufacturer</label>
            <Input
              value={this.state.manufacturer}
              onChange={event =>
                this.setState({ manufacturer: event.target.value })
              }
            />
          </Form.Field>

          <Form.Field>
            <label>Price</label>
            <Input
              value={this.state.price}
              onChange={event => this.setState({ price: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Coordinates</label>
            <Input
              value={this.state.zipcode}
              onChange={event => this.setState({ zipcode: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Stake</label>
            <Input
              value={this.state.amountToStake}
              onChange={event => this.setState({ amountToStake: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default AssetNew;
