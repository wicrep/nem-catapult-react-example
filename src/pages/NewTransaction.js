import React, { Component } from 'react'
import {
  Account,
  Deadline,
  NetworkType,
  TransferTransaction,
  TransactionHttp,
  PlainMessage,
  NetworkCurrencyMosaic,
  Address,
} from 'nem2-sdk'
import { Box, Button, Container, TextField, Typography } from '@material-ui/core'

class NewTransaction extends Component {
  constructor(props) {
    super(props)

    this.state = {
      input: {
        recipient_address: '',
        amount: '',
        message: '',
      },
    }
  }

  handleFormInputChanged(event) {
    this.setState({
      input: {
        ...this.state.input,
        [event.target.name]: event.target.value,
      },
    })
  }

  handleSendCurrency() {
    if (this.state.input.recipient_address.length === 40 || this.state.input.recipient_address.length === 46) {
      try {
        const transferTransaction = TransferTransaction.create(
          Deadline.create(),
          Address.createFromRawAddress(this.state.input.recipient_address),
          [NetworkCurrencyMosaic.createRelative(parseFloat(this.state.input.amount))],
          PlainMessage.create(this.state.input.message),
          NetworkType.MIJIN_TEST
        )
        const privateKey = process.env.REACT_APP_PRIVATE_KEY
        const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST)
        const signedTransaction = account.sign(transferTransaction, process.env.REACT_APP_NETWORK_GENERATION_HASH)
        const transactionHttp = new TransactionHttp('http://localhost:3000')
        transactionHttp.announce(signedTransaction).subscribe(x => console.log(x), err => console.error(err))
      } catch (e) {
        console.log(e)
      }
    }
  }

  render() {
    return (
      <Container maxWidth="md">
        <Box m={2}>
          <Box p={1}>
            <Typography variant="h4" gutterBottom>
              NEMトランザクションの作成
            </Typography>
          </Box>
          <Box p={1}>
            <Typography variant="body1" gutterBottom>
              受取手のアドレス
            </Typography>
            <TextField
              label="Recipient Address"
              name="recipient_address"
              onChange={this.handleFormInputChanged.bind(this)}
              value={this.state.input.recipient_address}
              margin="normal"
              fullWidth
            />
          </Box>
          <Box p={1}>
            <Typography variant="body1">送金するcat.currencyの量</Typography>
            <TextField
              label="Amount"
              name="amount"
              onChange={this.handleFormInputChanged.bind(this)}
              value={this.state.input.amount}
              margin="normal"
              fullWidth
            />
          </Box>
          <Box p={1}>
            <Typography variant="body1" gutterBottom>
              メッセージ
            </Typography>
            <TextField
              label="メッセージ"
              name="message"
              onChange={this.handleFormInputChanged.bind(this)}
              value={this.state.input.message}
              margin="normal"
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={this.handleSendCurrency.bind(this)}>
              送金
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }
}

export default NewTransaction
