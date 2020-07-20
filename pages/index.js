import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SerchForm/SearchForm';
import ResultTable from '../components/ResultTable/ResultTable'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useResult (query) {
  const { data, error } = useSWR(`/api/${query}`, query ? fetcher : null);
  return {
    products: data,
    isLoading: !error && !data,
    isError: error
  }
}

export default function Home() {
const [query, getQuery] = useState('');
const { products, isLoading, isError } = useResult(query);
console.log('data', products)

  return (
      <main>
      <div className="container">
      <SearchForm onSubmit={getQuery}/>
      { isError && <div>failed to load</div>}
      { products && <ResultTable items={products} />}
      { query && isLoading && <div>loading...</div>}
      {!products && !query&& !isError && <div>Try to find something by mouser API! Just put what you need to search, for example IRF540 and press ENTER!</div>}
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
