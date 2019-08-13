import {
  Box,
  Button,
  Card,
  CardContent,
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
import { Listener, Address } from 'nem2-sdk'
import { timeout } from 'rxjs/operators'
import React, { Component } from 'react'

class Monitoring extends Component {
  constructor(props) {
    super(props)
    this.state = {
      input: {
        address: '',
      },
      listener: null,
      blockNumber: '',
      unconfirmedTransactions: [],
      transactions: [],
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

  handleMonitoringTx() {
    if (this.state.input.address.length === 40 || this.state.input.address.length === 46) {
      if (this.state.listener != null) {
        this.state.listener.close()
      }

      const url = 'http://localhost:3000'
      const wsEndpoint = url.replace('http', 'ws')
      const listener = new Listener(wsEndpoint, WebSocket)

      const address = Address.createFromRawAddress(this.state.input.address)

      this.setState({
        listener: listener,
      })

      listener.open().then(() => {
        listener
          .newBlock()
          .pipe(timeout(30000))
          .subscribe(
            block => {
              this.setState({
                blockNumber: block.height.compact(),
              })
              console.log('New block created:' + block.height.compact())
            },
            error => {
              console.error(error)
              listener.terminate()
            }
          )

        listener.unconfirmedAdded(address).subscribe(
          ignored => {
            this.setState({
              unconfirmedTransactions: [ignored].concat(this.state.unconfirmedTransactions),
            })
            console.log('Transaction status changed to unconfirmed')
          },
          error => console.error(error)
        )

        listener.confirmed(address).subscribe(
          ignored => {
            this.setState({
              transactions: [ignored].concat(this.state.transactions),
            })
            console.log('Transaction confirmed')
          },
          error => console.error(error)
        )
      })
    }
  }

  render() {
    return (
      <Container maxWidth="md">
        <Box m={2}>
          <Box p={1}>
            <Typography variant="h4" gutterBottom>
              トランザクションの監視
            </Typography>
          </Box>
          <Box p={1}>
            <Typography variant="body1" gutterBottom>
              監視するアドレス
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
            <Button variant="contained" color="primary" onClick={this.handleMonitoringTx.bind(this)}>
              監視する
            </Button>
          </Box>

          <Box pt={1}>
            <Typography variant="h6" gutterBottom>
              ブロックサイズの監視
            </Typography>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  現在のブロックサイズ
                </Typography>
                <Typography variant="h5" component="h2">
                  {this.state.blockNumber}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box pt={3}>
            <Typography variant="h6" gutterBottom>
              未承認トランザクションの監視
            </Typography>

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
                  {this.state.unconfirmedTransactions.map((row, index) => {
                    const date = row.deadline.value._date
                    const time = row.deadline.value._time
                    return (
                      <TableRow key={index}>
                        <TableCell>{row.recipient.address}</TableCell>
                        <TableCell>{row.mosaics[0].amount.compact() / 1000000}</TableCell>
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

          <Box pt={3}>
            <Typography variant="h6" gutterBottom>
              承認されたトランザクションの監視
            </Typography>

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
                        <TableCell>{row.mosaics[0].amount.compact() / 1000000}</TableCell>
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

export default Monitoring
