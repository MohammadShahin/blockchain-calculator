import Head from 'next/head'
import React from 'react'
import styles from '../styles/Home.module.css'
import { useAccount, useConnect, useDisconnect, useContract, useSigner } from 'wagmi'
import { calculatorAbi } from '../src/abi'


const OPERTION_TYPES = ['Addition', 'Subtraction', 'Multiplication', 'Division']
const contractAddress = '0xf4dc531Ed25e7874E8A3747a8DBee00093903590'

export default function Home() {

  // Wagmi
  const { address, isConnected } = useAccount()
  const { data: signer } = useSigner()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const contract = useContract({ addressOrName: contractAddress, contractInterface: calculatorAbi, signerOrProvider: signer })

  // Calculator logic
  const [valueX, setValueX] = React.useState(0)
  const [valueY, setValueY] = React.useState(0)
  const [operationType, setOperationType] = React.useState(OPERTION_TYPES[0])
  const [operationResult, setOperationResult] = React.useState<number | undefined>()
  const [errorMessage, setErrorMessage] = React.useState('')


  const getResultFromContract = async (operandX: number, operandY: number, operation: string) => {
    let result;
    switch (operation) {
      case 'Addition':
        result = await contract.add(operandX, operandY);
        break;
      case 'Subtraction':
        result = await contract.sub(operandX, operandY);
        break;
      case 'Multiplication':
        result = await contract.mul(operandX, operandY);
        break;
      case 'Division':
        result = await contract.div(operandX, operandY);
        break;
    }
    result = parseInt(result)
    return result;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const result = await getResultFromContract(valueX, valueY, operationType)
      setOperationResult(result)
      setErrorMessage('')
    }
    catch (e) {
      if (typeof e === "string") {
        setErrorMessage(e)
      } else if (e instanceof Error) {
        setErrorMessage(e.message)
      }
    }
  }

  React.useEffect(() => {
    disconnect()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Calculator</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        {isConnected ?
          <React.Fragment>
            <h1 className={styles.title}>
              Welcome to <span className={styles.blue}>Blockchain Calculator</span>
            </h1>

            <p className={styles.description}>
              Choose the operands X and Y and the type of operation. <br />
              The Calculator works only for positive integers. <br />
              Your address is {address}
            </p>

            <form className={styles.inputs} onSubmit={handleSubmit}>

              <div className={styles.flexRow}>
                <div className={styles.flexColumn}>
                  <label htmlFor="operand-X">X</label>
                  <input id="operand-X" type={'number'} name={'operand-X'} value={valueX} onChange={(e) => setValueX(parseInt(e.target.value))} />
                </div>

                <div className={styles.flexColumn}>
                  <label htmlFor="operand-Y">Y</label>
                  <input id="operand-Y" type={'number'} name={'operand-Y'} value={valueY} onChange={(e) => setValueY(parseInt(e.target.value))} />
                </div>

              </div>

              <div className={styles.flexColumn}>
                <label htmlFor="operation">Operation</label>
                <select id="cars" name="cars" value={operationType} onChange={e => setOperationType(e.target.value)}>
                  {OPERTION_TYPES.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <input type='submit' value="Find Result" />
            </form>

            <div id={styles.result}>
              {
                errorMessage ? (
                  <span className={styles.red}>Operation not completed. The reason: {errorMessage}</span>
                ) : typeof operationResult !== 'undefined' ? (
                  <span className={styles.green}>The result is {operationResult}</span>
                ) : (
                  <span>Choose operands and operation then click the &apos; Find Result &apos; button.</span>
                )
              }
            </div>
          </React.Fragment> :
          <React.Fragment>
            <h1 className={styles.title}>
              Welcome to <span className={styles.blue}>Blockchain Calculator</span>
            </h1>
            <p className={styles.description}>
              Please connect to metamask to continue.
            </p>
            <div className={styles.inputs}>
              <button onClick={() => {
                connect({ connector: connectors[0] })
              }}>Connect Wallet</button>
            </div>
          </React.Fragment>}
      </main>
    </div>
  )
}
