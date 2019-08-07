import React, { Component } from 'react'
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
import { AccountHttp, Address } from 'nem2-sdk'

const accountHttp = new AccountHttp('http://localhost:3000')

class Account extends Component {
  constructor(props) {
    super(props)

    const address = localStorage.getItem('address') === null ? '' : JSON.parse(localStorage.getItem('address'))

    this.state = {
      input: {
        address,
      },
      public_key: '',
      mosaic: 0,
      importance: 0,
    }
  }

  componentDidMount() {
    if (this.state.input.address.length === 40 || this.state.input.address.length === 46) {
      try {
        const address = Address.createFromRawAddress(this.state.input.address)

        accountHttp.getAccountInfo(address).subscribe(
          accountInfo => {
            this.setState({
              public_key: accountInfo.publicKey,
              mosaic: accountInfo.mosaics[0].amount.compact(),
              importance: accountInfo.importance.compact(),
            })
            console.log(accountInfo)
          },
          err => console.error(err)
        )
      } catch (e) {
        console.log(e)
      }
    }
  }

  handleFormInputChanged(event) {
    this.setState({
      input: {
        ...this.state.input,
        [event.target.name]: event.target.value,
      },
    })
    localStorage.setItem(event.target.name, JSON.stringify(event.target.value))
  }

  handleGetAddressInfo() {
    if (this.state.input.address.length === 40 || this.state.input.address.length === 46) {
      try {
        const address = Address.createFromRawAddress(this.state.input.address)

        accountHttp.getAccountInfo(address).subscribe(
          accountInfo => {
            this.setState({
              public_key: accountInfo.publicKey,
              mosaic: accountInfo.mosaics[0].amount.compact(),
              importance: accountInfo.importance.compact(),
            })
            console.log(accountInfo)
          },
          err => console.error(err)
        )
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
              NEMアカウント情報の取得
            </Typography>
          </Box>
          <Box p={1}>
            <Typography variant="body1" gutterBottom>
              ネムのカタパルトユーザーのアドレスを入力
            </Typography>
            <TextField
              label="Address"
              name="address"
              onChange={this.handleFormInputChanged.bind(this)}
              value={this.state.input.address}
              margin="normal"
              styles={{ width: '100%' }}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={this.handleGetAddressInfo.bind(this)}>
              取得
            </Button>
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
                    <TableCell>{this.state.input.address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>公開鍵</TableCell>
                    <TableCell>{this.state.public_key}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>モザイク</TableCell>
                    <TableCell>{this.state.mosaic}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>インポータンス</TableCell>
                    <TableCell>{this.state.importance}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Box>
      </Container>
    )
  }
}

export default Account
