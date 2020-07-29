import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SerchForm/SearchForm';
import ResultTable from '../components/ResultTable/ResultTable';

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Home() {
  const [query, getQuery] = useState('');
  const [loadedResults, getloadedResults] = useState(0);
  const [totalResults, gettotalResults] = useState(0);
  const [parts, getparts] = useState([]);
  const handleQuery = (que) => {
    getloadedResults(0);
    gettotalResults(0);
    getparts([]);
    getQuery(que)
  }
 
  useEffect(() => { 
    const fetchData = async () => {
    if (!query) { return }
    const result = await axios(
      `/api/${loadedResults}/${encodeURIComponent(query)}`,
    );
    // return console.log(result.data.Parts)
    getparts([...parts,...result.data.Parts]);
    gettotalResults(result.data.NumberOfResult);
    };
    fetchData();
},[query,loadedResults]);

const loadMore = () => {
    getloadedResults(parts.length);
}
console.log(totalResults, parts.length)

  return (
      <main>
<div className="container">
      <SearchForm onSubmit={handleQuery}/>
      {parts.length>0 && <InfiniteScroll
      scrollThreshold={0.99}
 dataLength={parts.length}
 next={loadMore}
 hasMore={totalResults>parts.length}
 loader={<div className="loader" key={0}>Loading ...</div>}
>
       <ResultTable items={parts} />
      {/* { isError && <div>failed to load</div>}
      { query && isLoading && <div>loading...</div>}
      // {!searchResults && !query&& !isError && <div>Try to find something by mouser API! Just put what you need to search, for example IRF540 and press ENTER!</div>} */}
      </InfiniteScroll>}
      </div>
      

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
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
