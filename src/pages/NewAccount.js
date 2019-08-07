import { Account, NetworkType } from 'nem2-sdk'
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
  Typography,
} from '@material-ui/core'
import React, { Component } from 'react'

class NewAccount extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address: '',
      prettyAddress: '',
      publicKey: '',
      privateKey: '',
    }
  }

  handleCreateAccount() {
    const account = Account.generateNewAccount(NetworkType.MIJIN_TEST)
    this.setState({
      address: account.address.address,
      prettyAddress: account.address.pretty(),
      publicKey: account.publicKey,
      privateKey: account.privateKey,
    })
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
          <Box pt={3}>
            <Button variant="contained" color="primary" onClick={this.handleCreateAccount.bind(this)}>
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
