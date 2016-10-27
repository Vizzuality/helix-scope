import React from 'react';
import NewsCover from 'components/news/NewsCover';
import NewsArticles from 'components/news/NewsArticles';

function NewsAndInsights() {
  const articles = [
    {
      title: 'Poster: Flood risk assessment in Europe at 4ºC global warming',
      content: 'by Professor Richard Betts , University of Exeter and Met Office Hadley Centre The Paris Agreement aims to limit global warming to well below 2°C above pre-industrial, and to ‘pursue...'
    },
    {
      title: 'Is CO2 fertilisation our get-out-of-jail-free card?',
      content: 'Our Assembly this year includes a public discussion exploring potential connections between environmental migrants and climate change, you can see us at Storify...'
    },
    {
      title: 'The challenge of communicating unwelcome climate messages',
      content: 'Our Assembly this year includes a public discussion exploring potential connections between environmental migrants and climate change, you can see us at Storify...'
    }
  ];
  return (
    <div className="l-news">
      <div className="row">
        <div className="column">
          <NewsCover
            title="Improving glacial behaviour for climate modelling, @climateparis2015"
            content="Response to Matt Ridley by Richard Betts In Monday's Times
              newspaper, Matt Ridley wrote an article entitled: Now here’s the
              good news on global warming: Activists may want to shut down debate..."
          />
        </div>
      </div>
      <NewsArticles articles={articles} />
    </div>
  );
}

export default NewsAndInsights;
