import React, { Component } from 'react'
import { AccountHttp, PublicAccount, NetworkType } from 'nem2-sdk'
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

const accountHttp = new AccountHttp('http://localhost:3000')

class Transactions extends Component {
  constructor(props) {
    super(props)

    const public_key = localStorage.getItem('public_key') === null ? '' : JSON.parse(localStorage.getItem('public_key'))
    this.state = {
      transactions: [],
      input: {
        public_key,
      },
    }
  }

  componentDidMount() {
    try {
      const originAccount = PublicAccount.createFromPublicKey(this.state.input.public_key, NetworkType.MIJIN_TEST)
      accountHttp.transactions(originAccount).subscribe(
        total => {
          this.setState({
            transactions: total,
          })
          console.log(total)
        },
        err => console.error(err)
      )
    } catch (e) {
      console.log(e)
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

  handleGetTransactions() {
    if (this.state.input.public_key.length === 64) {
      try {
        const originAccount = PublicAccount.createFromPublicKey(this.state.input.public_key, NetworkType.MIJIN_TEST)
        accountHttp.transactions(originAccount).subscribe(
          total => {
            this.setState({
              transactions: total,
            })
            console.log(total)
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
              NEMトランザクションの取得
            </Typography>
          </Box>
          <Box p={1}>
            <Typography variant="body1" gutterBottom>
              ネムのカタパルトユーザーの公開鍵を入力
            </Typography>
            <TextField
              label="Public Key"
              name="public_key"
              onChange={this.handleFormInputChanged.bind(this)}
              value={this.state.input.public_key}
              margin="normal"
              styles={{ width: '100%' }}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={this.handleGetTransactions.bind(this)}>
              取得
            </Button>
          </Box>
          <Box p={1}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>受取手</TableCell>
                    <TableCell>量</TableCell>
                    <TableCell>メッセージ</TableCell>
                    <TableCell>日時</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ wordBreak: 'break-all' }}>
                  {this.state.transactions.map((row, index) => {
                    const date = row.deadline.value._date
                    const time = row.deadline.value._time
                    return (
                      <TableRow key={index}>
                        <TableCell>{row.recipient.address}</TableCell>
                        <TableCell>
                          {row.signer.publicKey === this.state.input.public_key ? '-' : '+'}
                          {row.mosaics[0].amount.compact() / 1000000}
                        </TableCell>
                        <TableCell>{row.message.payload}</TableCell>
                        <TableCell>
                          {date._year +
                            '/' +
                            date._month +
                            '/' +
                            date._day +
                            ' ' +
                            time._hour +
                            ':' +
                            time._minute +
                            ':' +
                            time._second}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Box>
      </Container>
    )
  }
}

export default Transactions
