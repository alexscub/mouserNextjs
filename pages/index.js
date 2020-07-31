import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SerchForm/SearchForm';
import ResultTable from '../components/ResultTable/ResultTable';
import HashLoader from "react-spinners/HashLoader";
import { css } from "@emotion/core";

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Home() {
  const [query, getQuery] = useState('');
  const [isLoading, getLoading] = useState(false);
  const [errors, getErrors] = useState([]);
  const [loadedResults, getloadedResults] = useState(0);
  const [totalResults, gettotalResults] = useState(0);
  const [parts, getparts] = useState([]);

  const handleQuery = (que) => {
    getloadedResults(0);
    gettotalResults(0);
    getparts([]);
    getQuery(que)
    getErrors([])
  }
 
  useEffect(() => { 
    if (query==='') { return }
    const fetchData = async () => {
      getLoading(true)
    const result = await axios(
      `/api/${loadedResults}/${encodeURIComponent(query)}`,
    );
    console.log(result)
    const { SearchResults } = result.data;
    const { Errors } = result.data;
    if (SearchResults) {
    getparts([...parts,...SearchResults.Parts]);
    gettotalResults(SearchResults.NumberOfResult);
    getLoading(false)
    } else if ( Errors ) {
      getErrors(Errors)
      getLoading(false)
    }
    };
    fetchData();
},[query,loadedResults]);

const loadMore = () => {
    getloadedResults(parts.length);
}
// console.log(totalResults, parts.length)

  return (
      <main>
<div className="container">
      <SearchForm onSubmit={handleQuery}/>
      {errors.length>0 && errors.map(err => <p className="message" key={err.Id}>Error! {err.Message}</p>)}
      {parts.length>0 && <InfiniteScroll
      scrollThreshold={0.99}
      dataLength={parts.length}
      next={loadMore}
      hasMore={totalResults>parts.length}
      >
      <p className="message">I found {totalResults} partnumbers in stock!</p>
      <ResultTable items={parts} />
      </InfiniteScroll>}
      {!isLoading && !totalResults  && !errors.length  && <p className="message">Try to find something by mouser API! 
      Just put what you need to search, for example IRF540 (or any other partnumber, 
      manufacturer, etc) and press ENTER! 
      Too much results? Scroll to see more!</p>}
      <div className="spinnerWrapper"><HashLoader
          css={css`
          display: block;
          margin: 0 auto;
        `}
          size={100}
          color={"#123abc"}
          loading={isLoading} />
          </div>
      </div>
      

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .spinnerWrapper {
          padding-top: 50px;
          padding-bottom: 100px;
        }
        .message {
          text-align: center;
          font-size: 18pt;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
      </main>

      
  )
}
