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
import { TransactionHttp, Account, NetworkType } from 'nem2-sdk'
import React, { Component } from 'react'

class SearchTx extends Component {
  constructor(props) {
    super(props)

    this.state = {
      input: {
        txId: '',
        private_key: '',
      },
      transaction: [],
      account: null,
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

  handleGetTransaction() {
    const account =
      this.state.input.private_key !== ''
        ? Account.createFromPrivateKey(this.state.input.private_key, NetworkType.MIJIN_TEST)
        : null

    const transactionHttp = new TransactionHttp('http://localhost:3000')
    transactionHttp.getTransaction(this.state.input.txId).subscribe(
      transaction =>
        this.setState({
          transaction: [transaction],
          account: account,
        }),
      err => console.error(err)
    )
  }

  render() {
    return (
      <Container maxWidth="md">
        <Box m={2}>
          <Box p={1}>
            <Typography variant="h4" gutterBottom>
              NEMトランザクションの検索
            </Typography>
          </Box>
          <Box p={1}>
            <Typography variant="body1" gutterBottom>
              トランザクションIDまたはハッシュ
            </Typography>
            <TextField
              label="Transaction ID or Hash"
              name="txId"
              onChange={this.handleFormInputChanged.bind(this)}
              value={this.state.input.txId}
              margin="normal"
              fullWidth
            />
          </Box>
          <Box p={1}>
            <Typography variant="body1" gutterBottom>
              受け手のプライベートキー(オプション)
            </Typography>
            <TextField
              label="Recipient private key"
              name="private_key"
              onChange={this.handleFormInputChanged.bind(this)}
              value={this.state.input.private_key}
              margin="normal"
              fullWidth
            />
          </Box>
          <Button variant="contained" color="primary" onClick={this.handleGetTransaction.bind(this)}>
            取得
          </Button>
        </Box>
        <Box p={1}>
          <Paper style={{ overflowX: 'auto', width: '100%' }}>
            <Table style={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ラベル</TableCell>
                  <TableCell>値</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ wordBreak: 'break-all' }}>
                {this.state.transaction.map((row, index) => {
                  const date = row.deadline.value._date
                  const time = row.deadline.value._time
                  return (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>ハッシュ</TableCell>
                        <TableCell>{row.transactionInfo.hash}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ブロック</TableCell>
                        <TableCell>{row.transactionInfo.height.compact()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>日時</TableCell>
                        <TableCell>
                          {date._year +
                            '-' +
                            date._month +
                            '-' +
                            date._day +
                            ' ' +
                            time._hour +
                            ':' +
                            time._minute +
                            ':' +
                            time._second}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>送り手</TableCell>
                        <TableCell>{row.signer.address.address}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>受け手</TableCell>
                        <TableCell>{row.recipient.address}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>量</TableCell>
                        <TableCell>{row.mosaics.map(mosaic => mosaic.amount.compact() / 1000000)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>手数料</TableCell>
                        <TableCell>{row.maxFee.compact()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>メッセージ</TableCell>
                        <TableCell>{row.message.payload}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>複合化メッセージ</TableCell>
                        <TableCell>
                          {this.state.account !== null
                            ? this.state.account.decryptMessage(row.message, row.signer).payload
                            : ''}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      </Container>
    )
  }
}

export default SearchTx
