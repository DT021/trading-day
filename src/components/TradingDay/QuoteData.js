import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import {
  Rail,
  Grid,
  Segment,
  Header,
  Image,
  Container,
  Label
} from "semantic-ui-react";

import Clock, { ReactFitText } from "react-live-clock";

import StatsPrice from "./StatsPrice";
import StatsDetails from "./StatsDetails";
import DarkButtons from "../coolook/DarkButtons";
import NewsItems from "./NewsItems";

import NotFound from "../TradingDay/NotFound";
import LineChart from "../TradingDay/Charts/LineChart";

import { quoteFormatting } from "../../utils/format";
import setTitle from "../../utils/title";

import placeholder from "../../assets/iex-logo.png";
import HeikinAshi from "../simple-stock-tracker/HeikinAshi";
import { StylizedCandleStickChart } from "./Charts/StylizedCandlestick";

const PeerPerformance = ({ peers, peerData }) => {
  return peers.map((peer, i) => (
    <LineChart
      style={{ display: "inlineBlock" }}
      key={`${i}-${peerData[peer].quote.symbol}`}
      name={peerData[peer].quote.symbol}
      companyName={peerData[peer].quote.companyName}
      data={peerData[peer].chart}
      latestPrice={peerData[peer].quote.latestPrice}
      changePercent={peerData[peer].quote.changePercent}
      volume={peerData[peer].quote.latestVolume}
      width='150'
      height='75'
    />
  ));
};

const QuoteData = props => {
  if (props.data && props.charts) {
    // format quote data
    const { quote, stats, logo, news } = props.data;

    const display = quoteFormatting(quote, stats);
    setTitle(display.symbol, display.latestPrice);
    const [activePeriod, setActivePeriod] = useState("1Y");
    // set img
    const [imgSrc, setImgSrc] = useState(logo.url);
    useEffect(() => {
      setImgSrc(logo.url);
    }, [logo.url]);

    const handleErr = e => {
      setImgSrc(placeholder);
    };
    console.log(props.charts);

    return (
      <Segment>
        <Grid columns={2}>
          <Grid.Column width={3}>
            {imgSrc ? <Image bottom src={imgSrc} size='small' /> : null}
          </Grid.Column>
          <Grid.Column width={12}>
            <Header
              style={{
                fontFamily: "Dancing Script",
                fontSize: "4vw",
                fontWeight: "800"
              }}
              textAlign='center'>
              {display.companyName} ({display.symbol})
            </Header>
            <StatsPrice
              last={display.latestPriceSimple}
              change={display.change}
              percent={display.changePercent}
              color={display.status}
            />
            {/* <svg viewBox='0 0 200 25' style={{ width: "100%" }}>
                <text x='0' y='15'>
                  {display.companyName} ({display.symbol})
                </text>
              </svg> */}
            <Rail attached position='right'>
              <Label>
                <Clock
                  format={"HH:mm:ss"}
                  ticking={true}
                  timezone={"America/New_York"}
                  interval={1000}
                />
              </Label>
            </Rail>
          </Grid.Column>
        </Grid>

        <Segment basic>
          <Grid stackable>
            <StatsDetails data={display} />
            <DarkButtons
              default={"ytd"}
              timeRangeArray={["d1", "m1", "m3", "m6", "y1", "ytd"]}
              clickEffect={setActivePeriod}
            />
            <HeikinAshi
              height={600}
              data={props.charts[activePeriod]}
              type='hybrid'
              ticker={display.symbol}
              xAxis='date'
              yAxis='volume'
            />
            <Segment>
              <StylizedCandleStickChart
                height={600}
                width={900}
                data={props.charts[activePeriod]}
                ticker={display.symbol}
                logo={imgSrc}
              />
            </Segment>
            <Segment>
              {props.peers ? (
                <PeerPerformance
                  peers={props.peers.peers}
                  peerData={props.peers.peerData}
                />
              ) : (
                <h1>NO PEERS</h1>
              )}
            </Segment>
            <NewsItems news={news} />
          </Grid>
        </Segment>
      </Segment>
    );
  }

  return <NotFound />;
};

QuoteData.propTypes = {
  symbol: PropTypes.string,
  data: PropTypes.object
};

QuoteData.defaultProps = {
  symbol: null,
  data: {}
};

export default QuoteData;
