import { createChart, CrosshairMode, ISeriesApi } from 'lightweight-charts'
import * as React from 'react'
import { cryptoHttp } from '../../http'
import { Legend } from '../Legend'
import './index.css'

interface ChartProps {
  coin: string
}

export const Chart: React.FC<ChartProps> = (props: any) => {
  const { coin } = props
  const containerRef = React.useRef() as React.MutableRefObject<HTMLDivElement>
  const candleSeriesRef = React.useRef() as React.MutableRefObject<ISeriesApi<'Candlestick'>>
  const [prices, setPrices] = React.useState<any>([])
  const [chartLoaded, setChartLoaded] = React.useState(false)

  React.useEffect(() => {
    const interval = setInterval(() => {
      cryptoHttp.get(`histominute?fsym=${coin}&tsym=BRL&limit=300`).then(response => {
        setPrices((prevState: any) => {
          const price = response.data.Data[1]
          const newPrice = {
            time: price.time,
            low: price.low,
            high: price.high,
            open: price.open,
            close: price.close,
            volume: price.volumefrom,
          }
          candleSeriesRef.current.update(newPrice)
          return [...prevState, newPrice]
        })
      })
    }, 600000)

    return () => clearInterval(interval)
  }, [coin])

  React.useEffect(() => {
    if (!chartLoaded) {
      return
    }

    cryptoHttp.get(`histoday?fsym=${coin}&tsym=BRL&limit=300`).then(response => {
      const prices = response.data.Data.map((row: any) => ({
        time: row.time,
        low: row.low,
        high: row.high,
        open: row.open,
        close: row.close,
        volume: row.volumefrom,
      }))
      setPrices(prices)
    })
  }, [coin, chartLoaded])

  React.useEffect(() => {
    if (candleSeriesRef.current) {
      candleSeriesRef.current.setData(prices)
    }
  }, [prices])

  React.useEffect(() => {
    setPrices([])
  }, [coin])

  React.useEffect(() => {
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        backgroundColor: '#253248',
        textColor: 'rgba(255, 255, 255, 0.9)'
      },
      grid: {
        vertLines: {
          color: '#253248',
        },
        horzLines: {
          color: '#253248',
        }
      },
      crosshair: {
        mode: CrosshairMode.Normal
      },
      // @ts-ignore
      priceScale: {
        borderColor: '#485c7b'
      },
      timeScale: {
        borderColor: '#485c7b'
      }
    })

    candleSeriesRef.current = chart.addCandlestickSeries({
      upColor: '#4bff5b',
      borderUpColor: '#4bff5b',
      downColor: '#ff4979',
      borderDownColor: '#ff4979',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    })
    setChartLoaded(true)
  }, [])

  return <div className='Chart' ref={containerRef}>
    <Legend legend={coin} />
  </div>
}