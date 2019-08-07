import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core'
import React, { Component } from 'react'
import { NetworkType, Password, SimpleWallet } from 'nem2-sdk'

class NewAccount extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address: '',
      prettyAddress: '',
      publicKey: '',
      privateKey: '',
      input: {
        walletName: '',
        password: '',
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

  handleCreateWallet() {
    if (this.state.input.password.length >= 8) {
      const password = new Password(this.state.input.password)
      const wallet = SimpleWallet.create(this.state.input.walletName, password, NetworkType.MIJIN_TEST)
      const account = wallet.open(password)
      this.setState({
        address: account.address.address,
        prettyAddress: account.address.pretty(),
        publicKey: account.publicKey,
        privateKey: account.privateKey,
      })
    }
  }

  render() {
    return (
      <Container maxWidth="md">
        <Box m={2}>
          <Box p={1}>
            <Typography variant="h4" gutterBottom>
              NEMアカウントの作成
            </Typography>
          </Box>
          <Box p={1}>
            <Typography variant="body1" gutterBottom>
              ウォレット名
            </Typography>
            <TextField
              label="Wallet Name"
              name="walletName"
              onChange={this.handleFormInputChanged.bind(this)}
              value={this.state.input.walletName}
              margin="normal"
              fullWidth
            />
          </Box>
          <Box p={1}>
            <Typography variant="body1" gutterBottom>
              ウォレットの新しいパスワード
            </Typography>
            <TextField
              label="Password"
              name="password"
              onChange={this.handleFormInputChanged.bind(this)}
              value={this.state.input.password}
              margin="normal"
              fullWidth
            />
          </Box>
          <Box pt={3}>
            <Button variant="contained" color="primary" onClick={this.handleCreateWallet.bind(this)}>
              作成
            </Button>
          </Box>
        </Box>
        <Box p={1}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ラベル</TableCell>
                  <TableCell>値</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ wordBreak: 'break-all' }}>
                <TableRow>
                  <TableCell>アドレス</TableCell>
                  <TableCell>{this.state.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ハイフン有りアドレス</TableCell>
                  <TableCell>{this.state.prettyAddress}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>公開鍵</TableCell>
                  <TableCell>{this.state.publicKey}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>秘密鍵</TableCell>
                  <TableCell>{this.state.privateKey}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Container>
    )
  }
}

export default NewAccount
