import { Account, Deadline, NetworkType, TransferTransaction, TransactionHttp, PublicAccount } from 'nem2-sdk'
import { Box, Button, Container, TextField, Typography } from '@material-ui/core'
import React, { Component } from 'react'

class EncryptMessage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      input: {
        public_key: '',
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

  handleSendMessage() {
    if (this.state.input.public_key.length === 64) {
      try {
        const privateKey = process.env.REACT_APP_PRIVATE_KEY
        const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST)

        const RecipientAccount = PublicAccount.createFromPublicKey(this.state.input.public_key, NetworkType.MIJIN_TEST)

        const encryptedMessage = account.encryptMessage(this.state.input.message, RecipientAccount)

        const transferTransaction = TransferTransaction.create(
          Deadline.create(),
          RecipientAccount.address,
          [],
          encryptedMessage,
          NetworkType.MIJIN_TEST
        )

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
              暗号化メッセージを含むトランザクションの作成
            </Typography>
          </Box>
          <Box p={1}>
            <Typography variant="body1" gutterBottom>
              受け手の公開鍵
            </Typography>
            <TextField
              label="Recipient Public Key"
              name="public_key"
              onChange={this.handleFormInputChanged.bind(this)}
              value={this.state.input.public_key}
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
            <Button variant="contained" color="primary" onClick={this.handleSendMessage.bind(this)}>
              送金
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }
}

export default EncryptMessage
